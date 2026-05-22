"use client";

import { useEffect, useState, useCallback } from "react";
import { adminFetch } from "@/lib/admin-api";
import {
  Search, Wallet, RefreshCw, ExternalLink, Filter, ChevronRight
} from "lucide-react";
import { Pagination } from "@/app/admin/_components/Pagination";

interface CotisationRow {
  id: string;
  slug: string;
  title: string;
  target_amount: number;
  current_amount: number;
  deadline: string | null;
  owner_phone: string;
  status: string;
  created_at: string;
  contributions_paid: number;
  contributions_pending: number;
  progress: number;
}

interface ApiResponse {
  cotisations: CotisationRow[];
  total: number;
  page: number;
  limit: number;
}

function fmtAmount(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + " M";
  if (n >= 1_000) return (n / 1_000).toFixed(0) + " k";
  return n.toLocaleString("fr-FR");
}

function fmtDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

function StatusDot({ status }: { status: string }) {
  const map: Record<string, [string, string]> = {
    active:    ["var(--accent-dark)", "Active"],
    completed: ["var(--forest)", "Atteinte"],
    closed:    ["var(--ink-3)", "Clôturée"],
    draft:     ["var(--warn)", "Brouillon"],
  };
  const [c, l] = map[status] ?? ["var(--ink-3)", status];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--ink-2)" }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: c }} />
      {l}
    </span>
  );
}

const STATUS_OPTIONS = [
  { value: "", label: "Tous les statuts" },
  { value: "active", label: "Actives" },
  { value: "completed", label: "Complétées" },
  { value: "closed", label: "Fermées" },
];

