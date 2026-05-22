/* MASTERCOTA — Landing page redesign (web)
   Editorial layout, single accent, real product hierarchy.
   ───────────────────────────────────────────────────────── */

const Wordmark = ({ size = 22 }) => (
  <img
    src="assets/logo-full.png"
    alt="MasterCota"
    style={{ height: size * 1.4, width: "auto", display: "block" }}
  />
);

const LogoIcon = ({ size = 32 }) => (
  <img
    src="assets/logo-icon.png"
    alt="MasterCota"
    style={{ height: size, width: "auto", display: "block" }}
  />
);

function Landing() {
  return (
    <div style={{ background: "var(--cream)", color: "var(--ink)", minHeight: "100%", paddingBottom: 80 }}>
      {/* ─── Top bar ─── */}
      <header style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "28px 64px", borderBottom: "1px solid var(--line-soft)"
      }}>
        <Wordmark />
        <nav style={{ display: "flex", gap: 36, fontSize: 13, color: "var(--ink-2)" }}>
          <a>Comment ça marche</a>
          <a>Sécurité</a>
          <a>À propos</a>
          <a>Support</a>
        </nav>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ fontSize: 13, color: "var(--ink-3)" }}>FR · FCFA</span>
          <button className="btn btn-primary" style={{ height: 40, padding: "0 18px", fontSize: 13 }}>
            Télécharger l'app →
          </button>
        </div>
      </header>

      {/* ─── HERO ─── */}
      <section style={{ padding: "96px 64px 80px", position: "relative" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          {/* Eyebrow row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 56 }}>
            <span className="eyebrow">N° 001 — Cagnottes collectives</span>
            <span className="eyebrow">Abidjan · Dakar · Yaoundé</span>
          </div>

          {/* Headline — editorial, big serif, two lines */}
          <h1 style={{
            fontFamily: "var(--serif)", fontWeight: 400,
            fontSize: 112, lineHeight: 0.95, letterSpacing: "-0.03em",
            margin: 0, maxWidth: 1100,
          }}>
            Cotiser ensemble,<br />
            <span className="serif-italic" style={{ color: "var(--accent)" }}>sans malentendu.</span>
          </h1>

          {/* Sub */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, marginTop: 56, alignItems: "end" }}>
            <p style={{
              fontSize: 19, lineHeight: 1.5, color: "var(--ink-2)", margin: 0, maxWidth: 520
            }}>
              MasterCota apporte la transparence et la traçabilité du paiement numérique
              aux cotisations entre familles, amis et collègues — Mobile Money, en un lien.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <button className="btn btn-accent">Télécharger sur iOS</button>
              <button className="btn btn-ghost">Voir une démo</button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Live ticker — pulled live cagnottes (looks more like a product than a marketing site) ─── */}
      <section style={{ borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", background: "var(--paper)" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 48,
          padding: "20px 64px", overflow: "hidden", whiteSpace: "nowrap",
          fontSize: 13, color: "var(--ink-2)"
        }}>
          <span className="eyebrow" style={{ flexShrink: 0 }}>En direct</span>
          {[
            ["Mariage Aïcha & Mamadou", "12 850", "F", "+3 200 F · il y a 2 min"],
            ["Tontine Bureau Plateau", "84 000", "F", "+5 000 F · il y a 6 min"],
            ["Funérailles Famille Diop", "245 700", "F", "+10 000 F · il y a 12 min"],
            ["Anniversaire de Fatou", "750 000", "F", "+2 000 F · il y a 18 min"],
          ].map(([title, amt, unit, meta], i) => (
            <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 12, flexShrink: 0 }}>
              <span style={{ width: 6, height: 6, borderRadius: 50, background: "var(--accent)", display: "inline-block" }} />
              <span style={{ fontWeight: 500 }}>{title}</span>
              <span className="num" style={{ color: "var(--ink-3)" }}>{amt} {unit}</span>
              <span style={{ fontSize: 11, color: "var(--ink-4)" }}>{meta}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── The product, shown — split layout with a real-feeling page ─── */}
      <section style={{ padding: "120px 64px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 80, alignItems: "center" }}>
          <div>
            <span className="eyebrow">01 — Page de cagnotte</span>
            <h2 className="serif" style={{ fontSize: 56, lineHeight: 1.02, margin: "20px 0 28px", letterSpacing: "-0.02em" }}>
              Une page <span className="serif-italic" style={{ color: "var(--accent)" }}>partageable</span> pour chaque cause.
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.55, color: "var(--ink-2)", maxWidth: 480, margin: 0 }}>
              Donnez un titre, un objectif, une date limite. MasterCota génère un lien
              <span className="mono" style={{ color: "var(--ink)", padding: "0 4px" }}>mastercota.com/c/votre-cause</span>
              que vous partagez sur WhatsApp. Vos contributeurs paient en deux taps, sans inscription.
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: "32px 0 0", display: "grid", gap: 14 }}>
              {[
                "Mobile Money — Wave, Orange, MTN, Moov",
                "Visa & Mastercard pour la diaspora",
                "Reversement automatique au créateur",
                "Page publique mise à jour en temps réel",
              ].map((s, i) => (
                <li key={i} style={{ display: "flex", gap: 14, alignItems: "baseline", fontSize: 15, color: "var(--ink-2)" }}>
                  <span className="mono" style={{ color: "var(--accent)", fontSize: 12 }}>0{i+1}</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Mini product mockup — looks like the real donation page, framed */}
          <ProductMock />
        </div>
      </section>

      {/* ─── Numbers — the model, plainly ─── */}
      <section style={{ background: "var(--ink)", color: "var(--paper)", padding: "120px 64px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 80, alignItems: "baseline" }}>
            <h2 className="serif" style={{ fontSize: 64, margin: 0, letterSpacing: "-0.02em", maxWidth: 700, lineHeight: 1 }}>
              Frais clairs.<br /><span className="serif-italic" style={{ opacity: 0.7 }}>Rien d'autre.</span>
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.5, color: "rgba(255,255,255,0.6)", maxWidth: 320, margin: 0 }}>
              Aucun abonnement. Aucun frais d'ouverture. Une commission unique de 2,5 % prélevée
              sur chaque contribution.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, borderTop: "1px solid rgba(255,255,255,0.15)" }}>
            {[
              ["2,5 %", "Frais tout inclus", "Pas de frais cachés"],
              ["0 F", "Pour contribuer", "Sans inscription contributeur"],
              ["48 h", "Reversement", "Au compte du créateur"],
              ["100 %", "Visible", "Liste publique des dons"],
            ].map(([n, label, sub], i) => (
              <div key={i} style={{
                padding: "40px 28px",
                borderRight: i < 3 ? "1px solid rgba(255,255,255,0.15)" : "none",
              }}>
                <div className="num" style={{ fontSize: 56, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 24 }}>
                  {n}
                </div>
                <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)" }}>{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How it works — numbered editorial flow ─── */}
      <section style={{ padding: "120px 64px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <span className="eyebrow">02 — Le déroulé</span>
          <h2 className="serif" style={{ fontSize: 64, margin: "20px 0 80px", letterSpacing: "-0.02em", maxWidth: 800, lineHeight: 1 }}>
            Quatre étapes pour <span className="serif-italic" style={{ color: "var(--accent)" }}>tout changer</span>.
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32 }}>
            {[
              ["Téléchargez", "L'app iOS ou Android. Connexion par SMS, sans mot de passe."],
              ["Créez", "Titre, objectif en FCFA, date limite. Le lien public est généré."],
              ["Partagez", "Un message WhatsApp, et la collecte commence."],
              ["Recevez", "Les fonds arrivent sur votre compte Mobile Money sous 48 h."],
            ].map(([t, d], i) => (
              <div key={i} style={{ borderTop: "1px solid var(--ink)", paddingTop: 28 }}>
                <div className="num" style={{ fontSize: 18, color: "var(--accent)", marginBottom: 18 }}>
                  {String(i+1).padStart(2, "0")}
                </div>
                <h3 className="serif" style={{ fontSize: 30, margin: "0 0 12px", letterSpacing: "-0.01em" }}>{t}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.5, color: "var(--ink-2)", margin: 0 }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Quote / testimonial — editorial ─── */}
      <section style={{ padding: "0 64px 120px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", borderTop: "1px solid var(--line)", paddingTop: 80 }}>
          <blockquote className="serif" style={{
            margin: 0, fontSize: 48, lineHeight: 1.15, letterSpacing: "-0.02em", color: "var(--ink)"
          }}>
            «&nbsp;On a réuni 380 000 F pour les funérailles de tante Awa
            en <span className="serif-italic" style={{ color: "var(--accent)" }}>quatre jours</span>.
            Plus personne ne demande qui a payé.&nbsp;»
          </blockquote>
          <div style={{ marginTop: 40, display: "flex", alignItems: "center", gap: 16 }}>
            <div className="ph" style={{ width: 44, height: 44, borderRadius: 50, fontSize: 9 }}>SD</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>Salimata Diallo</div>
              <div style={{ fontSize: 13, color: "var(--ink-3)" }}>Comptable · Dakar</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Download CTA ─── */}
      <section style={{ padding: "0 64px 120px" }}>
        <div style={{
          maxWidth: 1280, margin: "0 auto", background: "var(--paper)",
          border: "1px solid var(--line)", borderRadius: 24, padding: "64px 56px",
          display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 64, alignItems: "center"
        }}>
          <div>
            <span className="eyebrow">L'application</span>
            <h2 className="serif" style={{ fontSize: 56, margin: "16px 0 20px", lineHeight: 1.02, letterSpacing: "-0.02em" }}>
              Disponible sur iOS et Android.
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.55, color: "var(--ink-2)", margin: 0, maxWidth: 480 }}>
              Création gratuite. Votre première cagnotte en moins de deux minutes.
              Aucune carte bancaire requise pour démarrer.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 36 }}>
              <button className="btn btn-primary" style={{ height: 54, padding: "0 26px" }}>
                <span style={{ fontSize: 18 }}></span> App Store
              </button>
              <button className="btn btn-primary" style={{ height: 54, padding: "0 26px" }}>
                <span style={{ fontSize: 16 }}>▶</span> Google Play
              </button>
            </div>
          </div>
          <div className="ph" style={{ aspectRatio: "4/3", borderRadius: 16 }}>
            visuel · captures de l'app
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer style={{ padding: "48px 64px", borderTop: "1px solid var(--line)", fontSize: 13, color: "var(--ink-3)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Wordmark size={18} />
          <div style={{ display: "flex", gap: 24 }}>
            <a>CGU</a><a>Mentions légales</a><a>Support</a><a>support@mastercota.com</a>
          </div>
          <div>© 2026 MasterCota</div>
        </div>
      </footer>
    </div>
  );
}

