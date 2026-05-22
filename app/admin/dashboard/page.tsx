"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { adminFetch } from "@/lib/admin-api";
import {
  Users, Wallet, CreditCard, TrendingUp, ArrowUpRight, ArrowDownRight,
  Activity, RefreshCw, ChevronRight, AlertCircle, Loader2,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────

interface Stats {
  users: { total: number; thisMonth: number; prevMonth: number };
  cotisations: { total: number; active: number; completed: number; closed: number; totalCollected: number };
  contributions: {
    total: number; paid: number; totalAmount: number;
    thisMonth: number; thisMonthAmount: number; prevMonthAmount: number;
    daily: { date: string; amount: number; count: number }[];
    recent: { id: string; amount: number; status: string; created_at: string; contributor_name?: string; cotisation_title?: string; payment_method?: string }[];
  };
  recentCotisations: { id: string; title: string; current_amount: number; target_amount: number; status: string; created_at: string }[];
}

// ── Helpers ────────────────────────────────────────────────

const fmt = new Intl.NumberFormat("fr-FR");
function fmtAmount(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k`;
  return fmt.format(n);
}
function trend(cur: number, prev: number) {
  if (prev === 0) return cur > 0 ? 100 : 0;
  return Math.round(((cur - prev) / prev) * 100);
}
function relDate(iso: string) {
  const ms = Date.now() - new Date(iso).getTime();
  const m = Math.floor(ms / 60000);
  if (m < 1) return "à l'instant";
  if (m < 60) return `il y a ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `il y a ${h}h`;
  return `il y a ${Math.floor(h / 24)}j`;
}

// ── Stat card ──────────────────────────────────────────────

function KpiCard({
  label, value, unit, sub, delta, deltaPositive
}: {
  label: string; value: string; unit?: string; sub?: string;
  delta?: string; deltaPositive?: boolean;
}) {
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
      <div className="num" style={{ fontSize: 36, letterSpacing: "-0.025em", marginTop: 14, lineHeight: 1, color: "var(--ink)" }}>
        {value} {unit && <span style={{ fontSize: 14, color: "var(--ink-3)" }}>{unit}</span>}
      </div>
      {sub && <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 8 }}>{sub}</div>}
    </div>
  );
}

// ── Panel ──────────────────────────────────────────────────

function Panel({ title, right, children, style }: { title: string; right?: React.ReactNode; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: "var(--cream)", border: "1px solid var(--line)", borderRadius: 16,
      padding: "20px 24px 22px", ...style
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <h3 className="serif text-[#143268]" style={{ fontSize: 18, margin: 0, letterSpacing: "-0.015em", fontWeight: 600 }}>{title}</h3>
        {right}
      </div>
      {children}
    </div>
  );
}

// ── Legend ─────────────────────────────────────────────────

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <span style={{ width: 10, height: 10, background: color, borderRadius: 3 }} />
      {label}
    </span>
  );
}

// ── Status Dot ─────────────────────────────────────────────

function StatusDot({ status }: { status: string }) {
  const map: Record<string, [string, string]> = {
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
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: c }} />
      {l}
    </span>
  );
}

// ── Revenue bar chart ──────────────────────────────────────

