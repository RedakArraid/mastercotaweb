/* MASTERCOTA — Mobile Home (iPhone)
   Editorial. Single accent. Real numbers. No rainbow cards.
   ───────────────────────────────────────────────────────── */

function MobileHome() {
  return (
    <IOSDevice >
      <div style={{ background: "var(--cream)", minHeight: "100%", color: "var(--ink)", paddingBottom: 100 }}>

        {/* ── Header ── */}
        <header style={{ padding: "54px 20px 20px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <img src="assets/logo-icon.png" alt="MasterCota" style={{ height: 24, width: "auto", marginBottom: 12, display: "block" }} />
            <div style={{ fontSize: 13, color: "var(--ink-3)", marginBottom: 4 }}>Mardi 26 mai</div>
            <div className="serif" style={{ fontSize: 28, lineHeight: 1.05, letterSpacing: "-0.02em" }}>
              Bonjour, <span className="serif-italic" style={{ color: "var(--accent)" }}>Aminata</span>
            </div>
          </div>
          <button style={{
            width: 40, height: 40, borderRadius: 50, border: "1px solid var(--line)",
            background: "var(--paper)", display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--serif)", fontSize: 16, padding: 0, color: "var(--ink)"
          }}>A</button>
        </header>

        {/* ── Hero balance card ── */}
        <section style={{ margin: "0 20px" }}>
          <div style={{
            background: "var(--ink)", color: "var(--paper)",
            borderRadius: 22, padding: "26px 24px 22px",
            position: "relative", overflow: "hidden"
          }}>
            {/* Subtle accent corner */}
            <div style={{
              position: "absolute", top: -40, right: -40,
              width: 140, height: 140, borderRadius: 50,
              background: "var(--accent)", opacity: 0.15
            }} />

            <div className="eyebrow" style={{ color: "rgba(255,255,255,0.55)", marginBottom: 14 }}>
              Total collecté
            </div>
            <div className="num" style={{ fontSize: 44, letterSpacing: "-0.03em", lineHeight: 1 }}>
              1 425 000 <span style={{ fontSize: 14, color: "rgba(255,255,255,0.55)" }}>F</span>
            </div>
            <div style={{ display: "flex", gap: 24, marginTop: 22, fontSize: 12 }}>
              <div>
                <div style={{ color: "rgba(255,255,255,0.55)", marginBottom: 4 }}>Cagnottes actives</div>
                <div className="num" style={{ fontSize: 18, color: "var(--paper)" }}>3</div>
              </div>
              <div style={{ width: 1, background: "rgba(255,255,255,0.15)" }} />
              <div>
                <div style={{ color: "rgba(255,255,255,0.55)", marginBottom: 4 }}>Contributeurs</div>
                <div className="num" style={{ fontSize: 18, color: "var(--paper)" }}>47</div>
              </div>
              <div style={{ width: 1, background: "rgba(255,255,255,0.15)" }} />
              <div>
                <div style={{ color: "rgba(255,255,255,0.55)", marginBottom: 4 }}>À reverser</div>
                <div className="num" style={{ fontSize: 18, color: "var(--accent)" }}>840 K</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Quick actions ── */}
        <section style={{ padding: "20px", display: "grid", gridTemplateColumns: "2fr 1fr", gap: 10 }}>
          <button style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            background: "var(--accent)", color: "white", border: "none",
            height: 56, borderRadius: 16, fontSize: 14, fontWeight: 500, padding: 0
          }}>
            <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> Nouvelle cagnotte
          </button>
          <button style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            background: "var(--paper)", color: "var(--ink)", border: "1px solid var(--line)",
            height: 56, borderRadius: 16, fontSize: 13, fontWeight: 500
          }}>
            Scanner
          </button>
        </section>

        {/* ── Section title ── */}
        <div style={{ padding: "12px 20px 14px", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <h3 className="serif" style={{ fontSize: 22, margin: 0, letterSpacing: "-0.01em" }}>
            Mes cagnottes
          </h3>
          <span className="eyebrow">Voir tout</span>
        </div>

        {/* ── Cagnotte cards — editorial style, no gradient noise ── */}
        <div style={{ padding: "0 20px", display: "grid", gap: 12 }}>
          <CagnotteCard
            title="Anniversaire de Fatou"
            description="Pour son voyage à Zanzibar"
            collected="750 000"
            target="1 000 000"
            percent={75}
            daysLeft={4}
            count={23}
            accent
          />
          <CagnotteCard
            title="Tontine Bureau Plateau"
            description="Mensuelle · Mai 2026"
            collected="84 000"
            target="150 000"
            percent={56}
            daysLeft={11}
            count={6}
          />
          <CagnotteCard
            title="Funérailles Famille Diop"
            description="Soutien à la famille"
            collected="591 000"
            target="500 000"
            percent={118}
            daysLeft={null}
            count={18}
            completed
          />
        </div>

        {/* ── Bottom nav ── */}
        <nav style={{
          position: "absolute", bottom: 32, left: 16, right: 16,
          background: "var(--ink)", borderRadius: 100, height: 60,
          display: "flex", alignItems: "center", justifyContent: "space-around",
          padding: "0 8px"
        }}>
          {[
            ["Accueil", true],
            ["Stats", false],
            ["Profil", false],
          ].map(([l, active], i) => (
            <button key={i} style={{
              background: active ? "var(--accent)" : "transparent",
              color: active ? "white" : "rgba(255,255,255,0.6)",
              border: "none", padding: "0 24px", height: 44, borderRadius: 100,
              fontSize: 13, fontWeight: 500
            }}>
              {l}
            </button>
          ))}
        </nav>
      </div>
    </IOSDevice>
  );
}