/* Inline mini-product render so the landing shows the actual page */
function ProductMock() {
  return (
    <div style={{
      background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 20,
      padding: 22, boxShadow: "0 40px 60px -32px rgba(15,20,16,0.15)"
    }}>
      {/* tab chrome */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
        <div style={{ width: 10, height: 10, borderRadius: 50, background: "#E5E0EE" }} />
        <div style={{ width: 10, height: 10, borderRadius: 50, background: "#E5E0EE" }} />
        <div style={{ width: 10, height: 10, borderRadius: 50, background: "#E5E0EE" }} />
        <div className="mono" style={{
          flex: 1, marginLeft: 12, padding: "6px 12px", border: "1px solid var(--line)", borderRadius: 8,
          fontSize: 11, color: "var(--ink-3)", background: "var(--cream)"
        }}>
          mastercota.com/c/anniversaire-fatou
        </div>
      </div>

      {/* page */}
      <div style={{ background: "var(--cream)", borderRadius: 12, padding: 28 }}>
        <span className="eyebrow">Cagnotte collective · En cours</span>
        <h3 className="serif" style={{ fontSize: 32, margin: "12px 0 8px", letterSpacing: "-0.02em", lineHeight: 1.05 }}>
          Anniversaire surprise de Fatou
        </h3>
        <p style={{ fontSize: 12, color: "var(--ink-3)", margin: "0 0 24px", lineHeight: 1.5 }}>
          Pour lui offrir le voyage à Zanzibar dont elle rêve depuis trois ans.
        </p>

        {/* Big number */}
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 }}>
          <div>
            <div className="eyebrow" style={{ fontSize: 10, marginBottom: 4 }}>Collecté</div>
            <div className="num" style={{ fontSize: 38, color: "var(--ink)", letterSpacing: "-0.02em", lineHeight: 1 }}>
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

        {/* Contributors */}
        <div style={{ marginTop: 24, borderTop: "1px solid var(--line)", paddingTop: 18, display: "grid", gap: 12 }}>
          {[["Aminata K.", "25 000", "il y a 12 min"], ["Mamadou D.", "10 000", "il y a 28 min"], ["Anonyme", "5 000", "il y a 1 h"]].map(([n, a, t], i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 13 }}>
              <span>{n}</span>
              <div style={{ display: "flex", gap: 12, alignItems: "baseline", color: "var(--ink-3)" }}>
                <span style={{ fontSize: 11 }}>{t}</span>
                <span className="num" style={{ color: "var(--ink)" }}>{a} F</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Landing });
