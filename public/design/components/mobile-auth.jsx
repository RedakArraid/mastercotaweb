/* MASTERCOTA — Mobile auth flow: Splash, Onboarding, Phone, OTP
   ───────────────────────────────────────────────────────── */

function MobileSplash() {
  return (
    <IOSDevice>
      <div style={{
        background: "var(--cream)", color: "var(--ink)",
        minHeight: "100%", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", padding: 32
      }}>
        <img
          src="assets/logo-full.png"
          alt="MasterCota"
          style={{ width: 240, height: "auto", display: "block" }}
        />

        <p style={{
          marginTop: 12, fontSize: 14, color: "var(--ink-3)",
          textAlign: "center", letterSpacing: "0.02em"
        }}>
          Plus simple de cotiser.
        </p>

        {/* Loader dots */}
        <div style={{ position: "absolute", bottom: 80, display: "flex", gap: 6 }}>
          {[0, 1, 2].map((i) => (
            <span key={i} style={{
              width: 6, height: 6, borderRadius: 50,
              background: i === 1 ? "var(--accent)" : "var(--paper-2)"
            }} />
          ))}
        </div>
      </div>
    </IOSDevice>
  );
}

function MobileOnboarding() {
  return (
    <IOSDevice >
      <div style={{ background: "var(--cream)", minHeight: "100%", display: "flex", flexDirection: "column" }}>
        {/* Top skip */}
        <header style={{ padding: "54px 20px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <img src="assets/logo-icon.png" alt="MasterCota" style={{ height: 28, width: "auto" }} />
          <button style={{
            background: "none", border: "none", color: "var(--ink-3)",
            fontSize: 13, padding: "6px 10px"
          }}>Passer</button>
        </header>

        {/* Visual slot */}
        <div style={{ padding: "20px 20px 0", flex: "0 0 auto" }}>
          <ShareIllustration />
        </div>

        {/* Copy */}
        <div style={{ flex: 1, padding: "32px 28px 20px", display: "flex", flexDirection: "column" }}>
          <span className="eyebrow">02 sur 03</span>
          <h2 className="serif" style={{
            fontSize: 32, lineHeight: 1.05, letterSpacing: "-0.025em",
            margin: "12px 0 14px"
          }}>
            Partagez un lien,<br />
            <span className="serif-italic" style={{ color: "var(--accent)" }}>la cagnotte démarre.</span>
          </h2>
          <p style={{ fontSize: 14, lineHeight: 1.55, color: "var(--ink-2)", margin: 0 }}>
            Vos proches paient en deux taps via Mobile Money — Wave, Orange,
            MTN, Moov — sans installer l'application.
          </p>

          <div style={{ flex: 1 }} />

          {/* Dots + CTA */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 28 }}>
            <div style={{ display: "flex", gap: 8 }}>
              {[0, 1, 2].map((i) => (
                <span key={i} style={{
                  width: i === 1 ? 24 : 6, height: 6, borderRadius: 999,
                  background: i === 1 ? "var(--ink)" : "var(--ink-4)",
                  opacity: i === 1 ? 1 : 0.4,
                  transition: "all .2s"
                }} />
              ))}
            </div>
            <button className="btn btn-primary" style={{ height: 52, padding: "0 24px" }}>
              Continuer →
            </button>
          </div>
        </div>
      </div>
    </IOSDevice>
  );
}

function MobilePhone() {
  return (
    <IOSDevice >
      <div style={{ background: "var(--cream)", minHeight: "100%", display: "flex", flexDirection: "column" }}>
        <header style={{ padding: "54px 20px 16px", display: "flex", alignItems: "center", gap: 12 }}>
          <button style={navBtnSm}>←</button>
        </header>

        <div style={{ padding: "8px 28px", flex: 1, display: "flex", flexDirection: "column" }}>
          <span className="eyebrow">Connexion · 01</span>
          <h2 className="serif" style={{
            fontSize: 36, lineHeight: 1.02, letterSpacing: "-0.025em",
            margin: "12px 0 12px"
          }}>
            Votre numéro<br />
            <span className="serif-italic" style={{ color: "var(--accent)" }}>de téléphone.</span>
          </h2>
          <p style={{ fontSize: 14, lineHeight: 1.55, color: "var(--ink-2)", margin: 0, maxWidth: 280 }}>
            On vous envoie un code par SMS. Aucun mot de passe à retenir.
          </p>

          {/* Field */}
          <div style={{ marginTop: 40 }}>
            <span className="eyebrow">Numéro</span>
            <div style={{
              display: "flex", alignItems: "center", gap: 12,
              marginTop: 10, paddingBottom: 12, borderBottom: "1px solid var(--ink)"
            }}>
              {/* Country chip */}
              <button style={{
                display: "flex", alignItems: "center", gap: 8, padding: "8px 12px",
                background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 12,
                fontSize: 14
              }}>
                <span style={{ fontSize: 18 }}>🇨🇮</span>
                <span className="mono">+225</span>
                <span style={{ fontSize: 10, color: "var(--ink-3)" }}>▼</span>
              </button>
              <input
                type="tel" placeholder="07 07 07 07 07" defaultValue="07 12 34 56 78"
                style={{
                  flex: 1, border: "none", outline: "none", background: "transparent",
                  fontSize: 22, color: "var(--ink)", padding: "8px 0",
                  fontFamily: "var(--mono)", letterSpacing: "0.02em", fontWeight: 500
                }}
              />
            </div>
            <p style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 12, lineHeight: 1.4 }}>
              En continuant, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
            </p>
          </div>

          <div style={{ flex: 1 }} />

          <button className="btn btn-accent" style={{ marginTop: 24, height: 54, width: "100%" }}>
            Recevoir le code →
          </button>
          <p style={{ fontSize: 11, color: "var(--ink-3)", textAlign: "center", marginTop: 14 }}>
            Un SMS sera envoyé au <span className="mono" style={{ color: "var(--ink)" }}>+225 07 12 34 56 78</span>
          </p>
        </div>
      </div>
    </IOSDevice>
  );
}