function CagnotteCard({ title, description, collected, target, percent, daysLeft, count, accent, completed }) {
  return (
    <div style={{
      background: "var(--paper)", borderRadius: 20, padding: "18px 18px 16px",
      border: "1px solid " + (accent ? "var(--accent-line)" : "var(--line)"),
      position: "relative"
    }}>
      {/* Top row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
        <div style={{ flex: 1, paddingRight: 12 }}>
          <div className="serif" style={{ fontSize: 18, lineHeight: 1.15, letterSpacing: "-0.01em" }}>
            {title}
          </div>
          <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 4 }}>
            {description}
          </div>
        </div>
        {completed ? (
          <span style={{
            fontSize: 10, padding: "4px 8px", borderRadius: 999,
            background: "var(--forest-soft)", color: "var(--forest)",
            fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase"
          }}>Atteint</span>
        ) : (
          <span style={{
            fontSize: 10, padding: "4px 8px", borderRadius: 999,
            background: "var(--ink)", color: "var(--paper)",
            fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase"
          }} className="mono">J−{daysLeft}</span>
        )}
      </div>

      {/* Numbers */}
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginTop: 16 }}>
        <div className="num" style={{ fontSize: 26, letterSpacing: "-0.02em", lineHeight: 1 }}>
          {collected} <span style={{ fontSize: 11, color: "var(--ink-3)" }}>F</span>
        </div>
        <div className="num" style={{ fontSize: 11, color: "var(--ink-3)" }}>
          / {target} F
        </div>
      </div>

      {/* Bar */}
      <div className="bar" style={{ marginTop: 14 }}>
        <div className="bar-fill" style={{
          width: Math.min(percent, 100) + "%",
          background: completed ? "var(--forest)" : "var(--accent)"
        }} />
      </div>

      {/* Footer */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 11, color: "var(--ink-3)" }}>
        <span><span className="num" style={{ color: "var(--ink)" }}>{percent}%</span> · {count} contributeurs</span>
        <span style={{ color: "var(--accent)", fontWeight: 500 }}>Voir →</span>
      </div>
    </div>
  );
}

Object.assign(window, { MobileHome });
