"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

import { Cotisation, Contribution } from "@/lib/supabase";

// ── Fee calculations (unchanged) ──────────────────────────────────
const PAYSTACK_RATE = 0.015;
const PAYSTACK_CAP  = 2000;
const PLATFORM_RATE = 0.01;

function calcPaystackFee(gross: number) { return Math.min(gross * PAYSTACK_RATE, PAYSTACK_CAP); }
function calcPlatformFee(gross: number) { return gross * PLATFORM_RATE; }
function calcNet(gross: number)         { return gross - calcPaystackFee(gross) - calcPlatformFee(gross); }
function grossFromNet(net: number) {
  const threshold = PAYSTACK_CAP / PAYSTACK_RATE;
  const g1 = net / (1 - PAYSTACK_RATE - PLATFORM_RATE);
  if (g1 < threshold) return g1;
  return (net + PAYSTACK_CAP) / (1 - PLATFORM_RATE);
}

const PRESET_AMOUNTS = [1000, 2000, 5000, 10000, 25000, 50000];

function fmt(n: number) { return new Intl.NumberFormat("fr-FR").format(Math.round(n)); }

function daysLeft(deadlineStr: string) {
  const d = new Date(deadlineStr); const t = new Date();
  d.setHours(0,0,0,0); t.setHours(0,0,0,0);
  return Math.ceil((d.getTime() - t.getTime()) / 86400000);
}