export default function CotisationsPage() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
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
      if (statusFilter) params.set("status", statusFilter);
      const res = await adminFetch<ApiResponse>(`/api/admin/cotisations?${params}`);
      setData(res);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, statusFilter]);

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
            Admin · Cotisations
          </div>
          <h1 className="serif text-[#143268]" style={{ fontSize: 36, letterSpacing: "-0.025em", margin: 0, lineHeight: 1.05, fontWeight: 500 }}>
            Cotisations
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

        {/* Filter Toolbar & Search */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Rechercher par titre, slug ou propriétaire…"
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

          <div className="flex items-center gap-2 shrink-0">
            <select
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
              style={{
                height: 38, padding: "0 28px 0 14px", borderRadius: 999,
                background: "var(--cream)", border: "1px solid var(--line)",
                color: "var(--ink)", fontSize: 13, fontWeight: 500,
                outline: "none", appearance: "none"
              }}
              className="cursor-pointer bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236B7A95%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_12px_center] bg-no-repeat"
            >
              {STATUS_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Dynamic status pill filters */}
        <div style={{ display: "flex", gap: 8 }} className="overflow-x-auto pb-1 no-scrollbar flex-wrap">
          {[
            { value: "", label: "Toutes", count: data?.total ?? 0 },
            { value: "active", label: "Actives", count: data?.cotisations.filter(c => c.status === "active").length ?? 0 },
            { value: "completed", label: "Atteintes", count: data?.cotisations.filter(c => c.status === "completed").length ?? 0 },
            { value: "closed", label: "Clôturées", count: data?.cotisations.filter(c => c.status === "closed").length ?? 0 },
          ].map(pill => {
            const active = statusFilter === pill.value;
            return (
              <button
                key={pill.label}
                onClick={() => { setStatusFilter(pill.value); setPage(1); }}
                style={{
                  padding: "8px 14px", borderRadius: 999, fontSize: 12, fontWeight: 500,
                  background: active ? "var(--ink)" : "var(--cream)",
                  color: active ? "var(--paper)" : "var(--ink-2)",
                  border: "1px solid " + (active ? "var(--ink)" : "var(--line)"),
                }}
                className="transition-colors hover:border-slate-400"
              >
                {pill.label} <span style={{ opacity: active ? 0.5 : 0.7, marginLeft: 4 }} className="mono">{pill.count > 0 ? pill.count : ""}</span>
              </button>
            );
          })}
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
          ) : !data?.cotisations.length ? (
            <div className="flex flex-col items-center justify-center py-20 text-[#6B7A95]">
              <Wallet className="w-10 h-10 mb-3 opacity-40" />
              <p className="text-sm font-medium">Aucune cotisation trouvée</p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse" style={{ fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--line)", background: "var(--paper)", fontSize: 10, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 500 }}>
                      <th style={{ padding: "12px 16px" }} className="w-8"><input type="checkbox" className="accent-[#DA9810]" /></th>
                      <th style={{ padding: "12px 16px" }}>Titre</th>
                      <th style={{ padding: "12px 16px" }}>Propriétaire</th>
                      <th style={{ padding: "12px 16px" }}>Collecté</th>
                      <th style={{ padding: "12px 16px" }}>Objectif</th>
                      <th style={{ padding: "12px 16px" }} className="w-[160px]">Progression</th>
                      <th style={{ padding: "12px 16px" }}>Statut</th>
                      <th style={{ padding: "12px 16px" }}>Date / Échéance</th>
                      <th style={{ padding: "12px 16px" }} className="w-10"></th>
                    </tr>
                  </thead>
                  <tbody style={{ color: "var(--ink-2)" }}>
                    {data.cotisations.map((c, idx) => (
                      <tr
                        key={c.id}
                        style={{ borderBottom: idx < data.cotisations.length - 1 ? "1px solid var(--line-soft)" : "none" }}
                        className="hover:bg-slate-50/50 transition-colors group"
                      >
                        <td style={{ padding: "14px 16px" }}><input type="checkbox" className="accent-[#DA9810]" /></td>
                        <td style={{ padding: "14px 16px" }}>
                          <div style={{ minWidth: 0 }} className="flex flex-col">
                            <span style={{ fontWeight: 500, color: "var(--ink)" }} className="line-clamp-1">{c.title}</span>
                            <span className="mono" style={{ fontSize: 11, color: "var(--ink-4)", marginTop: 2 }}>/c/{c.slug}</span>
                          </div>
                        </td>
                        <td style={{ padding: "14px 16px" }}>{c.owner_phone}</td>
                        <td style={{ padding: "14px 16px" }} className="mono font-medium">{fmtAmount(c.current_amount)} F</td>
                        <td style={{ padding: "14px 16px" }} className="mono text-slate-400">{fmtAmount(c.target_amount)} F</td>
                        <td style={{ padding: "14px 16px" }}>
                          <div>
                            <div className="bar" style={{ height: 6, background: "var(--paper-2)", borderRadius: 999, overflow: "hidden" }}>
                              <div
                                className="bar-fill"
                                style={{
                                  width: Math.min(c.progress, 100) + "%",
                                  height: "100%",
                                  background: c.progress >= 100 ? "var(--forest)" : "var(--accent-bright)",
                                  borderRadius: 999
                                }}
                              />
                            </div>
                            <div className="mono" style={{ fontSize: 10, color: "var(--ink-3)", marginTop: 4 }}>{c.progress} %</div>
                          </div>
                        </td>
                        <td style={{ padding: "14px 16px" }}><StatusDot status={c.status} /></td>
                        <td style={{ padding: "14px 16px" }} className="text-slate-400 text-xs">{fmtDate(c.deadline)}</td>
                        <td style={{ padding: "14px 16px" }} className="text-right">
                          <a
                            href={`https://mastercota.com/c/${c.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-[#1E5BB4]"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card List View */}
              <div className="md:hidden divide-y divide-[#F1F5F9]">
                {data.cotisations.map(c => (
                  <div key={c.id} className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <span className="font-semibold text-sm text-[#143268] block line-clamp-1">{c.title}</span>
                        <span className="text-xs text-slate-400 block mt-0.5">{c.owner_phone}</span>
                      </div>
                      <StatusDot status={c.status} />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-slate-700">{fmtAmount(c.current_amount)} F</span>
                        <span className="text-slate-400">{c.progress}% (Obj: {fmtAmount(c.target_amount)} F)</span>
                      </div>
                      <div className="bar" style={{ height: 6, background: "var(--paper-2)", borderRadius: 999, overflow: "hidden" }}>
                        <div
                          className="bar-fill"
                          style={{
                            width: Math.min(c.progress, 100) + "%",
                            height: "100%",
                            background: c.progress >= 100 ? "var(--forest)" : "var(--accent-bright)",
                            borderRadius: 999
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-slate-400 pt-1">
                      <span>{c.contributions_paid} contributions</span>
                      <span>Échéance: {fmtDate(c.deadline)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          <Pagination page={page} totalPages={totalPages} total={data?.total ?? 0} limit={limit} onChange={setPage} />
        </div>

      </div>
    </div>
  );
}

