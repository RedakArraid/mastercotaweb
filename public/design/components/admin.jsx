/* MASTERCOTA — Admin web screens
   Sidebar navy, content blanc, mêmes tokens que le reste du système.
   ───────────────────────────────────────────────────────── */

const ADMIN_NAV = [
  ["dashboard", "Tableau de bord", "▦"],
  ["users", "Utilisateurs", "○○"],
  ["cotisations", "Cotisations", "◐"],
  ["contributions", "Paiements", "↗"],
  ["settings", "Paramètres", "⚙"],
];

function AdminShell({ active, children, title, subtitle, actions }) {
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "240px 1fr",
      width: "100%", minHeight: "100%", background: "var(--paper-2)"
    }}>
      {/* ── Sidebar ── */}
      <aside style={{
        background: "var(--ink)", color: "var(--paper)",
        padding: "24px 0", display: "flex", flexDirection: "column"
      }}>
        <div style={{ padding: "0 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "6px 0"
          }}>
            <img src="assets/logo-icon.png" alt="" style={{ height: 32, width: "auto" }} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: "var(--paper)" }}>MasterCota</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                Admin
              </div>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: "20px 12px", display: "flex", flexDirection: "column", gap: 2 }}>
          <div style={{
            fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em",
            textTransform: "uppercase", padding: "0 12px 10px"
          }}>
            Navigation
          </div>
          {ADMIN_NAV.map(([id, label, ic]) => {
            const isActive = id === active;
            return (
              <button key={id} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "10px 12px", borderRadius: 10,
                background: isActive ? "rgba(244,184,41,0.12)" : "transparent",
                color: isActive ? "var(--accent-bright)" : "rgba(255,255,255,0.6)",
                fontSize: 13, fontWeight: 500, border: "none", textAlign: "left",
                position: "relative", cursor: "pointer"
              }}>
                {isActive && (
                  <span style={{
                    position: "absolute", left: -12, top: 6, bottom: 6, width: 3,
                    background: "var(--accent-bright)", borderRadius: "0 4px 4px 0"
                  }} />
                )}
                <span style={{
                  width: 20, textAlign: "center", fontFamily: "var(--mono)",
                  fontSize: 11, opacity: 0.85
                }}>{ic}</span>
                {label}
              </button>
            );
          })}
        </nav>

        <div style={{ padding: "0 12px" }}>
          <div style={{
            padding: "12px 14px", borderRadius: 12,
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
            display: "flex", alignItems: "center", gap: 12
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 50, background: "var(--accent-bright)",
              color: "var(--ink)", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 600
            }}>AK</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: "var(--paper)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                Aminata K.
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }} className="mono">
                admin@mastercota.com
              </div>
            </div>
          </div>
          <button style={{
            width: "100%", marginTop: 10, padding: "10px 12px", borderRadius: 10,
            background: "transparent", color: "rgba(255,255,255,0.4)",
            border: "none", fontSize: 12, textAlign: "left", display: "flex", alignItems: "center", gap: 10
          }}>
            <span style={{ fontFamily: "var(--mono)" }}>↗</span> Se déconnecter
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main style={{ overflow: "auto" }}>
        {/* Page header */}
        <header style={{
          padding: "28px 40px 20px", display: "flex", justifyContent: "space-between",
          alignItems: "flex-end", gap: 24, borderBottom: "1px solid var(--line)",
          background: "var(--cream)"
        }}>
          <div>
            <div style={{ fontSize: 11, color: "var(--ink-3)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>
              Admin · {subtitle || ""}
            </div>
            <h1 className="serif" style={{ fontSize: 36, letterSpacing: "-0.025em", margin: 0, lineHeight: 1.05 }}>
              {title}
            </h1>
          </div>
          {actions}
        </header>

        <div style={{ padding: "32px 40px 60px" }}>
          {children}
        </div>
      </main>
    </div>
  );
}

