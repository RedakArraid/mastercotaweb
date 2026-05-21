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
  display: string;
  created_at: string;
  last_sign_in_at: string | null;
  cotisations_count: number;
  active_cotisations: number;
  total_collected: number;
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

export default function UsersPage() {
  const [data, setData] = useState<ApiResponse | null>(null);
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
      const res = await adminFetch<ApiResponse>(`/api/admin/users?${params}`);
      setData(res);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => { load(); }, [load]);

  const totalPages = data ? Math.ceil(data.total / limit) : 1;

  return (
    <div className="p-4 md:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1">
          <h1 className="text-xl font-bold text-[#0A1120]">Utilisateurs</h1>
          <p className="text-sm text-[#64748B] mt-0.5">
            {data ? `${data.total.toLocaleString("fr-FR")} inscrits` : "Chargement…"}
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

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
        <input
          type="text"
          placeholder="Rechercher par téléphone ou email…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-[#E2E8F0] rounded-xl text-[#0A1120] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF]/40"
        />
      </div>

      {/* Table card */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <RefreshCw className="w-6 h-6 text-[#1E40AF] animate-spin" />
          </div>
        ) : !data?.users.length ? (
          <div className="flex flex-col items-center justify-center py-16 text-[#94A3B8]">
            <User className="w-10 h-10 mb-3 opacity-40" />
            <p className="text-sm font-medium">Aucun utilisateur trouvé</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                    <th className="text-left px-4 py-3 font-semibold text-[#64748B] text-xs uppercase tracking-wide">Utilisateur</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#64748B] text-xs uppercase tracking-wide">Inscription</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#64748B] text-xs uppercase tracking-wide">Dernière connexion</th>
                    <th className="text-right px-4 py-3 font-semibold text-[#64748B] text-xs uppercase tracking-wide">Cotisations</th>
                    <th className="text-right px-4 py-3 font-semibold text-[#64748B] text-xs uppercase tracking-wide">Total collecté</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {data.users.map(u => (
                    <tr key={u.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#EFF6FF] flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-[#1E40AF]" />
                          </div>
                          <div>
                            <p className="font-semibold text-[#0A1120]">{u.display}</p>
                            {u.email && u.phone && (
                              <p className="text-xs text-[#94A3B8]">{u.email}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-[#475569]">{fmtDate(u.created_at)}</td>
                      <td className="px-4 py-3.5 text-[#475569]">{relDate(u.last_sign_in_at)}</td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <span className="font-semibold text-[#0A1120]">{u.cotisations_count}</span>
                          {u.active_cotisations > 0 && (
                            <span className="text-xs px-1.5 py-0.5 rounded-full bg-green-50 text-green-700 font-medium">
                              {u.active_cotisations} actives
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-right font-semibold text-[#0A1120]">
                        {u.total_collected > 0 ? `${fmtAmount(u.total_collected)} FCFA` : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-[#F1F5F9]">
              {data.users.map(u => (
                <div key={u.id} className="px-4 py-3.5 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#EFF6FF] flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-[#1E40AF]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#0A1120] truncate">{u.display}</p>
                      {u.email && u.phone && <p className="text-xs text-[#94A3B8] truncate">{u.email}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[#94A3B8] flex items-center gap-1"><Calendar className="w-3 h-3" /> Inscrit</span>
                      <span className="font-medium text-[#475569]">{fmtDate(u.created_at)}</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[#94A3B8] flex items-center gap-1"><Wallet className="w-3 h-3" /> Cotis.</span>
                      <span className="font-medium text-[#475569]">{u.cotisations_count}</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[#94A3B8] flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Collecté</span>
                      <span className="font-medium text-[#475569]">{u.total_collected > 0 ? `${fmtAmount(u.total_collected)} F` : "—"}</span>
                    </div>
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
