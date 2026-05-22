/* MASTERCOTA — Mobile: Create cotisation, Profile, Payout setup
   ───────────────────────────────────────────────────────── */

function MobileCreate() {
  return (
    <IOSDevice >
      <div style={{ background: "var(--cream)", minHeight: "100%", paddingBottom: 110, position: "relative" }}>

        <header style={{ padding: "54px 20px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button style={navBtnXs}>✕</button>
          <span className="eyebrow">Nouvelle cagnotte</span>
          <button style={{
            background: "none", border: "none", color: "var(--ink-3)",
            fontSize: 13, fontWeight: 500, padding: 4
          }}>
            Brouillon
          </button>
        </header>

        <div style={{ padding: "16px 24px 0" }}>
          <h1 className="serif" style={{ fontSize: 30, letterSpacing: "-0.025em", lineHeight: 1.05, margin: "0 0 6px" }}>
            Créez votre<br />
            <span className="serif-italic" style={{ color: "var(--accent)" }}>cagnotte.</span>
          </h1>
          <p style={{ fontSize: 13, color: "var(--ink-2)", margin: 0 }}>
            Quelques infos suffisent. Vous pourrez tout ajuster plus tard.
          </p>
        </div>

        <div style={{ padding: "28px 24px 0", display: "grid", gap: 22 }}>
          {/* Title */}
          <Field2 label="Titre">
            <input
              type="text" defaultValue="Anniversaire surprise de Fatou"
              style={inputStyle}
            />
          </Field2>

          {/* Description */}
          <Field2 label="Description" hint="180 caractères max">
            <textarea
              rows={2} defaultValue="Pour ses 30 ans, on veut lui offrir le voyage à Zanzibar."
              style={{ ...inputStyle, resize: "none", fontSize: 14, lineHeight: 1.4 }}
            />
          </Field2>

          {/* Target — big number */}
          <div>
            <span className="eyebrow">Objectif</span>
            <div style={{
              marginTop: 10, paddingBottom: 12, borderBottom: "1px solid var(--ink)",
              display: "flex", alignItems: "baseline", gap: 8
            }}>
              <input
                type="text" defaultValue="1 000 000"
                style={{
                  flex: 1, border: "none", outline: "none", background: "transparent",
                  fontFamily: "var(--mono)", fontSize: 36, letterSpacing: "-0.02em",
                  color: "var(--ink)", padding: 0, fontWeight: 500
                }}
              />
              <span className="mono" style={{ fontSize: 14, color: "var(--ink-3)" }}>FCFA</span>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 12, overflowX: "auto" }} className="no-scrollbar">
              {["50 000", "100 000", "250 000", "500 000", "1 M"].map((p) => (
                <button key={p} style={{
                  flexShrink: 0, padding: "6px 12px", borderRadius: 999,
                  background: "transparent", border: "1px solid var(--line)",
                  fontSize: 11, color: "var(--ink-2)", fontWeight: 500
                }} className="mono">
                  {p} F
                </button>
              ))}
            </div>
          </div>

          {/* Deadline + Privacy — paired */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field2 label="Échéance">
              <div style={{ display: "flex", alignItems: "center", gap: 6, paddingTop: 8 }}>
                <span className="mono" style={{ fontSize: 16 }}>26 mai</span>
                <span style={{ fontSize: 10, color: "var(--ink-3)" }}>▼</span>
              </div>
            </Field2>
            <Field2 label="Visibilité">
              <div style={{ display: "flex", alignItems: "center", gap: 6, paddingTop: 8 }}>
                <span style={{ fontSize: 16 }}>Publique</span>
                <span style={{ fontSize: 10, color: "var(--ink-3)" }}>▼</span>
              </div>
            </Field2>
          </div>

          {/* Options */}
          <div style={{
            border: "1px solid var(--line)", borderRadius: 16, overflow: "hidden",
            background: "var(--paper)"
          }}>
            <Toggle label="Dons anonymes autorisés" defaultOn />
            <Toggle label="Afficher la barre de progression" defaultOn />
            <Toggle label="Mettre en avant le meilleur contributeur" defaultOn={false} last />
          </div>

          {/* Fee note */}
          <div style={{
            padding: "12px 16px", background: "var(--accent-soft)",
            border: "1px solid var(--accent-line)", borderRadius: 12,
            fontSize: 12, color: "var(--accent-dark)", lineHeight: 1.5
          }}>
            <strong style={{ fontWeight: 500 }}>Frais : 2,5 %</strong> par contribution. Aucun frais de
            création, aucun abonnement.
          </div>
        </div>

        {/* Sticky CTA */}
        <div style={{
          position: "absolute", bottom: 24, left: 16, right: 16,
          background: "var(--ink)", borderRadius: 18, padding: 6,
          display: "flex", gap: 6
        }}>
          <button style={{
            background: "transparent", color: "var(--paper)", border: "none",
            padding: "0 18px", height: 50, fontSize: 13, fontWeight: 500
          }}>
            Aperçu
          </button>
          <button style={{
            flex: 1, background: "var(--accent)", color: "white", border: "none",
            height: 50, borderRadius: 14, fontSize: 14, fontWeight: 500
          }}>
            Créer la cagnotte →
          </button>
        </div>
      </div>
    </IOSDevice>
  );
}

function MobileProfile() {
  return (
    <IOSDevice >
      <div style={{ background: "var(--cream)", minHeight: "100%", paddingBottom: 110, position: "relative" }}>

        <header style={{ padding: "54px 20px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button style={navBtnXs}>←</button>
          <span className="eyebrow">Profil</span>
          <button style={navBtnXs}>⋯</button>
        </header>

        {/* Identity */}
        <section style={{ padding: "16px 24px 24px", textAlign: "center" }}>
          <div style={{
            width: 84, height: 84, margin: "0 auto 16px",
            background: "var(--ink)", color: "var(--paper)",
            borderRadius: 50,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--display)", fontSize: 36, fontWeight: 400, letterSpacing: "-0.02em"
          }}>
            A
          </div>
          <div className="serif" style={{ fontSize: 26, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
            Aminata Koné
          </div>
          <div className="mono" style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 4 }}>
            +225 07 12 34 56 78
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 14 }}>
            <span className="pill"><span className="dot" />Vérifié</span>
            <span className="pill">Depuis mai 2026</span>
          </div>
        </section>

        {/* Mini stats */}
        <section style={{ padding: "0 20px 20px" }}>
          <div style={{
            background: "var(--paper)", border: "1px solid var(--line)",
            borderRadius: 18, padding: "16px 8px",
            display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
          }}>
            {[
              ["1 425 K", "Collecté"],
              ["3", "Actives"],
              ["47", "Donateurs"],
            ].map(([n, l], i) => (
              <div key={i} style={{
                textAlign: "center",
                borderLeft: i > 0 ? "1px solid var(--line)" : "none"
              }}>
                <div className="num" style={{ fontSize: 20, letterSpacing: "-0.02em" }}>{n}</div>
                <div className="eyebrow" style={{ fontSize: 10, marginTop: 4 }}>{l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Settings list */}
        <section style={{ padding: "0 20px" }}>
          <span className="eyebrow" style={{ paddingLeft: 4 }}>Compte</span>
          <div style={{
            marginTop: 10, background: "var(--paper)", border: "1px solid var(--line)",
            borderRadius: 16, overflow: "hidden"
          }}>
            <Row2 label="Compte de versement" value="Wave · +225 ··· 78" warning />
            <Row2 label="Notifications" value="Activées" />
            <Row2 label="Sécurité" value="Code par SMS" />
            <Row2 label="Langue" value="Français" last />
          </div>

          <span className="eyebrow" style={{ paddingLeft: 4, display: "block", marginTop: 22 }}>Aide</span>
          <div style={{
            marginTop: 10, background: "var(--paper)", border: "1px solid var(--line)",
            borderRadius: 16, overflow: "hidden"
          }}>
            <Row2 label="Centre d'aide" />
            <Row2 label="Conditions d'utilisation" />
            <Row2 label="Contacter le support" last />
          </div>

          <button style={{
            width: "100%", marginTop: 22, padding: "16px 0",
            background: "transparent", border: "1px solid var(--line)",
            borderRadius: 16, color: "var(--ink-2)", fontSize: 14, fontWeight: 500
          }}>
            Se déconnecter
          </button>

          <div style={{ textAlign: "center", marginTop: 18, fontSize: 11, color: "var(--ink-4)" }}>
            <span className="mono">MasterCota · v1.0.3</span>
          </div>
        </section>
      </div>
    </IOSDevice>
  );
}

function MobilePayout() {
  return (
    <IOSDevice >
      <div style={{ background: "var(--cream)", minHeight: "100%", paddingBottom: 100, position: "relative" }}>

        <header style={{ padding: "54px 20px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button style={navBtnXs}>←</button>
          <span className="eyebrow">Compte de versement</span>
          <span style={{ width: 38 }} />
        </header>

        <div style={{ padding: "16px 24px 0" }}>
          <h1 className="serif" style={{ fontSize: 28, letterSpacing: "-0.025em", lineHeight: 1.05, margin: "0 0 8px" }}>
            Où recevoir<br />
            <span className="serif-italic" style={{ color: "var(--accent)" }}>vos fonds ?</span>
          </h1>
          <p style={{ fontSize: 13, color: "var(--ink-2)", margin: 0, lineHeight: 1.5 }}>
            Les contributions sont versées automatiquement sur ce compte
            sous 48&nbsp;h ouvrées.
          </p>

          {/* Warning if not set */}
          <div style={{
            marginTop: 22, padding: "14px 16px",
            background: "rgba(184,115,26,0.08)", border: "1px solid rgba(184,115,26,0.25)",
            borderRadius: 12, fontSize: 12, color: "var(--warn)", lineHeight: 1.5,
            display: "flex", alignItems: "flex-start", gap: 10
          }}>
            <span style={{
              width: 18, height: 18, borderRadius: 50, background: "var(--warn)", color: "white",
              fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
            }}>!</span>
            <span>
              <strong style={{ fontWeight: 500 }}>Configuration requise.</strong> Sans compte de versement,
              vous ne pourrez pas recevoir les fonds de vos cagnottes.
            </span>
          </div>
        </div>

        {/* Method selector */}
        <section style={{ padding: "24px 24px 0" }}>
          <span className="eyebrow">Méthode</span>
          <div style={{
            marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10
          }}>
            <MethodCard name="Mobile Money" sub="Wave · Orange · MTN · Moov" active />
            <MethodCard name="Compte bancaire" sub="UBA · Ecobank · SGBCI · …" />
          </div>
        </section>

        {/* Form */}
        <section style={{ padding: "24px 24px 0", display: "grid", gap: 18 }}>
          <Field2 label="Opérateur">
            <div style={{ display: "flex", alignItems: "center", gap: 8, paddingTop: 8 }}>
              <span style={{
                width: 20, height: 20, borderRadius: 4, background: "var(--accent)"
              }} />
              <span style={{ fontSize: 16, fontWeight: 500 }}>Wave</span>
              <span style={{ fontSize: 10, color: "var(--ink-3)" }}>▼</span>
            </div>
          </Field2>

          <Field2 label="Numéro Wave" hint="Doit être à votre nom">
            <input type="tel" defaultValue="+225 07 12 34 56 78" style={{
              ...inputStyle, fontFamily: "var(--mono)", letterSpacing: "0.01em"
            }} />
          </Field2>

          <Field2 label="Nom du titulaire">
            <input type="text" defaultValue="Aminata Koné" style={inputStyle} />
          </Field2>
        </section>

        {/* Sticky CTA */}
        <div style={{
          position: "absolute", bottom: 24, left: 16, right: 16,
          display: "grid", gridTemplateColumns: "auto 1fr", gap: 8
        }}>
          <button style={{
            background: "var(--paper)", border: "1px solid var(--line)", color: "var(--ink)",
            height: 52, padding: "0 22px", borderRadius: 16, fontSize: 13, fontWeight: 500
          }}>
            Plus tard
          </button>
          <button style={{
            background: "var(--accent)", color: "white", border: "none",
            height: 52, borderRadius: 16, fontSize: 14, fontWeight: 500
          }}>
            Vérifier et enregistrer
          </button>
        </div>
      </div>
    </IOSDevice>
  );
}

/* ─── shared bits ─── */

const navBtnXs = {
  width: 38, height: 38, borderRadius: 12, border: "1px solid var(--line)",
  background: "var(--paper)", display: "flex", alignItems: "center", justifyContent: "center",
  fontSize: 16, color: "var(--ink)", padding: 0
};

const inputStyle = {
  width: "100%", border: "none", outline: "none", background: "transparent",
  fontSize: 16, color: "var(--ink)", padding: "10px 0",
};

function Field2({ label, hint, children }) {
  return (
    <div style={{ borderBottom: "1px solid var(--line)", paddingBottom: 4 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span className="eyebrow">{label}</span>
        {hint && <span style={{ fontSize: 10, color: "var(--ink-4)" }}>{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function Row2({ label, value, last, warning }) {
  return (
    <div style={{
      padding: "16px 16px",
      borderBottom: last ? "none" : "1px solid var(--line)",
      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12
    }}>
      <span style={{ fontSize: 14, color: "var(--ink)", fontWeight: 500 }}>{label}</span>
      <span style={{
        fontSize: 13, color: warning ? "var(--warn)" : "var(--ink-3)",
        display: "flex", alignItems: "center", gap: 8
      }}>
        {value || ""}
        <span style={{ fontSize: 10, color: "var(--ink-4)" }}>›</span>
      </span>
    </div>
  );
}

function Toggle({ label, defaultOn, last }) {
  const [on, setOn] = React.useState(!!defaultOn);
  return (
    <div style={{
      padding: "14px 16px",
      borderBottom: last ? "none" : "1px solid var(--line)",
      display: "flex", alignItems: "center", justifyContent: "space-between"
    }}>
      <span style={{ fontSize: 14 }}>{label}</span>
      <button
        onClick={() => setOn(!on)}
        style={{
          width: 42, height: 26, borderRadius: 999,
          background: on ? "var(--ink)" : "var(--ink-4)",
          border: "none", padding: 2, position: "relative",
          transition: "background .2s"
        }}>
        <span style={{
          display: "block", width: 22, height: 22, borderRadius: 50,
          background: "var(--paper)", marginLeft: on ? 16 : 0,
          transition: "margin .2s"
        }} />
      </button>
    </div>
  );
}

function MethodCard({ name, sub, active }) {
  return (
    <div style={{
      padding: "14px 14px", borderRadius: 14,
      background: active ? "var(--ink)" : "var(--paper)",
      color: active ? "var(--paper)" : "var(--ink)",
      border: "1px solid " + (active ? "var(--ink)" : "var(--line)")
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 14, fontWeight: 500 }}>{name}</span>
        <span style={{
          width: 14, height: 14, borderRadius: 50,
          border: "1px solid " + (active ? "var(--paper)" : "var(--ink-4)"),
          background: active ? "var(--accent)" : "transparent"
        }} />
      </div>
      <div style={{
        fontSize: 11, color: active ? "rgba(255,255,255,0.55)" : "var(--ink-3)",
        marginTop: 4
      }}>
        {sub}
      </div>
    </div>
  );
}

Object.assign(window, { MobileCreate, MobileProfile, MobilePayout });