/* ─── DASHBOARD ─── */
function AdminDashboard() {
  const days = Array.from({ length: 28 }, (_, i) => {
    const seeds = [12, 18, 8, 24, 32, 15, 22, 10, 28, 35, 20, 14, 26, 30, 38, 22, 18, 42, 35, 28, 45, 52, 38, 30, 48, 55, 62, 75];
    return seeds[i];
  });
  const max = Math.max(...days);

  return (
    <AdminShell
      active="dashboard"
      title="Tableau de bord"
      subtitle="Vue d'ensemble"
      actions={
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span className="pill"><span className="dot" />En direct</span>
          <select style={selectStyle}>
            <option>28 derniers jours</option>
            <option>7 derniers jours</option>
            <option>Ce mois</option>
          </select>
          <button className="btn btn-primary" style={{ height: 38, padding: "0 16px", fontSize: 13 }}>
            Exporter →
          </button>
        </div>
      }
    >
      {/* KPI row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        <Kpi label="Utilisateurs" value="2 847" delta="+12,4 %" deltaPositive sub="+312 ce mois" />
        <Kpi label="Cotisations actives" value="184" delta="+8,1 %" deltaPositive sub="42 créées ce mois" />
        <Kpi label="Total collecté" value="48,2 M" unit="F" delta="+24,8 %" deltaPositive sub="vs mois dernier" />
        <Kpi label="Commission MasterCota" value="1,205 M" unit="F" delta="−2,1 %" sub="vs mois dernier" />
      </div>

      {/* Chart + sidebar */}
      <div style={{ display: "grid", gridTemplateColumns: "1.7fr 1fr", gap: 16, marginTop: 16 }}>
        <Panel
          title="Volume de paiements"
          right={
            <div style={{ display: "flex", gap: 14, fontSize: 11, color: "var(--ink-3)" }}>
              <Legend color="var(--accent-bright)" label="Encaissé" />
              <Legend color="rgba(20,50,104,0.20)" label="J−28 à J−7" />
            </div>
          }
        >
          {/* Numbers above chart */}
          <div style={{ display: "flex", gap: 32, marginBottom: 18 }}>
            <div>
              <div className="num" style={{ fontSize: 30, letterSpacing: "-0.025em", lineHeight: 1 }}>
                4,82 <span style={{ fontSize: 14, color: "var(--ink-3)" }}>M F</span>
              </div>
              <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 6 }}>Volume total · 28 j</div>
            </div>
            <div>
              <div className="num" style={{ fontSize: 30, letterSpacing: "-0.025em", lineHeight: 1 }}>
                612
              </div>
              <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 6 }}>Transactions</div>
            </div>
            <div>
              <div className="num" style={{ fontSize: 30, letterSpacing: "-0.025em", lineHeight: 1, color: "var(--forest)" }}>
                98,4 %
              </div>
              <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 6 }}>Taux de succès</div>
            </div>
          </div>

          {/* Bar chart */}
          <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 140 }}>
            {days.map((v, i) => (
              <div key={i} style={{
                flex: 1,
                height: (v / max) * 100 + "%",
                background: i >= days.length - 7 ? "var(--accent-bright)" : "rgba(20,50,104,0.18)",
                borderRadius: 3
              }} />
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 10, color: "var(--ink-4)" }}>
            <span className="mono">28 avr.</span>
            <span className="mono">12 mai</span>
            <span className="mono">26 mai</span>
          </div>
        </Panel>

        <Panel title="Cotisations à valider" right={<a style={{ fontSize: 12, color: "var(--accent-dark)", fontWeight: 500 }}>Tout voir →</a>}>
          <div style={{ display: "grid", gap: 0 }}>
            {[
              ["Funérailles Famille Diop", "591 000", "completed"],
              ["Anniversaire Fatou", "750 000", "active"],
              ["Tontine Bureau Plateau", "84 000", "active"],
              ["Mariage Aïcha & Mamadou", "12 850", "pending"],
            ].map(([t, a, s], i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "14px 0", borderBottom: i < 3 ? "1px solid var(--line-soft)" : "none"
              }}>
                <div style={{ minWidth: 0, paddingRight: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {t}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 2 }}>
                    <span className="mono">{a} F</span>
                    <span style={{ margin: "0 6px" }}>·</span>
                    <StatusDot status={s} />
                  </div>
                </div>
                <span style={{ fontSize: 14, color: "var(--ink-4)" }}>›</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* Recent activity table */}
      <Panel title="Derniers paiements" right={<a style={{ fontSize: 12, color: "var(--accent-dark)", fontWeight: 500 }}>Voir tous →</a>} style={{ marginTop: 16 }}>
        <Table
          headers={["#", "Contributeur", "Cagnotte", "Montant", "Méthode", "Statut", "Quand"]}
          widths={["50px", "1.2fr", "1.5fr", "100px", "1fr", "auto", "auto"]}
          rows={[
            ["00 612", "Aminata Koné", "Anniversaire Fatou", "10 000 F", "Wave", { status: "paid" }, "il y a 2 min"],
            ["00 611", "Mamadou Diallo", "Tontine Bureau", "5 000 F", "Orange Money", { status: "paid" }, "il y a 8 min"],
            ["00 610", "Anonyme", "Funérailles Diop", "20 000 F", "MTN MoMo", { status: "paid" }, "il y a 14 min"],
            ["00 609", "Sékou Touré", "Anniversaire Fatou", "10 000 F", "Wave", { status: "pending" }, "il y a 22 min"],
            ["00 608", "Awa Sow", "Mariage Aïcha", "15 000 F", "Carte", { status: "paid" }, "il y a 1 h"],
            ["00 607", "Boubacar N.", "Anniversaire Fatou", "5 000 F", "Wave", { status: "failed" }, "il y a 2 h"],
          ]}
        />
      </Panel>
    </AdminShell>
  );
}