// ── Shared tiny components ─────────────────────────────────────────
function Eyebrow({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <span className="eyebrow" style={style}>{children}</span>;
}

function FeeRow({ label, value, muted, bold }: { label: string; value: string; muted?: boolean; bold?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <span style={{ color: muted ? "var(--ink-3)" : "var(--ink-2)" }}>{label}</span>
      <span className="num" style={{ color: muted ? "var(--ink-3)" : "var(--ink)", fontWeight: bold ? 500 : 400 }}>{value}</span>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────
export default function CotisationPublicPage() {
  const params   = useParams();
  const router   = useRouter();
  const slug     = params.slug as string;

  // ── Data state ──
  const [cotisation,    setCotisation]    = useState<Cotisation | null>(null);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState<string | null>(null);

  // ── Form state ──
  const [grossInput,       setGrossInput]       = useState("5000");
  const [netInput,         setNetInput]         = useState("");
  const [contributorName,  setContributorName]  = useState("");
  const [contributorPhone, setContributorPhone] = useState("");
  const [anonymous,        setAnonymous]        = useState(false);

  // ── Payment state ──
  const [submitting,        setSubmitting]        = useState(false);
  const [paymentInitiated,  setPaymentInitiated]  = useState(false);
  const [checkoutUrl,       setCheckoutUrl]       = useState("");
  const [copiedLink,        setCopiedLink]        = useState(false);
  const [showAll,           setShowAll]           = useState(false);

  // ── Fetch + realtime (unchanged logic) ──
  useEffect(() => {
    if (!slug) return;
    async function init() {
      try {
        setLoading(true);
        const { data: cotData, error: cotErr } = await supabase
          .from("cotisations").select("*").eq("slug", slug).maybeSingle();
        if (cotErr) throw cotErr;
        if (!cotData) { setCotisation(null); setLoading(false); return; }
        setCotisation(cotData as Cotisation);

        const { data: contrData, error: contrErr } = await supabase
          .from("contributions").select("*")
          .eq("cotisation_id", cotData.id).eq("status", "paid")
          .order("created_at", { ascending: false });
        if (contrErr) throw contrErr;
        setContributions(contrData as Contribution[]);
        setLoading(false);

        const cotCh = supabase.channel(`pub-cot-${cotData.id}`)
          .on("postgres_changes", { event: "UPDATE", schema: "public", table: "cotisations", filter: `id=eq.${cotData.id}` },
            (p) => setCotisation(p.new as Cotisation))
          .subscribe();

        const contrCh = supabase.channel(`pub-contr-${cotData.id}`)
          .on("postgres_changes", { event: "*", schema: "public", table: "contributions", filter: `cotisation_id=eq.${cotData.id}` },
            async () => {
              const { data: r } = await supabase.from("contributions").select("*")
                .eq("cotisation_id", cotData.id).eq("status", "paid")
                .order("created_at", { ascending: false });
              if (r) setContributions(r as Contribution[]);
            })
          .subscribe();

        return () => { supabase.removeChannel(cotCh); supabase.removeChannel(contrCh); };
      } catch (e: any) {
        setError(e.message || "Impossible de charger la cotisation.");
        setLoading(false);
      }
    }
    init();
  }, [slug]);

  // Sync gross → net on mount
  useEffect(() => {
    const g = parseFloat(grossInput) || 0;
    if (g > 0) setNetInput(calcNet(g).toFixed(0));
  }, []);

  const fees = useMemo(() => {
    const gross = parseFloat(grossInput) || 0;
    if (gross <= 0) return { gross: 0, net: 0, paystackFee: 0, platformFee: 0 };
    return { gross, net: calcNet(gross), paystackFee: calcPaystackFee(gross), platformFee: calcPlatformFee(gross) };
  }, [grossInput]);

  function handleGrossChange(val: string) {
    setGrossInput(val);
    const g = parseFloat(val) || 0;
    setNetInput(g > 0 ? calcNet(g).toFixed(0) : "");
  }
  function handleNetChange(val: string) {
    setNetInput(val);
    const n = parseFloat(val) || 0;
    setGrossInput(n > 0 ? grossFromNet(n).toFixed(0) : "");
  }

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    if (!cotisation || !grossInput || parseFloat(grossInput) <= 0) {
      alert("Veuillez entrer un montant valide."); return;
    }
    const min = cotisation.settings?.min_amount || 0;
    if (min > 0 && fees.net < min) {
      alert(`Le montant net doit être d'au moins ${min} FCFA.`); return;
    }
    if (!contributorPhone) { alert("Veuillez saisir votre numéro de téléphone."); return; }
    const name = anonymous ? "Anonyme" : (contributorName.trim() || "Anonyme");
    try {
      setSubmitting(true);
      const { data, error: fnErr } = await supabase.functions.invoke("paystack-initialize", {
        body: { cotisation_id: cotisation.id, amount: fees.gross, contributor_name: name, contributor_phone: contributorPhone.trim() },
      });
      if (fnErr) throw fnErr;
      if (!data?.authorization_url) throw new Error("Initialisation de la transaction échouée.");
      setCheckoutUrl(data.authorization_url);
      setPaymentInitiated(true);
      window.open(data.authorization_url, "_blank");
    } catch (e: any) {
      alert(`Erreur de paiement : ${e.message || "Erreur inconnue."}`);
    } finally {
      setSubmitting(false);
    }
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(`${window.location.origin}/c/${slug}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  }

  // ── Loading ──
  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--cream)" }}>
      <Loader2 style={{ width: 32, height: 32, color: "var(--accent)", animation: "spin 1s linear infinite" }} />
    </div>
  );

  // ── Not found ──
  if (error || !cotisation) return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "var(--cream)", padding: 32, textAlign: "center" }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
      <h1 style={{ fontSize: 28, fontWeight: 500, margin: "0 0 12px" }}>Cotisation introuvable</h1>
      <p style={{ color: "var(--ink-3)", maxWidth: 400, lineHeight: 1.55, marginBottom: 32 }}>
        Le lien que vous avez suivi est peut-être incorrect ou la cotisation a été supprimée.
      </p>
      <button className="btn btn-primary" onClick={() => router.push("/")}>← Retour à l'accueil</button>
    </div>
  );

  // ── Computed values ──
  const days        = daysLeft(cotisation.deadline);
  const pct         = cotisation.target_amount > 0
    ? Math.min((cotisation.current_amount / cotisation.target_amount) * 100, 100) : 0;
  const isCompleted = cotisation.status === "completed" || pct >= 100;
  const isClosed    = cotisation.status === "closed" || (days < 0 && !isCompleted);
  const isActive    = !isClosed && !isCompleted;
  const best        = contributions.length > 0 ? contributions.reduce((p, c) => (p.amount >= c.amount ? p : c)) : null;
  const visibleContr = showAll ? contributions : contributions.slice(0, 8);
  const openDate    = new Date(cotisation.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  const closeDate   = new Date(cotisation.deadline).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div style={{ background: "var(--cream)", color: "var(--ink)", minHeight: "100vh" }}>

      {/* ── Sticky header ── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 40,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "20px 48px", borderBottom: "1px solid var(--line-soft)",
        background: "rgba(255,255,255,0.90)", backdropFilter: "blur(12px)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <img src="/design/assets/logo-icon.png" alt="MasterCota" style={{ height: 28, width: "auto" }} />
          <button onClick={() => router.push("/")} style={{
            background: "none", border: "none", color: "var(--ink-3)", fontSize: 13, cursor: "pointer", padding: 0
          }}>← retour</button>
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "center", fontSize: 12, color: "var(--ink-3)" }}>
          <span className="num">mastercota.com/c/{slug}</span>
          <button className="btn btn-ghost" onClick={handleCopyLink} style={{ height: 34, padding: "0 14px", fontSize: 12 }}>
            {copiedLink ? "Copié !" : "Copier le lien"}
          </button>
        </div>
      </header>

      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "56px 48px 120px", display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 80, alignItems: "start" }}>

        {/* ── LEFT — story + numbers + contributors ── */}
        <div>
          {/* Eyebrow row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 24 }}>
            <Eyebrow>Cagnotte collective · {isCompleted ? "Atteinte" : isClosed ? "Clôturée" : `En cours · J−${days}`}</Eyebrow>
            <Eyebrow>Ouverte le {openDate}</Eyebrow>
          </div>

          {/* Title */}
          <h1 style={{
            fontFamily: "var(--sans)", fontWeight: 400,
            fontSize: "clamp(48px, 5.8vw, 84px)", lineHeight: 0.98,
            letterSpacing: "-0.03em", margin: "0 0 28px",
          }}>
            {cotisation.title.split(" ").slice(0, -2).join(" ")}<br />
            <span className="serif-italic" style={{ color: "var(--accent)" }}>
              {cotisation.title.split(" ").slice(-2).join(" ")}.
            </span>
          </h1>

          {cotisation.description && (
            <p style={{ fontSize: 18, lineHeight: 1.55, color: "var(--ink-2)", margin: 0, maxWidth: 600 }}>
              {cotisation.description}
            </p>
          )}

          {/* Numbers panel */}
          {cotisation.settings?.show_progress && (
            <div style={{ marginTop: 56, padding: "32px 0", borderTop: "1px solid var(--ink)", borderBottom: "1px solid var(--line)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 32, alignItems: "end" }}>
                <div>
                  <Eyebrow style={{ display: "block", marginBottom: 8 }}>Collecté</Eyebrow>
                  <div className="num" style={{ fontSize: 72, letterSpacing: "-0.03em", lineHeight: 1 }}>
                    {fmt(cotisation.current_amount)} <span style={{ fontSize: 22, color: "var(--ink-3)" }}>F</span>
                  </div>
                </div>
                {cotisation.settings?.show_target_amount && (
                  <div>
                    <Eyebrow style={{ display: "block", marginBottom: 8 }}>Objectif</Eyebrow>
                    <div className="num" style={{ fontSize: 22, color: "var(--ink-3)" }}>{fmt(cotisation.target_amount)} F</div>
                  </div>
                )}
                <div>
                  <Eyebrow style={{ display: "block", marginBottom: 8 }}>Contributions</Eyebrow>
                  <div className="num" style={{ fontSize: 22, color: "var(--ink-3)" }}>{contributions.length} dons</div>
                </div>
              </div>

              <div className="bar" style={{ marginTop: 28 }}>
                <div className="bar-fill" style={{ width: `${pct}%`, background: isCompleted ? "var(--forest)" : "var(--accent)" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 12 }}>
                <span style={{ color: "var(--ink-2)" }}>
                  <span className="num" style={{ color: "var(--ink)" }}>{pct.toFixed(0)} %</span> de l'objectif atteint
                </span>
                <span style={{ color: "var(--ink-3)" }}>Clôture le {closeDate}</span>
              </div>
            </div>
          )}

          {/* Best contributor */}
          {cotisation.settings?.show_best_contributor && best && (
            <div style={{
              marginTop: 40, padding: "24px 28px", background: "var(--ink)", color: "var(--paper)",
              borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 50, background: "var(--accent)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 22, color: "var(--paper)", fontWeight: 500
                }}>
                  {(best.contributor_name || "A")[0].toUpperCase()}
                </div>
                <div>
                  <Eyebrow style={{ color: "rgba(255,255,255,0.55)", display: "block", marginBottom: 4 }}>Meilleur contributeur</Eyebrow>
                  <div style={{ fontSize: 18, fontWeight: 500 }}>{best.contributor_name || "Anonyme"}</div>
                </div>
              </div>
              <div className="num" style={{ fontSize: 28, letterSpacing: "-0.02em" }}>{fmt(best.amount)} F</div>
            </div>
          )}

          {/* Contributors list */}
          {cotisation.settings?.show_contributors && contributions.length > 0 && (
            <section style={{ marginTop: 64 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 24 }}>
                <h2 style={{ fontFamily: "var(--sans)", fontWeight: 500, fontSize: 28, margin: 0, letterSpacing: "-0.01em" }}>
                  {contributions.length} contributeur{contributions.length > 1 ? "s" : ""}
                </h2>
                <Eyebrow>Mis à jour en temps réel</Eyebrow>
              </div>

              <div>
                {visibleContr.map((c, i) => (
                  <div key={c.id} style={{
                    display: "grid", gridTemplateColumns: "auto 1fr auto auto", gap: 20,
                    alignItems: "baseline", padding: "16px 0", borderTop: "1px solid var(--line-soft)"
                  }}>
                    <span className="num" style={{ fontSize: 11, color: "var(--ink-4)" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <div style={{ fontSize: 15 }}>{c.contributor_name || "Anonyme"}</div>
                    </div>
                    <span style={{ fontSize: 12, color: "var(--ink-4)" }}>
                      {new Date(c.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                    </span>
                    <span className="num" style={{ fontSize: 15 }}>{fmt(c.amount)} F</span>
                  </div>
                ))}
                {contributions.length > 8 && !showAll && (
                  <div style={{ padding: "16px 0", borderTop: "1px solid var(--line-soft)", textAlign: "center" }}>
                    <button className="btn btn-ghost" style={{ height: 38, padding: "0 18px", fontSize: 12 }}
                      onClick={() => setShowAll(true)}>
                      Voir les {contributions.length - 8} autres
                    </button>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>

        {/* ── RIGHT — sticky form ── */}
        <aside style={{ position: "sticky", top: 100 }}>
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            {/* Card header */}
            <div style={{
              padding: "20px 28px", borderBottom: "1px solid var(--line)",
              display: "flex", alignItems: "center", justifyContent: "space-between"
            }}>
              <div style={{ fontFamily: "var(--sans)", fontWeight: 500, fontSize: 22, letterSpacing: "-0.01em" }}>
                Contribuer
              </div>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "5px 10px", borderRadius: 999, fontSize: 11, fontWeight: 500,
                background: "var(--forest-soft)", border: "1px solid rgba(45,106,79,0.24)", color: "var(--forest)"
              }}>
                <span style={{ width: 6, height: 6, borderRadius: 50, background: "var(--forest)" }} />
                Sécurisé · Paystack
              </span>
            </div>

            <div style={{ padding: 28 }}>
              {isActive ? (
                paymentInitiated ? (
                  /* Payment pending */
                  <div style={{ textAlign: "center", padding: "16px 0" }}>
                    <div style={{ fontSize: 40, marginBottom: 16 }}>⚡</div>
                    <h4 style={{ fontWeight: 500, fontSize: 20, margin: "0 0 12px" }}>Paiement initialisé</h4>
                    <p style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.55, marginBottom: 24 }}>
                      Une page de paiement Paystack a été ouverte dans un nouvel onglet.
                    </p>
                    <div style={{ display: "grid", gap: 10 }}>
                      <a href={checkoutUrl} target="_blank" rel="noopener noreferrer"
                        className="btn btn-accent" style={{ textDecoration: "none", height: 52, fontSize: 14 }}>
                        Ouvrir la page de paiement
                      </a>
                      <button className="btn btn-ghost" style={{ height: 44 }} onClick={() => setPaymentInitiated(false)}>
                        Retourner au formulaire
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handlePay}>
                    {/* Amount input */}
                    <label className="eyebrow" style={{ display: "block", marginBottom: 14 }}>Montant</label>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 10, paddingBottom: 14, borderBottom: "1px solid var(--ink)" }}>
                      <input
                        type="number" value={grossInput} onChange={(e) => handleGrossChange(e.target.value)}
                        className="num"
                        style={{
                          flex: 1, border: "none", outline: "none", background: "transparent",
                          fontSize: 52, color: "var(--ink)", letterSpacing: "-0.03em", padding: 0, fontWeight: 500
                        }}
                        required
                      />
                      <span className="num" style={{ fontSize: 18, color: "var(--ink-3)" }}>FCFA</span>
                    </div>

                    {/* Presets */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginTop: 16 }}>
                      {PRESET_AMOUNTS.map((p) => (
                        <button key={p} type="button" onClick={() => handleGrossChange(String(p))}
                          className="num"
                          style={{
                            padding: "10px 0", borderRadius: 999, fontSize: 12, fontWeight: 500, cursor: "pointer",
                            background: grossInput === String(p) ? "var(--ink)" : "transparent",
                            color: grossInput === String(p) ? "var(--paper)" : "var(--ink-2)",
                            border: "1px solid " + (grossInput === String(p) ? "var(--ink)" : "var(--line)"),
                            transition: "all .15s"
                          }}>
                          {p.toLocaleString("fr-FR")}
                        </button>
                      ))}
                    </div>

                    {/* Name + phone */}
                    <div style={{ marginTop: 28, display: "grid", gap: 14 }}>
                      {/* Name */}
                      <div style={{ borderBottom: "1px solid var(--line)", paddingBottom: 4 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                          <span className="eyebrow">Nom</span>
                          {cotisation.settings?.anonymous_allowed && (
                            <label style={{ fontSize: 11, color: "var(--ink-3)", display: "flex", gap: 6, alignItems: "center", cursor: "pointer" }}>
                              <input type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} />
                              Anonyme
                            </label>
                          )}
                        </div>
                        <input type="text" value={anonymous ? "Anonyme" : contributorName}
                          onChange={(e) => setContributorName(e.target.value)}
                          disabled={anonymous} placeholder="Aminata Koné"
                          style={{ width: "100%", border: "none", outline: "none", background: "transparent", padding: "10px 0", fontSize: 15, color: "var(--ink)" }}
                        />
                      </div>
                      {/* Phone */}
                      <div style={{ borderBottom: "1px solid var(--line)", paddingBottom: 4 }}>
                        <span className="eyebrow" style={{ display: "block" }}>Mobile Money</span>
                        <input type="tel" value={contributorPhone} onChange={(e) => setContributorPhone(e.target.value)}
                          placeholder="+225 07 07 07 07 07" required
                          style={{ width: "100%", border: "none", outline: "none", background: "transparent", padding: "10px 0", fontSize: 15, color: "var(--ink)" }}
                        />
                      </div>
                    </div>

                    {/* Fee breakdown */}
                    {fees.gross > 0 && (
                      <div style={{
                        marginTop: 24, padding: "14px 16px", background: "var(--paper-2)", borderRadius: 12,
                        display: "grid", gap: 8, fontSize: 12
                      }}>
                        <FeeRow label="Votre paiement" value={`${fmt(fees.gross)} F`} />
                        <FeeRow label="Frais MasterCota (2,5 %)" value={`−${fmt(fees.paystackFee + fees.platformFee)} F`} muted />
                        <div style={{ height: 1, background: "var(--line)", margin: "4px 0" }} />
                        <FeeRow label="Reçu dans la cagnotte" value={`${fmt(Math.max(0, fees.net))} F`} bold />
                      </div>
                    )}

                    {/* CTA */}
                    <button type="submit" disabled={submitting} className="btn btn-accent"
                      style={{ width: "100%", marginTop: 20, height: 56, fontSize: 15, opacity: submitting ? 0.7 : 1 }}>
                      {submitting
                        ? "Initialisation…"
                        : `Contribuer ${fees.gross > 0 ? fmt(fees.gross) + " F" : ""} →`}
                    </button>
                    <p style={{ fontSize: 11, textAlign: "center", color: "var(--ink-3)", marginTop: 14, lineHeight: 1.4 }}>
                      En continuant, vous serez redirigé vers Paystack pour le paiement.
                      <br />Vos informations bancaires ne transitent jamais par MasterCota.
                    </p>
                  </form>
                )
              ) : (
                /* Closed */
                <div style={{ textAlign: "center", padding: "24px 0" }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>🔒</div>
                  <h4 style={{ fontWeight: 500, margin: "0 0 8px" }}>Cotisation fermée</h4>
                  <p style={{ fontSize: 13, color: "var(--ink-3)", lineHeight: 1.55 }}>
                    Cette cotisation est clôturée ou a expiré.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Share */}
          <div style={{ marginTop: 24, padding: 20, border: "1px dashed var(--line)", borderRadius: 16 }}>
            <Eyebrow style={{ display: "block", marginBottom: 10 }}>Partager la cagnotte</Eyebrow>
            <div style={{ display: "flex", gap: 8 }}>
              {[
                ["WhatsApp", `https://wa.me/?text=${encodeURIComponent(`Contribue à cette cagnotte : ${typeof window !== "undefined" ? window.location.href : ""} 🙏`)}`],
                ["SMS",      `sms:?body=${encodeURIComponent(`Contribue ici : ${typeof window !== "undefined" ? window.location.href : ""}`)}`],
                ["Lien",     null],
              ].map(([label, href]) => (
                href
                  ? <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                      className="btn btn-ghost" style={{ flex: 1, height: 38, fontSize: 12, textDecoration: "none" }}>{label}</a>
                  : <button key={label} className="btn btn-ghost" style={{ flex: 1, height: 38, fontSize: 12 }}
                      onClick={handleCopyLink}>{copiedLink ? "Copié !" : label}</button>
              ))}
            </div>
          </div>
        </aside>
      </main>

      <footer style={{ borderTop: "1px solid var(--line)", padding: "32px 48px", fontSize: 12, color: "var(--ink-3)", textAlign: "center" }}>
        Propulsé par MasterCota · <a href="/cgu" style={{ color: "inherit" }}>CGU</a> · <a href="/mentions" style={{ color: "inherit" }}>Mentions légales</a> · <a href="mailto:support@mastercota.com" style={{ color: "inherit" }}>support@mastercota.com</a>
      </footer>

    </div>
  );
}
