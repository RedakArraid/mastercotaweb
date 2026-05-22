/* MASTERCOTA — Mobile Cotisation Detail (iPhone)
   Editorial cover, live contributors, sticky action bar.
   ───────────────────────────────────────────────────────── */

function MobileDetail() {
  return (
    <IOSDevice >
      <div style={{ background: "var(--cream)", minHeight: "100%", color: "var(--ink)", paddingBottom: 110, position: "relative" }}>

        {/* ── Top bar ── */}
        <header style={{
          padding: "54px 20px 16px", display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <button style={navBtn}>←</button>
          <span className="eyebrow">Détail</span>
          <button style={navBtn}>↗</button>
        </header>

        {/* ── Editorial hero ── */}
        <section style={{ padding: "12px 20px 24px" }}>
          <span className="eyebrow">En cours · J−4</span>
          <h1 className="serif" style={{
            fontSize: 36, lineHeight: 1.02, letterSpacing: "-0.02em",
            margin: "10px 0 12px"
          }}>
            Anniversaire surprise<br />
            <span className="serif-italic" style={{ color: "var(--accent)" }}>de Fatou.</span>
          </h1>
          <p style={{ fontSize: 13, lineHeight: 1.5, color: "var(--ink-2)", margin: 0 }}>
            Pour ses 30 ans, on veut lui offrir le voyage à Zanzibar dont elle parle depuis trois ans.
          </p>
        </section>

        {/* ── Big number ── */}
        <section style={{ padding: "0 20px 18px" }}>
          <div style={{
            background: "var(--paper)", borderRadius: 22, padding: "22px 22px 20px",
            border: "1px solid var(--line)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <div className="eyebrow">Collecté</div>
              <div className="eyebrow">Objectif</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 6 }}>
              <div className="num" style={{ fontSize: 38, letterSpacing: "-0.03em", lineHeight: 1 }}>
                750 000 <span style={{ fontSize: 13, color: "var(--ink-3)" }}>F</span>
              </div>
              <div className="num" style={{ fontSize: 14, color: "var(--ink-3)" }}>
                1 000 000 F
              </div>
            </div>

            <div className="bar" style={{ marginTop: 18 }}>
              <div className="bar-fill" style={{ width: "75%" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 11 }}>
              <span style={{ color: "var(--ink-2)" }}><span className="num" style={{ color: "var(--ink)" }}>75 %</span> atteint</span>
              <span style={{ color: "var(--ink-3)" }} className="mono">4 j restants</span>
            </div>

            {/* Mini split */}
            <div style={{
              marginTop: 18, paddingTop: 16, borderTop: "1px solid var(--line)",
              display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12
            }}>
              <Stat n="23" l="contributions" />
              <Stat n="32 600" l="moyenne F" />
              <Stat n="50 000" l="max F" />
            </div>
          </div>
        </section>

        {/* ── Share strip ── */}
        <section style={{ padding: "0 20px 24px" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8, padding: "12px 14px",
            background: "transparent", border: "1px dashed var(--line)", borderRadius: 14
          }}>
            <div className="mono" style={{ flex: 1, fontSize: 11, color: "var(--ink-3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              mastercota.com/c/anniversaire-fatou
            </div>
            <button style={{
              padding: "8px 14px", borderRadius: 999, border: "1px solid var(--ink)",
              background: "var(--ink)", color: "var(--paper)", fontSize: 11, fontWeight: 500
            }}>
              WhatsApp
            </button>
          </div>
        </section>

        {/* ── Tabs ── */}
        <section style={{ padding: "0 20px 12px" }}>
          <div style={{ display: "flex", gap: 22, borderBottom: "1px solid var(--line)" }}>
            {[["Activité", true], ["Contributeurs", false], ["Réglages", false]].map(([l, active], i) => (
              <button key={i} style={{
                background: "none", border: "none", padding: "10px 0",
                borderBottom: "2px solid " + (active ? "var(--ink)" : "transparent"),
                color: active ? "var(--ink)" : "var(--ink-3)", fontSize: 13, fontWeight: 500,
                marginBottom: -1
              }}>{l}</button>
            ))}
          </div>
        </section>

        {/* ── Activity stream ── */}
        <section style={{ padding: "12px 20px 0" }}>
          {[
            ["Aminata Koné", "25 000", "il y a 12 min", "Bon courage ❤️"],
            ["Mamadou Diallo", "10 000", "il y a 28 min", null],
            ["Anonyme", "5 000", "il y a 1 h", "Vive Fatou !"],
            ["Sékou Touré", "10 000", "il y a 2 h", null],
            ["Awa Sow", "15 000", "il y a 3 h", "On t'aime"],
          ].map(([n, amt, t, msg], i) => (
            <div key={i} style={{
              display: "flex", alignItems: "flex-start", gap: 14,
              padding: "14px 0", borderTop: i === 0 ? "none" : "1px solid var(--line-soft)"
            }}>
              <span className="num" style={{ fontSize: 10, color: "var(--ink-4)", marginTop: 4, minWidth: 16 }}>
                {String(i+1).padStart(2, "0")}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{n}</span>
                  <span className="num" style={{ fontSize: 14 }}>+{amt} F</span>
                </div>
                <div style={{ fontSize: 11, color: "var(--ink-4)", marginTop: 2 }}>{t}</div>
                {msg && (
                  <div style={{
                    fontSize: 12, color: "var(--ink-2)", marginTop: 8,
                    padding: "8px 12px", background: "var(--paper)", borderRadius: 10,
                    fontStyle: "italic"
                  }}>
                    « {msg} »
                  </div>
                )}
              </div>
            </div>
          ))}
        </section>

        {/* ── Sticky action bar ── */}
        <div style={{
          position: "absolute", bottom: 24, left: 16, right: 16,
          background: "var(--ink)", borderRadius: 22, padding: 6,
          display: "flex", gap: 6, alignItems: "center"
        }}>
          <button style={{
            background: "transparent", color: "var(--paper)", border: "none",
            width: 52, height: 52, borderRadius: 16, fontSize: 18
          }}>↗</button>
          <button style={{
            flex: 1, background: "var(--accent)", color: "white", border: "none",
            height: 52, borderRadius: 16, fontSize: 14, fontWeight: 500,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8
          }}>
            Relancer les retardataires <span className="num" style={{ opacity: 0.8 }}>(7)</span>
          </button>
        </div>
      </div>
    </IOSDevice>
  );
}

const navBtn = {
  width: 38, height: 38, borderRadius: 12, border: "1px solid var(--line)",
  background: "var(--paper)", display: "flex", alignItems: "center", justifyContent: "center",
  fontSize: 16, color: "var(--ink)", padding: 0
};

function Stat({ n, l }) {
  return (
    <div>
      <div className="num" style={{ fontSize: 16, letterSpacing: "-0.01em" }}>{n}</div>
      <div style={{ fontSize: 10, color: "var(--ink-3)", marginTop: 2, textTransform: "uppercase", letterSpacing: "0.06em" }}>{l}</div>
    </div>
  );
}

Object.assign(window, { MobileDetail });
