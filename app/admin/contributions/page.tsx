"use client";

import { useEffect, useState, useCallback } from "react";
import { adminFetch } from "@/lib/admin-api";
import {
  Search, CreditCard,
  RefreshCw, ExternalLink, Filter, Phone,
} from "lucide-react";
import { Pagination } from "@/app/admin/_components/Pagination";

interface ContributionRow {
  id: string;
  cotisation_id: string;
  cotisation_title: string;
  cotisation_slug: string;
  contributor_name: string;
  contributor_phone: string;
  amount: number;
  status: string;
  paystack_reference: string;
  payment_method: string;
  created_at: string;
}

interface ApiResponse {
  contributions: ContributionRow[];
  total: number;
  page: number;
  limit: number;
}

function fmtAmount(n: number) {
  return n.toLocaleString("fr-FR");
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string; dot: string }> = {
    paid:    { label: "Payé",       cls: "bg-green-50 text-green-700 border-green-100",  dot: "bg-green-500" },
    pending: { label: "En attente", cls: "bg-amber-50 text-amber-700 border-amber-100",  dot: "bg-amber-400" },
    failed:  { label: "Échoué",     cls: "bg-red-50   text-red-700   border-red-100",    dot: "bg-red-500"   },
  };
  const { label, cls, dot } = map[status] ?? { label: status, cls: "bg-slate-50 text-slate-500 border-slate-200", dot: "bg-slate-400" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}

const STATUS_OPTIONS = [
  { value: "", label: "Tous les statuts" },
  { value: "paid", label: "Payés" },
  { value: "pending", label: "En attente" },
  { value: "failed", label: "Échoués" },
];

export default function ContributionsPage() {
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
      const res = await adminFetch<ApiResponse>(`/api/admin/contributions?${params}`);
      setData(res);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, statusFilter]);

  useEffect(() => { load(); }, [load]);

  const totalPages = data ? Math.ceil(data.total / limit) : 1;
  const totalPaid = data?.contributions.filter(c => c.status === "paid").reduce((s, c) => s + c.amount, 0) ?? 0;

  return (
    <div className="p-4 md:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1">
          <h1 className="text-xl font-bold text-[#0A1120]">Paiements</h1>
          <p className="text-sm text-[#64748B] mt-0.5">
            {data ? `${data.total.toLocaleString("fr-FR")} transactions` : "Chargement…"}
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

      {/* Summary strip */}
      {data && !loading && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Total", value: data.total, unit: "transactions" },
            { label: "Payés", value: data.contributions.filter(c => c.status === "paid").length, unit: "confirmés" },
            { label: "Montant page", value: `${fmtAmount(totalPaid)} FCFA`, unit: "" },
          ].map(item => (
            <div key={item.label} className="bg-white border border-[#E2E8F0] rounded-xl px-3 py-2.5 shadow-sm">
              <p className="text-xs text-[#94A3B8]">{item.label}</p>
              <p className="text-base font-bold text-[#0A1120] leading-tight">{item.value}</p>
              {item.unit && <p className="text-xs text-[#64748B]">{item.unit}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Rechercher par nom, téléphone, cotisation…"
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
        ) : !data?.contributions.length ? (
          <div className="flex flex-col items-center justify-center py-16 text-[#94A3B8]">
            <CreditCard className="w-10 h-10 mb-3 opacity-40" />
            <p className="text-sm font-medium">Aucun paiement trouvé</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                    <th className="text-left px-4 py-3 font-semibold text-[#64748B] text-xs uppercase tracking-wide">Contributeur</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#64748B] text-xs uppercase tracking-wide">Cotisation</th>
                    <th className="text-right px-4 py-3 font-semibold text-[#64748B] text-xs uppercase tracking-wide">Montant</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#64748B] text-xs uppercase tracking-wide">Statut</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#64748B] text-xs uppercase tracking-wide">Référence</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#64748B] text-xs uppercase tracking-wide">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {data.contributions.map(c => (
                    <tr key={c.id} className="hover:bg-[#F8FAFC] transition-colors group">
                      <td className="px-4 py-3.5">
                        <p className="font-semibold text-[#0A1120]">{c.contributor_name || "—"}</p>
                        <p className="text-xs text-[#94A3B8] flex items-center gap-1">
                          <Phone className="w-2.5 h-2.5" />{c.contributor_phone || "—"}
                        </p>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[#0A1120] line-clamp-1">{c.cotisation_title}</span>
                          {c.cotisation_slug && (
                            <a
                              href={`https://mastercota.com/c/${c.cotisation_slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-[#94A3B8] hover:text-[#1E40AF] shrink-0"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <span className="font-semibold text-[#0A1120]">{fmtAmount(c.amount)}</span>
                        <span className="text-xs text-[#94A3B8] ml-1">FCFA</span>
                      </td>
                      <td className="px-4 py-3.5"><StatusBadge status={c.status} /></td>
                      <td className="px-4 py-3.5">
                        {c.paystack_reference ? (
                          <span className="font-mono text-xs text-[#64748B] bg-[#F8FAFC] px-1.5 py-0.5 rounded">
                            {c.paystack_reference.slice(0, 16)}{c.paystack_reference.length > 16 ? "…" : ""}
                          </span>
                        ) : (
                          <span className="text-[#94A3B8]">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-[#475569] text-xs whitespace-nowrap">{fmtDate(c.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-[#F1F5F9]">
              {data.contributions.map(c => (
                <div key={c.id} className="px-4 py-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#0A1120]">{c.contributor_name || "Anonyme"}</p>
                      <p className="text-xs text-[#94A3B8]">{c.contributor_phone}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="font-bold text-[#0A1120]">{fmtAmount(c.amount)} F</span>
                      <StatusBadge status={c.status} />
                    </div>
                  </div>
                  <p className="text-xs text-[#64748B] line-clamp-1">{c.cotisation_title}</p>
                  <p className="text-xs text-[#94A3B8]">{fmtDate(c.created_at)}</p>
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
