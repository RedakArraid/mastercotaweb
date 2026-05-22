/* MASTERCOTA — Public donation page redesign (web)
   Two-column editorial: story on left, sticky form on right.
   ───────────────────────────────────────────────────────── */

function Donation() {
  const [gross, setGross] = React.useState("5000");
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [anon, setAnon] = React.useState(false);

  const grossN = parseFloat(gross) || 0;
  const fee = Math.min(grossN * 0.015, 2000) + grossN * 0.01;
  const net = grossN - fee;
  const presets = [1000, 2000, 5000, 10000, 25000, 50000];

  return (
    <div style={{ background: "var(--cream)", color: "var(--ink)", minHeight: "100%" }}>
      {/* Top bar — minimal */}
      <header style={{
        position: "sticky", top: 0, zIndex: 10,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "20px 48px", borderBottom: "1px solid var(--line-soft)",
        background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src="assets/logo-icon.png" alt="MasterCota" style={{ height: 32, width: "auto" }} />
          <span style={{ fontSize: 13, color: "var(--ink-3)" }}>retour</span>
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "center", fontSize: 12, color: "var(--ink-3)" }}>
          <span className="mono">mastercota.com/c/anniversaire-fatou</span>
          <button className="btn btn-ghost" style={{ height: 34, padding: "0 14px", fontSize: 12 }}>
            Copier le lien
          </button>
        </div>
      </header>

      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "56px 48px 120px", display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 80, alignItems: "start" }}>
        {/* ── LEFT — story + numbers + contributors ── */}
        <div>
          {/* Hero strip */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 24 }}>
            <span className="eyebrow">Cagnotte collective · En cours · J−4</span>
            <span className="eyebrow">Ouverte le 14 mai 2026</span>
          </div>

          <h1 className="serif" style={{
            fontSize: 84, lineHeight: 0.98, letterSpacing: "-0.03em",
            margin: "0 0 28px", maxWidth: 720
          }}>
            Anniversaire surprise<br />
            <span className="serif-italic" style={{ color: "var(--accent)" }}>de Fatou.</span>
          </h1>

          <p style={{ fontSize: 18, lineHeight: 1.55, color: "var(--ink-2)", margin: 0, maxWidth: 600 }}>
            Pour ses 30 ans, on veut lui offrir le voyage à Zanzibar dont elle parle
            depuis trois ans. Toute participation, même modeste, fait la différence —
            et restera anonyme si vous le souhaitez.
          </p>

          {/* Numbers panel */}
          <div style={{
            marginTop: 56, padding: "32px 0",
            borderTop: "1px solid var(--ink)", borderBottom: "1px solid var(--line)"
          }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 32, alignItems: "end" }}>
              <div>
                <div className="eyebrow" style={{ marginBottom: 8 }}>Collecté</div>
                <div className="num" style={{ fontSize: 72, letterSpacing: "-0.03em", lineHeight: 1, color: "var(--ink)" }}>
                  750 000 <span style={{ fontSize: 22, color: "var(--ink-3)" }}>F</span>
                </div>
              </div>
              <div>
                <div className="eyebrow" style={{ marginBottom: 8 }}>Objectif</div>
                <div className="num" style={{ fontSize: 22, color: "var(--ink-3)" }}>1 000 000 F</div>
              </div>
              <div>
                <div className="eyebrow" style={{ marginBottom: 8 }}>Contributions</div>
                <div className="num" style={{ fontSize: 22, color: "var(--ink-3)" }}>23 dons</div>
              </div>
            </div>

            <div className="bar" style={{ marginTop: 28 }}>
              <div className="bar-fill" style={{ width: "75%" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 12 }}>
              <span style={{ color: "var(--ink-2)" }}>
                <span className="num" style={{ color: "var(--ink)" }}>75 %</span> de l'objectif atteint
              </span>
              <span style={{ color: "var(--ink-3)" }}>Clôture le 26 mai 2026</span>
            </div>
          </div>

          {/* Highlight contributor */}
          <div style={{
            marginTop: 40, padding: "24px 28px", background: "var(--ink)", color: "var(--paper)",
            borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 50, background: "var(--accent)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--serif)", fontSize: 22, color: "var(--paper)"
              }}>A</div>
              <div>
                <div className="eyebrow" style={{ color: "rgba(255,255,255,0.55)", marginBottom: 4 }}>
                  Meilleur contributeur
                </div>
                <div style={{ fontSize: 18 }} className="serif">Aminata K.</div>
              </div>
            </div>
            <div className="num" style={{ fontSize: 28, letterSpacing: "-0.02em" }}>25 000 F</div>
          </div>

          {/* Contributors list */}
          <section style={{ marginTop: 64 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 24 }}>
              <h2 className="serif" style={{ fontSize: 28, margin: 0, letterSpacing: "-0.01em" }}>
                23 contributeurs
              </h2>
              <span className="eyebrow">Mis à jour en temps réel</span>
            </div>

            <div>
              {[
                ["Aminata Koné", "25 000", "il y a 12 min", "Bon courage ❤️"],
                ["Mamadou Diallo", "10 000", "il y a 28 min", null],
                ["Anonyme", "5 000", "il y a 1 h", "Vive Fatou !"],
                ["Sékou Touré", "10 000", "il y a 2 h", null],
                ["Awa Sow", "15 000", "il y a 3 h", "On t'aime"],
                ["Boubacar N.", "5 000", "il y a 5 h", null],
                ["Marie-Claire", "20 000", "hier", "Joyeux anniversaire ma chérie"],
                ["Anonyme", "3 000", "hier", null],
              ].map(([n, a, t, msg], i) => (
                <div key={i} style={{
                  display: "grid", gridTemplateColumns: "auto 1fr auto auto", gap: 20,
                  alignItems: "baseline",
                  padding: "16px 0", borderTop: "1px solid var(--line-soft)"
                }}>
                  <span className="num" style={{ fontSize: 11, color: "var(--ink-4)" }}>
                    {String(i+1).padStart(2, "0")}
                  </span>
                  <div>
                    <div style={{ fontSize: 15 }}>{n}</div>
                    {msg && (
                      <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 4, fontStyle: "italic" }}>
                        « {msg} »
                      </div>
                    )}
                  </div>
                  <span style={{ fontSize: 12, color: "var(--ink-4)" }}>{t}</span>
                  <span className="num" style={{ fontSize: 15 }}>{a} F</span>
                </div>
              ))}
              <div style={{ padding: "16px 0", borderTop: "1px solid var(--line-soft)", textAlign: "center" }}>
                <button className="btn btn-ghost" style={{ height: 38, padding: "0 18px", fontSize: 12 }}>
                  Voir les 15 autres
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* ── RIGHT — sticky donation form ── */}
        <aside style={{ position: "sticky", top: 100 }}>
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            {/* Header tab */}
            <div style={{
              padding: "20px 28px", borderBottom: "1px solid var(--line)",
              display: "flex", alignItems: "center", justifyContent: "space-between"
            }}>
              <div className="serif" style={{ fontSize: 22, letterSpacing: "-0.01em" }}>Contribuer</div>
              <div className="pill" style={{ background: "var(--forest-soft)", borderColor: "rgba(45,106,79,0.24)", color: "var(--forest)" }}>
                <span style={{ width: 6, height: 6, borderRadius: 50, background: "var(--forest)" }} />
                Sécurisé · Paystack
              </div>
            </div>

            <div style={{ padding: 28 }}>
              {/* Amount big input */}
              <label className="eyebrow" style={{ display: "block", marginBottom: 14 }}>Montant</label>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, paddingBottom: 14, borderBottom: "1px solid var(--ink)" }}>
                <input
                  type="number"
                  value={gross}
                  onChange={(e) => setGross(e.target.value)}
                  className="num"
                  style={{
                    flex: 1, border: "none", outline: "none", background: "transparent",
                    fontSize: 52, color: "var(--ink)", letterSpacing: "-0.03em", padding: 0,
                    fontWeight: 500
                  }}
                />
                <span style={{ fontSize: 18, color: "var(--ink-3)" }} className="mono">FCFA</span>
              </div>

              {/* Presets */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginTop: 16 }}>
                {presets.map((p) => (
                  <button
                    key={p}
                    onClick={() => setGross(String(p))}
                    style={{
                      padding: "10px 0", borderRadius: 999, fontSize: 12, fontWeight: 500,
                      background: gross === String(p) ? "var(--ink)" : "transparent",
                      color: gross === String(p) ? "var(--paper)" : "var(--ink-2)",
                      border: "1px solid " + (gross === String(p) ? "var(--ink)" : "var(--line)"),
                      cursor: "pointer", transition: "all .15s"
                    }}
                    className="num"
                  >
                    {p.toLocaleString("fr-FR")}
                  </button>
                ))}
              </div>

              {/* Inputs */}
              <div style={{ marginTop: 28, display: "grid", gap: 14 }}>
                <Field
                  label="Nom"
                  trailing={
                    <label style={{ fontSize: 11, color: "var(--ink-3)", display: "flex", gap: 6, alignItems: "center", cursor: "pointer" }}>
                      <input type="checkbox" checked={anon} onChange={(e) => setAnon(e.target.checked)} />
                      Anonyme
                    </label>
                  }
                >
                  <input
                    type="text" value={anon ? "Anonyme" : name} onChange={(e) => setName(e.target.value)}
                    disabled={anon} placeholder="Aminata Koné"
                    style={fieldInput}
                  />
                </Field>
                <Field label="Mobile Money">
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+225 07 07 07 07 07" style={fieldInput} />
                </Field>
              </div>

              {/* Fee breakdown */}
              <div style={{
                marginTop: 24, padding: "14px 16px",
                background: "var(--paper-2)", borderRadius: 12,
                display: "grid", gap: 8, fontSize: 12
              }}>
                <Row label="Votre paiement" value={`${grossN.toLocaleString("fr-FR")} F`} />
                <Row label="Frais MasterCota (2,5 %)" value={`−${Math.round(fee).toLocaleString("fr-FR")} F`} muted />
                <div style={{ height: 1, background: "var(--line)", margin: "4px 0" }} />
                <Row label="Reçu dans la cagnotte" value={`${Math.max(0, Math.round(net)).toLocaleString("fr-FR")} F`} bold />
              </div>

              {/* CTA */}
              <button className="btn btn-accent" style={{ width: "100%", marginTop: 20, height: 56, fontSize: 15 }}>
                Contribuer {grossN.toLocaleString("fr-FR")} F →
              </button>
              <p style={{ fontSize: 11, textAlign: "center", color: "var(--ink-3)", marginTop: 14, lineHeight: 1.4 }}>
                En continuant, vous serez redirigé vers Paystack pour le paiement Mobile Money.
                <br />Vos informations bancaires ne transitent jamais par MasterCota.
              </p>
            </div>
          </div>

          {/* Share inline */}
          <div style={{ marginTop: 24, padding: 20, background: "transparent", border: "1px dashed var(--line)", borderRadius: 16 }}>
            <div className="eyebrow" style={{ marginBottom: 10 }}>Partager la cagnotte</div>
            <div style={{ display: "flex", gap: 8 }}>
              {["WhatsApp", "SMS", "Lien"].map((s) => (
                <button key={s} className="btn btn-ghost" style={{ flex: 1, height: 38, fontSize: 12 }}>{s}</button>
              ))}
            </div>
          </div>
        </aside>
      </main>

      <footer style={{ borderTop: "1px solid var(--line)", padding: "32px 48px", fontSize: 12, color: "var(--ink-3)", textAlign: "center" }}>
        Propulsé par MasterCota · CGU · Mentions légales · support@mastercota.com
      </footer>
    </div>
  );
}

const fieldInput = {
  width: "100%", border: "none", outline: "none", background: "transparent",
  padding: "10px 0", fontSize: 15, color: "var(--ink)",
};

function Field({ label, trailing, children }) {
  return (
    <div style={{ borderBottom: "1px solid var(--line)", paddingBottom: 4 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <span className="eyebrow">{label}</span>
        {trailing}
      </div>
      {children}
    </div>
  );
}

function Row({ label, value, muted, bold }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <span style={{ color: muted ? "var(--ink-3)" : "var(--ink-2)" }}>{label}</span>
      <span className="num" style={{ color: muted ? "var(--ink-3)" : "var(--ink)", fontWeight: bold ? 500 : 400 }}>
        {value}
      </span>
    </div>
  );
}

Object.assign(window, { Donation });
