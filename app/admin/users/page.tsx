"use client";

import { useEffect, useState, useCallback } from "react";
import { adminFetch } from "@/lib/admin-api";
import {
  Search, User,
  Wallet, TrendingUp, Calendar, RefreshCw,
} from "lucide-react";
import { Pagination } from "@/app/admin/_components/Pagination";

interface UserRow {
  id: string;
  phone: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  cotisations_count: number;
  active_cotisations: number;
  total_collected: number;
}

interface UserSummary {
  total: number;
  thisMonth: number;
}

interface ApiResponse {
  users: UserRow[];
  total: number;
  page: number;
  limit: number;
}

function fmtAmount(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + " M";
  if (n >= 1_000) return (n / 1_000).toFixed(0) + " k";
  return n.toLocaleString("fr-FR");
}

function relDate(iso: string | null) {
  if (!iso) return "—";
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "à l'instant";
  if (m < 60) return `il y a ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `il y a ${h} h`;
  const d = Math.floor(h / 24);
  if (d < 30) return `il y a ${d} j`;
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

function fmtDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

function getInitials(name: string) {
  if (!name) return "??";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function InitialsAvatar({ name }: { name: string }) {
  const ini = getInitials(name);
  const colors = [
    { bg: "rgba(20,50,104,0.08)", text: "var(--ink)" },
    { bg: "rgba(244,184,41,0.15)", text: "var(--ink)" },
    { bg: "rgba(26,117,87,0.08)", text: "var(--forest)" },
    { bg: "rgba(235,94,85,0.08)", text: "var(--warn)" }
  ];
  const charCode = ini.charCodeAt(0) + (ini.charCodeAt(1) || 0);
  const color = colors[charCode % colors.length];

  return (
    <div style={{
      width: 32, height: 32, borderRadius: "50%",
      background: color.bg, color: color.text,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 12, fontWeight: 600, flexShrink: 0
    }}>
      {ini}
    </div>
  );
}

function StatusDot({ status }: { status: "verified" | "pending" }) {
  const map = {
    verified: ["var(--forest)", "Vérifié"],
    pending:  ["var(--warn)",   "En attente"],
  } as const;
  const [c, l] = map[status];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--ink-2)" }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: c }} />
      {l}
    </span>
  );
}

export default function UsersPage() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [summary, setSummary] = useState<UserSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 20;

  useEffect(() => {
    const t = setTimeout(() => { setDebouncedSearch(search); setPage(1); }, 300);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (debouncedSearch) params.set("search", debouncedSearch);
      const [res, statsRes] = await Promise.all([
        adminFetch<ApiResponse>(`/api/admin/users?${params}`),
        summary === null ? adminFetch<{ users: UserSummary }>("/api/admin/stats") : Promise.resolve(null),
      ]);
      setData(res);
      if (statsRes) setSummary(statsRes.users);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, debouncedSearch]);

  useEffect(() => { load(); }, [load]);

  const totalPages = data ? Math.ceil(data.total / limit) : 1;

  return (
    <div>
      {/* Page Header */}
      <header style={{
        padding: "28px 40px 20px", display: "flex", justifyContent: "space-between",
        alignItems: "flex-end", gap: 24, borderBottom: "1px solid var(--line)",
        background: "var(--cream)"
      }} className="flex-col sm:flex-row">
        <div>
          <div style={{ fontSize: 11, color: "var(--ink-3)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>
            Admin · Utilisateurs
          </div>
          <h1 className="serif text-[#143268]" style={{ fontSize: 36, letterSpacing: "-0.025em", margin: 0, lineHeight: 1.05, fontWeight: 500 }}>
            Utilisateurs
          </h1>
        </div>
        <div className="flex gap-2.5 items-center shrink-0 w-full sm:w-auto justify-end">
          <button
            onClick={load}
            disabled={loading}
            style={{ height: 38, padding: "0 14px", borderRadius: 999, border: "1px solid var(--line)", background: "var(--cream)" }}
            className="flex items-center gap-2 hover:bg-slate-50 transition-colors text-xs font-semibold text-[#143268] disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Actualiser
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div style={{ padding: "32px 40px 60px" }} className="space-y-6">

        {/* Stats strip */}
        <div style={{
          background: "var(--cream)", border: "1px solid var(--line)", borderRadius: 16,
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)"
        }}>
          {[
            { n: summary?.total ?? data?.total ?? "—", l: "Total comptes", s: null },
            { n: summary?.thisMonth ?? "—", l: "Nouveaux ce mois", s: null },
            {
              n: data ? data.users.filter(u => u.cotisations_count > 0).length + (data.total > data.users.length ? "+" : "") : "—",
              l: "Avec cotisation",
              s: null
            },
            {
              n: data ? data.users.filter(u => u.active_cotisations > 0).length + (data.total > data.users.length ? "+" : "") : "—",
              l: "Cagnottes actives",
              s: null
            },
          ].map((item, i) => (
            <div key={i} style={{
              padding: "18px 22px",
              borderRight: i < 3 ? "1px solid var(--line)" : "none"
            }}>
              <div className="num" style={{ fontSize: 24, letterSpacing: "-0.02em" }}>{item.n}</div>
              <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 4 }}>{item.l}</div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Rechercher par téléphone, email ou nom…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              height: 38, padding: "0 14px 0 40px", borderRadius: 999,
              background: "var(--cream)", border: "1px solid var(--line)",
              color: "var(--ink)", fontSize: 13, outline: "none"
            }}
            className="w-full focus:border-slate-400 transition-colors"
          />
        </div>

        {/* Panel Wrap */}
        <div style={{
          background: "var(--cream)", border: "1px solid var(--line)", borderRadius: 16,
          overflow: "hidden"
        }}>
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <RefreshCw className="w-6 h-6 text-[#DA9810] animate-spin" />
            </div>
          ) : !data?.users.length ? (
            <div className="flex flex-col items-center justify-center py-20 text-[#6B7A95]">
              <User className="w-10 h-10 mb-3 opacity-40" />
              <p className="text-sm font-medium">Aucun utilisateur trouvé</p>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse" style={{ fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--line)", background: "var(--paper)", fontSize: 10, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 500 }}>
                      <th style={{ padding: "12px 16px" }}>Utilisateur</th>
                      <th style={{ padding: "12px 16px" }}>Téléphone / Email</th>
                      <th style={{ padding: "12px 16px" }} className="text-right">Cotisations</th>
                      <th style={{ padding: "12px 16px" }} className="text-right">Total reçu</th>
                      <th style={{ padding: "12px 16px" }}>Statut</th>
                      <th style={{ padding: "12px 16px" }}>Inscrit</th>
                    </tr>
                  </thead>
                  <tbody style={{ color: "var(--ink-2)" }}>
                    {data.users.map((u, idx) => {
                      const name = u.phone || u.email || "Utilisateur";
                      const status: "verified" | "pending" = u.last_sign_in_at ? "verified" : "pending";
                      return (
                        <tr
                          key={u.id}
                          style={{ borderBottom: idx < data.users.length - 1 ? "1px solid var(--line-soft)" : "none" }}
                          className="hover:bg-slate-50/50 transition-colors"
                        >
                          <td style={{ padding: "14px 16px" }}>
                            <div className="flex items-center gap-3">
                              <InitialsAvatar name={name} />
                              <span style={{ fontWeight: 500, color: "var(--ink)" }}>{name}</span>
                            </div>
                          </td>
                          <td style={{ padding: "14px 16px" }}>
                            <span className="mono" style={{ fontSize: 12, color: "var(--ink-3)" }}>
                              {u.phone ? u.phone.replace(/(\d{3})\d+(\d{2})$/, "$1···$2") : u.email || "—"}
                            </span>
                          </td>
                          <td style={{ padding: "14px 16px" }} className="text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <span className="font-semibold text-slate-700">{u.cotisations_count}</span>
                              {u.active_cotisations > 0 && (
                                <span style={{
                                  fontSize: 10, fontWeight: 600,
                                  padding: "2px 6px", borderRadius: 999,
                                  background: "rgba(26,117,87,0.08)", color: "var(--forest)"
                                }}>
                                  {u.active_cotisations} actives
                                </span>
                              )}
                            </div>
                          </td>
                          <td style={{ padding: "14px 16px" }} className="text-right mono font-medium">
                            {u.total_collected > 0 ? (
                              <>
                                <span style={{ color: "var(--ink)" }}>{fmtAmount(u.total_collected)}</span>
                                <span style={{ fontSize: 10, color: "var(--ink-4)", marginLeft: 4 }}>FCFA</span>
                              </>
                            ) : (
                              <span style={{ color: "var(--ink-4)" }}>—</span>
                            )}
                          </td>
                          <td style={{ padding: "14px 16px" }}><StatusDot status={status} /></td>
                          <td style={{ padding: "14px 16px" }} className="mono text-slate-400 text-xs">{fmtDate(u.created_at)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden divide-y divide-[#F1F5F9]" style={{ background: "var(--cream)" }}>
                {data.users.map(u => {
                  const name = u.phone || u.email || "Utilisateur";
                  return (
                  <div key={u.id} className="p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <InitialsAvatar name={name} />
                      <div className="flex-1 min-w-0">
                        <p style={{ fontWeight: 600, color: "var(--ink)" }} className="text-sm truncate">{name}</p>
                        <p style={{ color: "var(--ink-4)" }} className="text-xs truncate">{u.phone || u.email}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs pt-1">
                      <div className="flex flex-col gap-0.5">
                        <span style={{ color: "var(--ink-4)" }} className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Inscrit</span>
                        <span className="font-semibold text-slate-700">{fmtDate(u.created_at)}</span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span style={{ color: "var(--ink-4)" }} className="flex items-center gap-1"><Wallet className="w-3 h-3" /> Cotis.</span>
                        <span className="font-semibold text-slate-700">{u.cotisations_count}</span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span style={{ color: "var(--ink-4)" }} className="flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Collecté</span>
                        <span className="font-semibold text-slate-700">{u.total_collected > 0 ? `${fmtAmount(u.total_collected)} F` : "—"}</span>
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>
            </>
          )}

          <Pagination page={page} totalPages={totalPages} total={data?.total ?? 0} limit={limit} onChange={setPage} />
        </div>

      </div>
    </div>
  );
}