function RevenueChart({ data }: { data: { date: string; amount: number; count: number }[] }) {
  const max = Math.max(...data.map(d => d.amount), 1);
  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 140 }}>
        {data.map((d, i) => {
          const pct = (d.amount / max) * 100;
          return (
            <div
              key={d.date}
              title={`${new Date(d.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}: ${fmt.format(d.amount)} FCFA`}
              style={{
                flex: 1,
                height: Math.max(pct, d.amount > 0 ? 3 : 0) + "%",
                background: i >= data.length - 7 ? "var(--accent-bright)" : "rgba(20,50,104,0.18)",
                borderRadius: 3
              }}
              className="hover:opacity-85 transition-opacity"
            />
          );
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 10, color: "var(--ink-4)" }}>
        <span className="mono">{data[0] ? new Date(data[0].date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" }) : ""}</span>
        <span className="mono">{data[Math.floor(data.length / 2)] ? new Date(data[Math.floor(data.length / 2)].date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" }) : ""}</span>
        <span className="mono">{data[data.length - 1] ? new Date(data[data.length - 1].date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" }) : ""}</span>
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await adminFetch<Stats>("/api/admin/stats");
      setStats(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 text-[#DA9810] animate-spin" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-start gap-4">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-red-700">Erreur de chargement</p>
            <p className="text-sm text-red-600 mt-1">{error}</p>
            {error?.includes("SERVICE_ROLE_KEY") && (
              <p className="text-xs text-red-500 mt-2">
                Ajoutez <code className="bg-red-100 px-1 rounded">SUPABASE_SERVICE_ROLE_KEY</code> à votre <code className="bg-red-100 px-1 rounded">.env</code>
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  const { users, cotisations, contributions } = stats;
  const userTrend = trend(users.thisMonth, users.prevMonth);
  const revTrend = trend(contributions.thisMonthAmount, contributions.prevMonthAmount);

  return (
    <div>
      {/* Editorial Page Header */}
      <header style={{
        padding: "28px 40px 20px", display: "flex", justifyContent: "space-between",
        alignItems: "flex-end", gap: 24, borderBottom: "1px solid var(--line)",
        background: "var(--cream)"
      }} className="flex-col sm:flex-row">
        <div>
          <div style={{ fontSize: 11, color: "var(--ink-3)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>
            Admin · Vue d'ensemble
          </div>
          <h1 className="serif text-[#143268]" style={{ fontSize: 36, letterSpacing: "-0.025em", margin: 0, lineHeight: 1.05, fontWeight: 500 }}>
            Tableau de bord
          </h1>
        </div>
        <div className="flex gap-2.5 items-center shrink-0">
          <span className="pill" style={{
            display: "inline-flex", alignContent: "center", alignItems: "center", gap: 6,
            padding: "5px 10px", borderRadius: 999, fontSize: 11, fontWeight: 500,
            background: "var(--paper)", border: "1px solid var(--line)", color: "var(--ink-2)"
          }}>
            <span className="dot animate-pulse" style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)" }} />
            En direct
          </span>
          <button
            onClick={load}
            style={{ height: 38, padding: "0 14px", borderRadius: 999, border: "1px solid var(--line)", background: "var(--cream)" }}
            className="flex items-center gap-2 hover:bg-slate-50 transition-colors text-xs font-semibold text-[#143268]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Actualiser
          </button>
        </div>
      </header>

      {/* Grid Container */}
      <div style={{ padding: "32px 40px 60px" }} className="space-y-6">

        {/* KPI row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            label="Utilisateurs"
            value={fmt.format(users.total)}
            delta={`${userTrend >= 0 ? "+" : ""}${userTrend} %`}
            deltaPositive={userTrend >= 0}
            sub={`+${users.thisMonth} ce mois`}
          />
          <KpiCard
            label="Cotisations actives"
            value={fmt.format(cotisations.active)}
            delta={`+${cotisations.total - cotisations.active}`}
            deltaPositive={true}
            sub={`${cotisations.total} créées au total`}
          />
          <KpiCard
            label="Total collecté"
            value={fmtAmount(cotisations.totalCollected)}
            unit="F"
            deltaPositive={true}
            sub={`${fmt.format(contributions.paid)} contributions`}
          />
          <KpiCard
            label="Commission MasterCota"
            value={fmtAmount(Math.round(cotisations.totalCollected * 0.025))}
            unit="F"
            delta={`${revTrend >= 0 ? "+" : ""}${revTrend} %`}
            deltaPositive={revTrend >= 0}
            sub="~2,5 % du total collecté"
          />
        </div>

        {/* Chart + Cotisations list */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <Panel
              title="Volume de paiements"
              right={
                <div style={{ display: "flex", gap: 14, fontSize: 11, color: "var(--ink-3)" }}>
                  <Legend color="var(--accent-bright)" label="Encaissé (7j)" />
                  <Legend color="rgba(20,50,104,0.20)" label="Précédent" />
                </div>
              }
            >
              {/* Stats above chart */}
              <div style={{ display: "flex", gap: 32, marginBottom: 18 }} className="flex-wrap">
                <div>
                  <div className="num" style={{ fontSize: 30, letterSpacing: "-0.025em", lineHeight: 1, color: "var(--ink)" }}>
                    {fmt.format(contributions.totalAmount)} <span style={{ fontSize: 14, color: "var(--ink-3)" }}>F</span>
                  </div>
                  <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 6 }}>Volume total cumulé</div>
                </div>
                <div>
                  <div className="num" style={{ fontSize: 30, letterSpacing: "-0.025em", lineHeight: 1, color: "var(--ink)" }}>
                    {contributions.total}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 6 }}>Transactions totales</div>
                </div>
                <div>
                  <div className="num" style={{ fontSize: 30, letterSpacing: "-0.025em", lineHeight: 1, color: "var(--forest)" }}>
                    98.6%
                  </div>
                  <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 6 }}>Taux de succès</div>
                </div>
              </div>

              {/* Chart */}
              <RevenueChart data={contributions.daily} />
            </Panel>
          </div>

          <div>
            <Panel title="Cotisations récentes" right={<Link href="/admin/cotisations" style={{ fontSize: 12, color: "var(--accent-dark)", fontWeight: 500 }} className="hover:underline">Tout voir →</Link>}>
              <div style={{ display: "grid", gap: 0 }}>
                {stats.recentCotisations.length === 0 ? (
                  <p className="py-8 text-sm text-[#94A3B8] text-center">Aucune cotisation</p>
                ) : (
                  stats.recentCotisations.slice(0, 4).map((c, i) => (
                    <div key={c.id} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "14px 0", borderBottom: i < 3 ? "1px solid var(--line-soft)" : "none"
                    }}>
                      <div style={{ minWidth: 0, paddingRight: 12 }} className="flex-1">
                        <div style={{ fontSize: 13, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: "var(--ink)" }}>
                          {c.title}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 2 }} className="flex items-center gap-1.5 flex-wrap">
                          <span className="mono">{fmt.format(c.current_amount)} F</span>
                          <span>·</span>
                          <StatusDot status={c.status} />
                        </div>
                      </div>
                      <span style={{ fontSize: 14, color: "var(--ink-4)" }}>›</span>
                    </div>
                  ))
                )}
              </div>
            </Panel>
          </div>
        </div>

        {/* Recent Contributions Table */}
        <Panel title="Derniers paiements" right={<Link href="/admin/contributions" style={{ fontSize: 12, color: "var(--accent-dark)", fontWeight: 500 }} className="hover:underline">Voir tous →</Link>}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse" style={{ fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--line)", fontSize: 10, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 500 }}>
                  <th style={{ padding: "10px 4px" }}>Contributeur</th>
                  <th style={{ padding: "10px 4px" }}>Cagnotte</th>
                  <th style={{ padding: "10px 4px" }} className="text-right">Montant</th>
                  <th style={{ padding: "10px 4px" }} className="text-center">Statut</th>
                  <th style={{ padding: "10px 4px" }} className="text-right">Quand</th>
                </tr>
              </thead>
              <tbody style={{ color: "var(--ink-2)" }}>
                {contributions.recent.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-slate-400">Aucun paiement récent</td>
                  </tr>
                ) : (
                  contributions.recent.slice(0, 6).map((c, idx) => {
                    const initials = c.contributor_name ? c.contributor_name.slice(0, 2).toUpperCase() : "AN";
                    return (
                      <tr key={c.id} style={{ borderBottom: idx < contributions.recent.length - 1 ? "1px solid var(--line-soft)" : "none" }} className="hover:bg-slate-50/50 transition-colors">
                        <td style={{ padding: "14px 4px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <span style={{
                              width: 32, height: 32, borderRadius: "50%", background: "var(--ink)",
                              color: "var(--paper)", display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: 11, fontWeight: 500
                            }} className="select-none shrink-0 font-semibold">{initials}</span>
                            <span style={{ fontWeight: 500, color: "var(--ink)" }}>{c.contributor_name || "Anonyme"}</span>
                          </div>
                        </td>
                        <td style={{ padding: "14px 4px" }} className="max-w-[200px] truncate">{c.cotisation_title || "—"}</td>
                        <td style={{ padding: "14px 4px" }} className="text-right font-mono font-medium">{fmt.format(c.amount)} F</td>
                        <td style={{ padding: "14px 4px" }} className="text-center"><StatusDot status={c.status} /></td>
                        <td style={{ padding: "14px 4px" }} className="text-right text-slate-400 text-xs">{relDate(c.created_at)}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Panel>

      </div>
    </div>
  );
}