function MobileOTP() {
  const digits = ["3", "8", "1", "4", "·", "·"];
  return (
    <IOSDevice keyboard>
      <div style={{ background: "var(--cream)", minHeight: "100%", display: "flex", flexDirection: "column" }}>
        <header style={{ padding: "54px 20px 16px", display: "flex", alignItems: "center" }}>
          <button style={navBtnSm}>←</button>
        </header>

        <div style={{ padding: "8px 28px", flex: 1, display: "flex", flexDirection: "column" }}>
          <span className="eyebrow">Connexion · 02</span>
          <h2 className="serif" style={{
            fontSize: 36, lineHeight: 1.02, letterSpacing: "-0.025em", margin: "12px 0 12px"
          }}>
            Code reçu ?<br />
            <span className="serif-italic" style={{ color: "var(--accent)" }}>Saisissez-le.</span>
          </h2>
          <p style={{ fontSize: 14, lineHeight: 1.55, color: "var(--ink-2)", margin: 0 }}>
            Un SMS à 6 chiffres a été envoyé au{" "}
            <span className="mono" style={{ color: "var(--ink)" }}>+225 07 12 34 56 78</span>.
          </p>

          {/* OTP cells */}
          <div style={{ display: "flex", gap: 10, marginTop: 36 }}>
            {digits.map((d, i) => (
              <div key={i} style={{
                flex: 1, aspectRatio: "1/1.15",
                background: d === "·" ? "transparent" : "var(--paper)",
                border: "1px solid " + (i === 4 ? "var(--ink)" : "var(--line)"),
                borderRadius: 14,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--mono)", fontSize: 28, color: d === "·" ? "var(--ink-4)" : "var(--ink)",
                fontWeight: 500
              }}>
                {d}
              </div>
            ))}
          </div>

          {/* Resend countdown */}
          <div style={{ marginTop: 22, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "var(--ink-3)" }}>
              Renvoyer dans <span className="mono" style={{ color: "var(--ink)" }}>00:42</span>
            </span>
            <button style={{
              background: "none", border: "none", color: "var(--ink-3)",
              fontSize: 12, fontWeight: 500, padding: 4
            }}>
              Changer de numéro
            </button>
          </div>

          <div style={{ flex: 1 }} />
        </div>
      </div>
    </IOSDevice>
  );
}

