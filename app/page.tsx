"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [siteConfig, setSiteConfig] = useState<{
    email_support: string;
    doc_cgu_url: string;
    doc_mentions_url: string;
  } | null>(null);

  useEffect(() => {
    supabase
      .from("site_config")
      .select("email_support, doc_cgu_url, doc_mentions_url")
      .eq("id", 1)
      .single()
      .then(({ data }) => { if (data) setSiteConfig(data); });
  }, []);

  return (
    <div style={{ background: "var(--cream)", color: "var(--ink)", minHeight: "100vh" }}>

      {/* ── Header ── */}
      <header className="flex items-center justify-between sticky top-0 z-50 px-6 md:px-16 py-4 md:py-7"
        style={{ borderBottom: "1px solid var(--line-soft)", background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)" }}>
        <img src="/design/assets/logo-full.png" alt="MasterCota" style={{ height: 40, width: "auto" }} />
        <nav className="hidden md:flex" style={{ gap: 36, fontSize: 13, color: "var(--ink-2)" }}>
          <a href="#comment" style={{ cursor: "pointer" }}>Comment ça marche</a>
          <a href="#securite" style={{ cursor: "pointer" }}>Sécurité</a>
          <a href="#a-propos" style={{ cursor: "pointer" }}>À propos</a>
          <a href={`mailto:${siteConfig?.email_support || "support@mastercota.com"}`}>Support</a>
        </nav>
        <div className="flex items-center gap-3">
          <span className="hidden md:block" style={{ fontSize: 13, color: "var(--ink-3)" }}>FR · FCFA</span>
          <a href="#download" className="btn btn-primary" style={{ height: 40, padding: "0 18px", fontSize: 13, textDecoration: "none" }}>
            Télécharger →
          </a>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="px-6 md:px-16 pt-14 md:pt-24 pb-12 md:pb-20">
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ marginBottom: 40 }}>
            <span className="eyebrow">N° 001 — Cagnottes collectives</span>
          </div>

          <h1 style={{
            fontFamily: "var(--sans)", fontWeight: 400,
            fontSize: "clamp(48px, 7.8vw, 112px)", lineHeight: 0.95,
            letterSpacing: "-0.03em", margin: 0,
          }}>
            Cotiser ensemble,<br />
            <span className="serif-italic" style={{ color: "var(--accent)" }}>sans malentendu.</span>
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 mt-10 md:mt-14 items-end">
            <p style={{ fontSize: "clamp(15px, 2vw, 19px)", lineHeight: 1.5, color: "var(--ink-2)", margin: 0 }}>
              MasterCota apporte la transparence et la traçabilité du paiement numérique
              aux cotisations entre familles, amis et collègues — Mobile Money, en un lien.
            </p>
            <div className="flex gap-3 md:justify-end flex-wrap">
              <a href="#download" className="btn btn-accent" style={{ textDecoration: "none" }}>Télécharger sur iOS</a>
              <a href="#comment" className="btn btn-ghost" style={{ textDecoration: "none" }}>Voir une démo</a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Live ticker ── */}
      <section style={{ borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", background: "var(--paper)" }}>
        <div className="flex items-center gap-8 md:gap-12 px-6 md:px-16 py-5 overflow-x-auto"
          style={{ whiteSpace: "nowrap", fontSize: 13, color: "var(--ink-2)" }}>
          <span className="eyebrow" style={{ flexShrink: 0 }}>En direct</span>
          {[
            ["Mariage Aïcha & Mamadou", "12 850", "+3 200 F · il y a 2 min"],
            ["Tontine Bureau Plateau", "84 000", "+5 000 F · il y a 6 min"],
            ["Funérailles Famille Diop", "245 700", "+10 000 F · il y a 12 min"],
            ["Anniversaire de Fatou", "750 000", "+2 000 F · il y a 18 min"],
          ].map(([title, amt, meta], i) => (
            <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 12, flexShrink: 0 }}>
              <span style={{ width: 6, height: 6, borderRadius: 50, background: "var(--accent)", display: "inline-block", marginBottom: 1 }} />
              <span style={{ fontWeight: 500 }}>{title}</span>
              <span className="num" style={{ color: "var(--ink-3)" }}>{amt} F</span>
              <span className="hidden sm:inline" style={{ fontSize: 11, color: "var(--ink-4)" }}>{meta}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Product showcase ── */}
      <section className="px-6 md:px-16 py-16 md:py-[120px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center" style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div>
            <span className="eyebrow">01 — Page de cagnotte</span>
            <h2 style={{ fontFamily: "var(--sans)", fontWeight: 500, fontSize: "clamp(30px,4vw,56px)", lineHeight: 1.02, margin: "20px 0 24px", letterSpacing: "-0.02em" }}>
              Une page <span className="serif-italic" style={{ color: "var(--accent)" }}>partageable</span> pour chaque cause.
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.55, color: "var(--ink-2)", margin: 0 }}>
              Donnez un titre, un objectif, une date limite. MasterCota génère un lien{" "}
              <span className="num" style={{ color: "var(--ink)", padding: "0 4px" }}>mastercota.com/c/votre-cause</span>{" "}
              que vous partagez sur WhatsApp. Vos contributeurs paient en deux taps, sans inscription.
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: "28px 0 0", display: "grid", gap: 14 }}>
              {[
                "Mobile Money — Wave, Orange, MTN",
                "Visa & Mastercard pour la diaspora",
                "Reversement automatique au créateur",
                "Page publique mise à jour en temps réel",
              ].map((s, i) => (
                <li key={i} style={{ display: "flex", gap: 14, alignItems: "baseline", fontSize: 15, color: "var(--ink-2)" }}>
                  <span className="num" style={{ color: "var(--accent)", fontSize: 12 }}>0{i + 1}</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Product mock */}
          <div style={{
            background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 20,
            padding: 22, boxShadow: "0 40px 60px -32px rgba(15,20,16,0.15)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
              {[0,1,2].map(i => <div key={i} style={{ width: 10, height: 10, borderRadius: 50, background: "#E5E0EE" }} />)}
              <div className="num hidden sm:block" style={{
                flex: 1, marginLeft: 12, padding: "6px 12px", border: "1px solid var(--line)", borderRadius: 8,
                fontSize: 11, color: "var(--ink-3)", background: "var(--cream)"
              }}>
                mastercota.com/c/anniversaire-fatou
              </div>
            </div>
            <div style={{ background: "var(--cream)", borderRadius: 12, padding: "20px 20px" }}>
              <span className="eyebrow">Cagnotte collective · En cours</span>
              <h3 style={{ fontFamily: "var(--sans)", fontWeight: 500, fontSize: "clamp(22px,3vw,32px)", margin: "12px 0 8px", letterSpacing: "-0.02em", lineHeight: 1.05 }}>
                Anniversaire surprise de Fatou
              </h3>
              <p style={{ fontSize: 12, color: "var(--ink-3)", margin: "0 0 20px", lineHeight: 1.5 }}>
                Pour lui offrir le voyage à Zanzibar dont elle rêve depuis trois ans.
              </p>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 }}>
                <div>
                  <div className="eyebrow" style={{ fontSize: 10, marginBottom: 4 }}>Collecté</div>
                  <div className="num" style={{ fontSize: "clamp(28px,4vw,38px)", color: "var(--ink)", letterSpacing: "-0.02em", lineHeight: 1 }}>
                    750 000 <span style={{ fontSize: 14, color: "var(--ink-3)" }}>F</span>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="eyebrow" style={{ fontSize: 10, marginBottom: 4 }}>Objectif</div>
                  <div className="num" style={{ fontSize: 18, color: "var(--ink-3)" }}>1 000 000 F</div>
                </div>
              </div>
              <div className="bar"><div className="bar-fill" style={{ width: "75%" }} /></div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 11, color: "var(--ink-3)" }}>
                <span><span className="num" style={{ color: "var(--ink)" }}>75 %</span> · 23 contributeurs</span>
                <span>4 jours restants</span>
              </div>
              <div style={{ marginTop: 20, borderTop: "1px solid var(--line)", paddingTop: 16, display: "grid", gap: 12 }}>
                {[["Aminata K.", "25 000", "il y a 12 min"], ["Mamadou D.", "10 000", "il y a 28 min"], ["Anonyme", "5 000", "il y a 1 h"]].map(([n, a, t], i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 13 }}>
                    <span>{n}</span>
                    <div style={{ display: "flex", gap: 12, alignItems: "baseline", color: "var(--ink-3)" }}>
                      <span className="hidden sm:inline" style={{ fontSize: 11 }}>{t}</span>
                      <span className="num" style={{ color: "var(--ink)" }}>{a} F</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Numbers — dark section ── */}
      <section id="securite" className="px-6 md:px-16 py-16 md:py-[120px]"
        style={{ background: "var(--ink)", color: "var(--paper)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div className="flex flex-col md:flex-row md:justify-between md:items-baseline gap-6 md:gap-0 mb-12 md:mb-20">
            <h2 style={{ fontFamily: "var(--sans)", fontWeight: 500, fontSize: "clamp(32px,5vw,64px)", margin: 0, letterSpacing: "-0.02em", maxWidth: 700, lineHeight: 1 }}>
              Frais clairs.<br /><span className="serif-italic" style={{ opacity: 0.7 }}>Rien d'autre.</span>
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.5, color: "rgba(255,255,255,0.6)", maxWidth: 320, margin: 0 }}>
              Aucun abonnement. Aucun frais d'ouverture. Une commission unique de 2,5 % prélevée
              sur chaque contribution.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4"
            style={{ borderTop: "1px solid rgba(255,255,255,0.15)" }}>
            {[
              ["2,5 %", "Frais tout inclus", "Pas de frais cachés"],
              ["0 F", "Pour contribuer", "Sans inscription contributeur"],
              ["48 h", "Reversement", "Au compte du créateur"],
              ["100 %", "Visible", "Liste publique des dons"],
            ].map(([n, label, sub], i) => (
              <div key={i} className="py-8 md:py-10 px-4 md:px-7"
                style={{ borderRight: i % 2 === 0 ? "1px solid rgba(255,255,255,0.15)" : "none",
                         borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.15)" : "none" }}
              >
                <div className="md:hidden" style={{ borderRight: "none" }} />
                <div className="num" style={{ fontSize: "clamp(36px,4vw,56px)", letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 16 }}>{n}</div>
                <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)" }}>{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="comment" className="px-6 md:px-16 py-16 md:py-[120px]">
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <span className="eyebrow">02 — Le déroulé</span>
          <h2 style={{ fontFamily: "var(--sans)", fontWeight: 500, fontSize: "clamp(32px,5vw,64px)", margin: "20px 0 48px", letterSpacing: "-0.02em", maxWidth: 800, lineHeight: 1 }}>
            Quatre étapes pour{" "}
            <span className="serif-italic" style={{ color: "var(--accent)" }}>tout changer</span>.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-8">
            {[
              ["Téléchargez", "L'app iOS ou Android. Connexion par SMS, sans mot de passe."],
              ["Créez", "Titre, objectif en FCFA, date limite. Le lien public est généré."],
              ["Partagez", "Un message WhatsApp, et la collecte commence."],
              ["Recevez", "Les fonds arrivent sur votre compte Mobile Money sous 48 h."],
            ].map(([t, d], i) => (
              <div key={i} style={{ borderTop: "1px solid var(--ink)", paddingTop: 28 }}>
                <div className="num" style={{ fontSize: 18, color: "var(--accent)", marginBottom: 18 }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 style={{ fontFamily: "var(--sans)", fontWeight: 500, fontSize: 28, margin: "0 0 12px", letterSpacing: "-0.01em" }}>{t}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.5, color: "var(--ink-2)", margin: 0 }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonial ── */}
      <section className="px-6 md:px-16 pb-16 md:pb-[120px]">
        <div style={{ maxWidth: 1100, margin: "0 auto", borderTop: "1px solid var(--line)", paddingTop: 60 }}>
          <blockquote style={{ margin: 0, fontSize: "clamp(22px,3.5vw,48px)", lineHeight: 1.2, letterSpacing: "-0.02em" }}>
            «&nbsp;On a réuni 380 000 F pour les funérailles de tante Awa
            en <span className="serif-italic" style={{ color: "var(--accent)" }}>quatre jours</span>.
            Plus personne ne demande qui a payé.&nbsp;»
          </blockquote>
          <div style={{ marginTop: 32, display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 50, background: "var(--paper-2)",
              border: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, color: "var(--ink-3)", fontFamily: "var(--mono)", flexShrink: 0
            }}>SD</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>Salimata Diallo</div>
              <div style={{ fontSize: 13, color: "var(--ink-3)" }}>Comptable · Dakar</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Download CTA ── */}
      <section id="download" className="px-6 md:px-16 pb-16 md:pb-[120px]">
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center"
            style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 24, padding: "clamp(32px,5vw,64px) clamp(24px,4vw,56px)" }}>
            <div>
              <span className="eyebrow">L'application</span>
              <h2 style={{ fontFamily: "var(--sans)", fontWeight: 500, fontSize: "clamp(28px,4vw,56px)", margin: "16px 0 20px", lineHeight: 1.02, letterSpacing: "-0.02em" }}>
                Disponible sur iOS et Android.
              </h2>
              <p style={{ fontSize: 15, lineHeight: 1.55, color: "var(--ink-2)", margin: 0 }}>
                Création gratuite. Votre première cagnotte en moins de deux minutes.
                Aucune carte bancaire requise pour démarrer.
              </p>
              <div className="flex flex-wrap gap-3 mt-8">
                <button className="btn btn-primary" style={{ height: 54, padding: "0 26px", opacity: 0.7, cursor: "default" }}>
                  <span style={{ fontSize: 18 }}></span>&nbsp;App Store
                </button>
                <button className="btn btn-primary" style={{ height: 54, padding: "0 26px", opacity: 0.7, cursor: "default" }}>
                  <span style={{ fontSize: 16 }}>▶</span>&nbsp;Google Play
                </button>
              </div>
              <p style={{ fontSize: 11, color: "var(--ink-4)", marginTop: 16 }}>Bientôt disponible — suivez-nous pour être notifié.</p>
            </div>
            <div style={{
              aspectRatio: "4/3", borderRadius: 16, background: "var(--paper-2)",
              border: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--ink-4)", fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.05em", textTransform: "uppercase"
            }}>
              Captures de l'app
            </div>
          </div>
        </div>
      </section>

      {/* ── About ── */}
      <section id="a-propos" className="px-6 md:px-16 py-14 md:py-20"
        style={{ background: "var(--paper)", borderTop: "1px solid var(--line)" }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center" style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div>
            <span className="eyebrow">Notre mission</span>
            <h2 style={{ fontFamily: "var(--sans)", fontWeight: 500, fontSize: "clamp(28px,3.5vw,48px)", margin: "16px 0 20px", letterSpacing: "-0.02em", lineHeight: 1.05 }}>
              Rendre la cotisation collective{" "}
              <span className="serif-italic" style={{ color: "var(--accent)" }}>accessible à tous.</span>
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.6, color: "var(--ink-2)", margin: "0 0 16px" }}>
              MasterCota est né d'un constat simple : en Afrique de l'Ouest, les cotisations entre amis,
              familles ou collègues sont une pratique culturelle forte — mais elles restent souvent organisées
              à la main, source de malentendus et de perte de confiance.
            </p>
            <p style={{ fontSize: 16, lineHeight: 1.6, color: "var(--ink-2)", margin: 0 }}>
              Notre application apporte la transparence, la traçabilité et la sécurité des paiements
              numériques à cette tradition communautaire essentielle.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 24 }}>
              {["Côte d'Ivoire", "Sénégal", "Cameroun", "Bénin", "Togo", "Burkina Faso"].map((c) => (
                <span key={c} style={{
                  padding: "6px 14px", borderRadius: 999, border: "1px solid var(--line)",
                  background: "var(--cream)", fontSize: 12, color: "var(--ink-2)", fontWeight: 500
                }}>{c}</span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              ["2,5 %", "Frais tout inclus", "Aucun frais caché"],
              ["0 s", "Sans inscription", "Pour contribuer via le lien"],
              ["100 %", "Transparence", "Liste publique des contributions"],
              ["24/7", "Disponible", "Paiements en temps réel"],
            ].map(([v, l, s]) => (
              <div key={l} style={{ padding: "20px 18px", borderRadius: 16, border: "1px solid var(--line)", background: "var(--cream)", textAlign: "center" }}>
                <div className="num" style={{ fontSize: 28, color: "var(--accent)", letterSpacing: "-0.02em" }}>{v}</div>
                <div style={{ fontSize: 13, fontWeight: 500, marginTop: 6 }}>{l}</div>
                <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 3 }}>{s}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="px-6 md:px-16 py-10 md:py-12" style={{ borderTop: "1px solid var(--line)", fontSize: 13, color: "var(--ink-3)" }}>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 md:gap-0" style={{ maxWidth: 1280, margin: "0 auto" }}>
          <img src="/design/assets/logo-full.png" alt="MasterCota" style={{ height: 32, width: "auto" }} />
          <div className="flex flex-wrap gap-5 md:gap-6">
            <a href={siteConfig?.doc_cgu_url || "#"} target="_blank" rel="noreferrer">CGU</a>
            <a href={siteConfig?.doc_mentions_url || "#"} target="_blank" rel="noreferrer">Mentions légales</a>
            <a href={`mailto:${siteConfig?.email_support || "support@mastercota.com"}`}>Support</a>
          </div>
          <div>© {new Date().getFullYear()} MasterCota</div>
        </div>
      </footer>

    </div>
  );
}