/* ─── COTISATIONS ─── */
function AdminCotisations() {
  return (
    <AdminShell
      active="cotisations"
      title="Cotisations"
      subtitle="184 actives"
      actions={
        <div style={{ display: "flex", gap: 10 }}>
          <input placeholder="Rechercher une cotisation…" style={{ ...selectStyle, minWidth: 260, fontSize: 13 }} />
          <select style={selectStyle}><option>Tous statuts</option></select>
          <button className="btn btn-primary" style={{ height: 38, padding: "0 16px", fontSize: 13 }}>
            Exporter
          </button>
        </div>
      }
    >
      {/* Filter pills */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {[
          ["Toutes", 268, true],
          ["Actives", 184, false],
          ["Atteintes", 56, false],
          ["Clôturées", 22, false],
          ["En revue", 6, false],
        ].map(([label, n, active]) => (
          <button key={label} style={{
            padding: "8px 14px", borderRadius: 999, fontSize: 12, fontWeight: 500,
            background: active ? "var(--ink)" : "var(--cream)",
            color: active ? "var(--paper)" : "var(--ink-2)",
            border: "1px solid " + (active ? "var(--ink)" : "var(--line)")
          }}>
            {label} <span style={{ opacity: active ? 0.5 : 0.7, marginLeft: 4 }} className="mono">{n}</span>
          </button>
        ))}
      </div>

      <Panel title="Liste des cotisations" right={<span style={{ fontSize: 11, color: "var(--ink-3)" }} className="mono">268 résultats · page 1/12</span>}>
        <Table
          headers={["", "Titre", "Créateur", "Collecté", "Objectif", "Progression", "Statut", "Date", ""]}
          widths={["28px", "1.6fr", "1fr", "120px", "120px", "150px", "auto", "100px", "60px"]}
          rows={[
            [<input type="checkbox" />, ["Anniversaire surprise de Fatou", "anniversaire-fatou"], "Aminata K.", "750 000 F", "1 000 000 F", { progress: 75 }, { status: "active" }, "14 mai", "›"],
            [<input type="checkbox" />, ["Tontine Bureau Plateau", "tontine-plateau-mai"], "Mamadou D.", "84 000 F", "150 000 F", { progress: 56 }, { status: "active" }, "12 mai", "›"],
            [<input type="checkbox" />, ["Funérailles Famille Diop", "funerailles-diop"], "Awa Sow", "591 000 F", "500 000 F", { progress: 118 }, { status: "completed" }, "10 mai", "›"],
            [<input type="checkbox" />, ["Mariage Aïcha & Mamadou", "mariage-aicha-mamadou"], "Salimata D.", "12 850 F", "800 000 F", { progress: 2 }, { status: "pending" }, "9 mai", "›"],
            [<input type="checkbox" />, ["Projet école Korhogo", "ecole-korhogo-2026"], "Sékou T.", "245 700 F", "1 500 000 F", { progress: 16 }, { status: "active" }, "5 mai", "›"],
            [<input type="checkbox" />, ["Voyage classe terminale", "voyage-terminale"], "Marie-Claire", "1 425 000 F", "1 200 000 F", { progress: 119 }, { status: "completed" }, "1 mai", "›"],
            [<input type="checkbox" />, ["Pèlerinage tante Aminata", "pelerinage-aminata"], "Boubacar N.", "320 000 F", "2 000 000 F", { progress: 16 }, { status: "closed" }, "28 avr.", "›"],
            [<input type="checkbox" />, ["Achat groupe ordinateurs", "ordis-coop"], "Issa Camara", "85 200 F", "450 000 F", { progress: 19 }, { status: "active" }, "26 avr.", "›"],
          ]}
        />
      </Panel>
    </AdminShell>
  );
}

/* ─── USERS ─── */
function AdminUsers() {
  return (
    <AdminShell
      active="users"
      title="Utilisateurs"
      subtitle="2 847 comptes"
      actions={
        <div style={{ display: "flex", gap: 10 }}>
          <input placeholder="Téléphone, nom, ID…" style={{ ...selectStyle, minWidth: 280, fontSize: 13 }} />
          <button className="btn btn-primary" style={{ height: 38, padding: "0 16px", fontSize: 13 }}>
            Inviter →
          </button>
        </div>
      }
    >
      {/* Mini stats strip */}
      <div style={{
        background: "var(--cream)", border: "1px solid var(--line)", borderRadius: 16,
        padding: 0, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", marginBottom: 20
      }}>
        {[
          ["2 847", "Total comptes", null],
          ["2 612", "Vérifiés", "92 %"],
          ["312", "Nouveaux ce mois", "+12,4 %"],
          ["184", "Créateurs actifs", null],
        ].map(([n, l, s], i) => (
          <div key={i} style={{
            padding: "18px 22px",
            borderRight: i < 3 ? "1px solid var(--line)" : "none"
          }}>
            <div className="num" style={{ fontSize: 24, letterSpacing: "-0.02em" }}>{n}</div>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginTop: 4 }}>
              <span style={{ fontSize: 11, color: "var(--ink-3)" }}>{l}</span>
              {s && <span className="mono" style={{ fontSize: 11, color: "var(--forest)" }}>{s}</span>}
            </div>
          </div>
        ))}
      </div>

      <Panel title="Comptes utilisateurs" right={<span style={{ fontSize: 11, color: "var(--ink-3)" }} className="mono">2 847 · page 1/95</span>}>
        <Table
          headers={["", "Utilisateur", "Téléphone", "Cagnottes", "Total reçu", "Statut", "Inscrit", ""]}
          widths={["28px", "1.6fr", "1fr", "100px", "140px", "auto", "auto", "60px"]}
          rows={[
            [<input type="checkbox" />, ["Aminata Koné", "AK"], "+225 ··· 78", "3", "1 425 000 F", { status: "verified" }, "il y a 1 mois", "›"],
            [<input type="checkbox" />, ["Mamadou Diallo", "MD"], "+225 ··· 12", "1", "84 000 F", { status: "verified" }, "il y a 1 mois", "›"],
            [<input type="checkbox" />, ["Awa Sow", "AS"], "+221 ··· 47", "2", "836 700 F", { status: "verified" }, "il y a 2 mois", "›"],
            [<input type="checkbox" />, ["Salimata Diallo", "SD"], "+221 ··· 22", "0", "—", { status: "pending" }, "il y a 5 j", "›"],
            [<input type="checkbox" />, ["Sékou Touré", "ST"], "+223 ··· 91", "1", "245 700 F", { status: "verified" }, "il y a 3 mois", "›"],
            [<input type="checkbox" />, ["Marie-Claire Adjo", "MA"], "+228 ··· 04", "1", "1 425 000 F", { status: "verified" }, "il y a 4 mois", "›"],
            [<input type="checkbox" />, ["Boubacar Niang", "BN"], "+221 ··· 56", "1", "320 000 F", { status: "blocked" }, "il y a 6 mois", "›"],
            [<input type="checkbox" />, ["Issa Camara", "IC"], "+224 ··· 18", "1", "85 200 F", { status: "verified" }, "il y a 1 mois", "›"],
          ]}
        />
      </Panel>
    </AdminShell>
  );
}

