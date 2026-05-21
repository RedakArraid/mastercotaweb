"use client";

import { useEffect, useState, useCallback } from "react";
import { adminFetch } from "@/lib/admin-api";
import {
  Search, Wallet,
  RefreshCw, ExternalLink, Filter,
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

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    active:    { label: "Active",    cls: "bg-green-50  text-green-700  border-green-100" },
    completed: { label: "Complétée", cls: "bg-blue-50   text-blue-700   border-blue-100" },
    closed:    { label: "Fermée",    cls: "bg-slate-50  text-slate-500  border-slate-200" },
    draft:     { label: "Brouillon", cls: "bg-amber-50  text-amber-700  border-amber-100" },
  };
  const { label, cls } = map[status] ?? { label: status, cls: "bg-slate-50 text-slate-500 border-slate-200" };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${cls}`}>
      {label}
    </span>
  );
}

const STATUS_OPTIONS = [
  { value: "", label: "Tous" },
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
    <div className="p-4 md:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1">
          <h1 className="text-xl font-bold text-[#0A1120]">Cotisations</h1>
          <p className="text-sm text-[#64748B] mt-0.5">
            {data ? `${data.total.toLocaleString("fr-FR")} au total` : "Chargement…"}
          </p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#64748B] bg-white border border-[#E2E8F0] rounded-xl hover:bg-[#F8FAFC] transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Actualiser
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Rechercher par titre, slug ou propriétaire…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-[#E2E8F0] rounded-xl text-[#0A1120] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF]/40"
          />
        </div>
        <div className="flex items-center gap-2 bg-white border border-[#E2E8F0] rounded-xl px-3 py-2.5 text-sm shrink-0">
          <Filter className="w-3.5 h-3.5 text-[#94A3B8]" />
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            className="bg-transparent text-[#0A1120] focus:outline-none text-sm"
          >
            {STATUS_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <RefreshCw className="w-6 h-6 text-[#1E40AF] animate-spin" />
          </div>
        ) : !data?.cotisations.length ? (
          <div className="flex flex-col items-center justify-center py-16 text-[#94A3B8]">
            <Wallet className="w-10 h-10 mb-3 opacity-40" />
            <p className="text-sm font-medium">Aucune cotisation trouvée</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                    <th className="text-left px-4 py-3 font-semibold text-[#64748B] text-xs uppercase tracking-wide">Cotisation</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#64748B] text-xs uppercase tracking-wide">Propriétaire</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#64748B] text-xs uppercase tracking-wide">Statut</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#64748B] text-xs uppercase tracking-wide min-w-[180px]">Progression</th>
                    <th className="text-right px-4 py-3 font-semibold text-[#64748B] text-xs uppercase tracking-wide">Paiements</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#64748B] text-xs uppercase tracking-wide">Échéance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {data.cotisations.map(c => (
                    <tr key={c.id} className="hover:bg-[#F8FAFC] transition-colors group">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <div>
                            <p className="font-semibold text-[#0A1120] leading-snug line-clamp-1">{c.title}</p>
                            <p className="text-xs text-[#94A3B8]">{c.slug}</p>
                          </div>
                          <a
                            href={`https://mastercota.com/c/${c.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-[#94A3B8] hover:text-[#1E40AF]"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-[#475569]">{c.owner_phone}</td>
                      <td className="px-4 py-3.5"><StatusBadge status={c.status} /></td>
                      <td className="px-4 py-3.5">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-medium text-[#0A1120]">{fmtAmount(c.current_amount)} FCFA</span>
                            <span className="text-[#94A3B8]">{c.progress}%</span>
                          </div>
                          <div className="h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-[#1E40AF] to-[#3B82F6] transition-all"
                              style={{ width: `${Math.min(c.progress, 100)}%` }}
                            />
                          </div>
                          <p className="text-xs text-[#94A3B8]">sur {fmtAmount(c.target_amount)} FCFA</p>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex flex-col items-end gap-0.5">
                          <span className="font-semibold text-[#0A1120]">{c.contributions_paid} payés</span>
                          {c.contributions_pending > 0 && (
                            <span className="text-xs text-amber-600">{c.contributions_pending} en attente</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-[#475569]">{fmtDate(c.deadline)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-[#F1F5F9]">
              {data.cotisations.map(c => (
                <div key={c.id} className="px-4 py-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#0A1120] leading-snug line-clamp-2">{c.title}</p>
                      <p className="text-xs text-[#94A3B8] mt-0.5">{c.owner_phone}</p>
                    </div>
                    <StatusBadge status={c.status} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-[#0A1120]">{fmtAmount(c.current_amount)} FCFA</span>
                      <span className="text-[#94A3B8]">{c.progress}% · objectif {fmtAmount(c.target_amount)} F</span>
                    </div>
                    <div className="h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#1E40AF] to-[#3B82F6]"
                        style={{ width: `${Math.min(c.progress, 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#64748B]">
                    <span>{c.contributions_paid} paiements</span>
                    <span>Échéance : {fmtDate(c.deadline)}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <Pagination page={page} totalPages={totalPages} total={data?.total ?? 0} limit={limit} onChange={setPage} />
      </div>
    </div>
  );
}