/* ─── WhatsApp share illustration ─── */
function ShareIllustration() {
  return (
    <div style={{
      position: "relative", aspectRatio: "1/1", borderRadius: 24,
      background: "linear-gradient(160deg, #F4F7FB 0%, #EEF2F8 100%)",
      overflow: "hidden", border: "1px solid var(--line)"
    }}>
      {/* Soft grid pattern */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.5,
        backgroundImage:
          "radial-gradient(rgba(20,50,104,0.08) 1px, transparent 1px)",
        backgroundSize: "16px 16px"
      }} />

      {/* Phone card — center back */}
      <div style={{
        position: "absolute", left: "50%", top: "50%",
        transform: "translate(-50%, -50%) rotate(-3deg)",
        width: "68%", padding: "16px 16px 18px",
        background: "white", borderRadius: 18,
        boxShadow: "0 24px 48px -16px rgba(20,50,104,0.20), 0 0 0 1px rgba(20,50,104,0.06)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <img src="assets/logo-icon.png" alt="" style={{ height: 18, width: "auto" }} />
          <span style={{ fontSize: 9, color: "var(--ink-3)", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" }}>
            Cagnotte
          </span>
        </div>
        <div style={{
          fontFamily: "var(--display)", fontSize: 14, lineHeight: 1.15,
          letterSpacing: "-0.02em", color: "var(--ink)", fontWeight: 500
        }}>
          Anniversaire surprise<br />
          <span style={{ fontFamily: "Newsreader", fontStyle: "italic", color: "var(--accent)" }}>
            de Fatou.
          </span>
        </div>

        {/* Mini progress */}
        <div style={{ marginTop: 14, display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
          <div style={{
            fontFamily: "var(--mono)", fontSize: 18, color: "var(--ink)",
            letterSpacing: "-0.02em", fontWeight: 500, whiteSpace: "nowrap"
          }}>
            750 K <span style={{ fontSize: 9, color: "var(--ink-3)" }}>F</span>
          </div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--ink-3)", whiteSpace: "nowrap" }}>
            75 %
          </div>
        </div>
        <div style={{ height: 3, background: "var(--paper-2)", borderRadius: 999, marginTop: 6, overflow: "hidden" }}>
          <div style={{ height: "100%", width: "75%", background: "var(--accent-bright)", borderRadius: 999 }} />
        </div>
      </div>

      {/* WhatsApp message bubble — top left */}
      <div style={{
        position: "absolute", top: "9%", left: "6%",
        background: "white", borderRadius: "16px 16px 16px 4px",
        padding: "10px 12px",
        boxShadow: "0 8px 16px -8px rgba(20,50,104,0.15), 0 0 0 1px rgba(20,50,104,0.06)",
        display: "flex", alignItems: "center", gap: 8,
        transform: "rotate(-4deg)"
      }}>
        <span style={{
          width: 20, height: 20, borderRadius: 50, background: "#25D366",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "white", fontSize: 11, fontWeight: 700
        }}></span>
        <div>
          <div style={{ fontSize: 9, color: "var(--ink-3)", letterSpacing: "0.04em", textTransform: "uppercase", fontWeight: 500 }}>
            WhatsApp
          </div>
          <div style={{ fontSize: 11, color: "var(--ink)", fontWeight: 500, marginTop: 1 }}>
            Lien partagé
          </div>
        </div>
      </div>

      {/* Incoming contribution — top right */}
      <div style={{
        position: "absolute", top: "6%", right: "4%",
        background: "var(--ink)", color: "white",
        borderRadius: "16px 16px 4px 16px",
        padding: "10px 14px",
        boxShadow: "0 10px 20px -8px rgba(20,50,104,0.30)",
        transform: "rotate(5deg)"
      }}>
        <div style={{ fontSize: 9, color: "rgba(255,255,255,0.55)", letterSpacing: "0.04em", textTransform: "uppercase", fontWeight: 500 }}>
          Aminata K.
        </div>
        <div style={{
          fontFamily: "var(--mono)", fontSize: 16, fontWeight: 500,
          marginTop: 2, letterSpacing: "-0.02em", whiteSpace: "nowrap"
        }}>
          + 10 000 <span style={{ fontSize: 9, color: "var(--accent-bright)" }}>F</span>
        </div>
      </div>

      {/* Incoming contribution — bottom right */}
      <div style={{
        position: "absolute", bottom: "10%", right: "8%",
        background: "white", borderRadius: 14,
        padding: "8px 12px",
        boxShadow: "0 8px 16px -8px rgba(20,50,104,0.18), 0 0 0 1px rgba(20,50,104,0.06)",
        transform: "rotate(-3deg)",
        display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap"
      }}>
        <span style={{ width: 6, height: 6, borderRadius: 50, background: "var(--accent-bright)", flexShrink: 0 }} />
        <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--ink)", fontWeight: 500 }}>
          + 5 000 F
        </span>
        <span style={{ fontSize: 9, color: "var(--ink-4)" }}>il y a 2 s</span>
      </div>

      {/* Bottom-left small pill */}
      <div style={{
        position: "absolute", bottom: "8%", left: "10%",
        background: "var(--accent-bright)", color: "var(--ink)",
        borderRadius: 999, padding: "5px 11px",
        fontSize: 10, fontWeight: 600, letterSpacing: "0.04em",
        transform: "rotate(-2deg)",
        boxShadow: "0 6px 14px -4px rgba(244,184,41,0.5)"
      }}>
        23 contributeurs
      </div>
    </div>
  );
}

const navBtnSm = {
  width: 38, height: 38, borderRadius: 12, border: "1px solid var(--line)",
  background: "var(--paper)", display: "flex", alignItems: "center", justifyContent: "center",
  fontSize: 16, color: "var(--ink)", padding: 0
};

Object.assign(window, { MobileSplash, MobileOnboarding, MobilePhone, MobileOTP });