/* ─── LOGIN ─── */
function AdminLogin() {
  return (
    <div style={{
      width: "100%", minHeight: "100%", background: "var(--paper-2)",
      display: "grid", gridTemplateColumns: "1fr 1fr"
    }}>
      {/* Left: brand */}
      <div style={{
        background: "var(--ink)", color: "var(--paper)",
        padding: "56px 56px 56px", display: "flex", flexDirection: "column",
        justifyContent: "space-between", position: "relative", overflow: "hidden"
      }}>
        <div style={{
          position: "absolute", top: -120, right: -120, width: 380, height: 380,
          borderRadius: 50, background: "var(--accent)", opacity: 0.15
        }} />

        <div style={{ display: "flex", alignItems: "center", gap: 14, position: "relative" }}>
          <img src="assets/logo-icon.png" alt="" style={{ height: 38 }} />
          <div>
            <div style={{ fontSize: 18, fontWeight: 500 }}>MasterCota</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Admin
            </div>
          </div>
        </div>

        <div style={{ position: "relative" }}>
          <span className="eyebrow" style={{ color: "rgba(255,255,255,0.5)" }}>Panel d'administration</span>
          <h2 className="serif" style={{
            fontSize: 56, lineHeight: 1.02, letterSpacing: "-0.03em", margin: "16px 0 18px"
          }}>
            Bienvenue.<br />
            <span className="serif-italic" style={{ color: "var(--accent-bright)" }}>Connectez-vous.</span>
          </h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.55, margin: 0, maxWidth: 360 }}>
            Accès réservé aux administrateurs MasterCota. Toute connexion est consignée
            et soumise à validation MFA.
          </p>
        </div>

        <div style={{ position: "relative", display: "flex", gap: 24, fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
          <span><span className="mono" style={{ color: "var(--paper)" }}>v1.0.3</span> · production</span>
          <span>Région · Abidjan</span>
          <span>Statut · opérationnel</span>
        </div>
      </div>

      {/* Right: form */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 40, background: "var(--cream)"
      }}>
        <div style={{ width: "100%", maxWidth: 380 }}>
          <span className="eyebrow">Authentification</span>
          <h3 className="serif" style={{ fontSize: 32, letterSpacing: "-0.025em", margin: "10px 0 32px" }}>
            Identifiez-vous.
          </h3>

          <div style={{ display: "grid", gap: 22 }}>
            <FieldAd label="Adresse e-mail">
              <input type="email" defaultValue="admin@mastercota.com" style={inputAd} />
            </FieldAd>
            <FieldAd label="Mot de passe" trailing={
              <a style={{ fontSize: 11, color: "var(--accent-dark)", fontWeight: 500 }}>Oublié ?</a>
            }>
              <input type="password" defaultValue="••••••••••" style={inputAd} />
            </FieldAd>
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 20, fontSize: 12, color: "var(--ink-2)" }}>
            <input type="checkbox" defaultChecked />
            Garder ma session active pendant 24 h
          </label>

          <button className="btn btn-primary" style={{ width: "100%", marginTop: 28, height: 54, fontSize: 14 }}>
            Continuer → code MFA
          </button>

          <p style={{ fontSize: 11, color: "var(--ink-3)", textAlign: "center", marginTop: 18, lineHeight: 1.5 }}>
            Vous serez invité à saisir un code à 6 chiffres généré par votre application
            d'authentification après cette étape.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── shared bits ─── */

function Kpi({ label, value, unit, sub, delta, deltaPositive }) {
  return (
    <div style={{
      background: "var(--cream)", border: "1px solid var(--line)", borderRadius: 16,
      padding: "20px 22px"
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 11, color: "var(--ink-3)", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 500 }}>
          {label}
        </span>
        {delta && (
          <span style={{
            fontSize: 10, fontWeight: 500, padding: "3px 8px", borderRadius: 999,
            background: deltaPositive ? "var(--forest-soft)" : "rgba(184,115,26,0.10)",
            color: deltaPositive ? "var(--forest)" : "var(--warn)"
          }} className="mono">
            {delta}
          </span>
        )}
      </div>
      <div className="num" style={{ fontSize: 36, letterSpacing: "-0.025em", marginTop: 14, lineHeight: 1 }}>
        {value} {unit && <span style={{ fontSize: 14, color: "var(--ink-3)" }}>{unit}</span>}
      </div>
      {sub && <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 8 }}>{sub}</div>}
    </div>
  );
}

function Panel({ title, right, children, style }) {
  return (
    <div style={{
      background: "var(--cream)", border: "1px solid var(--line)", borderRadius: 16,
      padding: "20px 24px 22px", ...style
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <h3 className="serif" style={{ fontSize: 18, margin: 0, letterSpacing: "-0.015em" }}>{title}</h3>
        {right}
      </div>
      {children}
    </div>
  );
}

function Legend({ color, label }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <span style={{ width: 10, height: 10, background: color, borderRadius: 3 }} />
      {label}
    </span>
  );
}

function StatusDot({ status }) {
  const map = {
    paid: ["var(--forest)", "Payé"],
    pending: ["var(--warn)", "En cours"],
    failed: ["#C73B2B", "Échec"],
    active: ["var(--accent-dark)", "Active"],
    completed: ["var(--forest)", "Atteinte"],
    closed: ["var(--ink-3)", "Clôturée"],
    verified: ["var(--forest)", "Vérifié"],
    blocked: ["#C73B2B", "Bloqué"],
  };
  const [c, l] = map[status] || [status, status];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--ink-2)" }}>
      <span style={{ width: 6, height: 6, borderRadius: 50, background: c }} />
      {l}
    </span>
  );
}

function Table({ headers, widths, rows }) {
  const gridCols = widths.join(" ");
  return (
    <div>
      {/* Head */}
      <div style={{
        display: "grid", gridTemplateColumns: gridCols, gap: 16,
        padding: "10px 4px", borderBottom: "1px solid var(--line)",
        fontSize: 10, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 500
      }}>
        {headers.map((h, i) => <div key={i}>{h}</div>)}
      </div>
      {/* Rows */}
      {rows.map((row, ri) => (
        <div key={ri} style={{
          display: "grid", gridTemplateColumns: gridCols, gap: 16, alignItems: "center",
          padding: "14px 4px", borderBottom: ri < rows.length - 1 ? "1px solid var(--line-soft)" : "none",
          fontSize: 13
        }}>
          {row.map((cell, ci) => <Cell key={ci} cell={cell} />)}
        </div>
      ))}
    </div>
  );
}

function Cell({ cell }) {
  if (cell && typeof cell === "object" && "progress" in cell) {
    const p = cell.progress;
    return (
      <div>
        <div className="bar" style={{ height: 6 }}>
          <div className="bar-fill" style={{ width: Math.min(p, 100) + "%", background: p >= 100 ? "var(--forest)" : "var(--accent-bright)" }} />
        </div>
        <div className="mono" style={{ fontSize: 10, color: "var(--ink-3)", marginTop: 4 }}>{p} %</div>
      </div>
    );
  }
  if (cell && typeof cell === "object" && "status" in cell) {
    return <StatusDot status={cell.status} />;
  }
  if (Array.isArray(cell)) {
    // Two-line cell — title + sub OR name + initials avatar
    const [main, sub] = cell;
    if (sub && sub.length <= 3) {
      // initials avatar
      return (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{
            width: 32, height: 32, borderRadius: 50, background: "var(--ink)",
            color: "var(--paper)", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 500
          }}>{sub}</span>
          <span style={{ fontWeight: 500 }}>{main}</span>
        </div>
      );
    }
    return (
      <div style={{ minWidth: 0 }}>
        <div style={{ fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{main}</div>
        <div className="mono" style={{ fontSize: 11, color: "var(--ink-4)", marginTop: 2 }}>/c/{sub}</div>
      </div>
    );
  }
  if (typeof cell === "string" && /F$/.test(cell.trim())) {
    return <span className="mono" style={{ fontSize: 13 }}>{cell}</span>;
  }
  if (typeof cell === "string" && /^\d{2,} \d{3}/.test(cell)) {
    return <span className="mono" style={{ fontSize: 12, color: "var(--ink-3)" }}>{cell}</span>;
  }
  return <span style={{ color: "var(--ink-2)" }}>{cell}</span>;
}

const selectStyle = {
  height: 38, padding: "0 14px", borderRadius: 999,
  background: "var(--cream)", border: "1px solid var(--line)",
  color: "var(--ink)", fontSize: 13, fontWeight: 500,
  outline: "none"
};

const inputAd = {
  width: "100%", border: "none", outline: "none", background: "transparent",
  padding: "10px 0", fontSize: 16, color: "var(--ink)"
};

function FieldAd({ label, trailing, children }) {
  return (
    <div style={{ borderBottom: "1px solid var(--line)", paddingBottom: 4 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span className="eyebrow">{label}</span>
        {trailing}
      </div>
      {children}
    </div>
  );
}

Object.assign(window, { AdminDashboard, AdminCotisations, AdminUsers, AdminLogin });
