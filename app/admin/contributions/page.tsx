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
  const map: Record<string, [string, string]> = {
    paid:    ["var(--forest)", "Payé"],
    pending: ["var(--warn)", "En attente"],
    failed:  ["var(--ink-3)", "Échoué"],
  };
  const [c, l] = map[status] ?? ["var(--ink-3)", status];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--ink-2)" }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: c }} />
      {l}
    </span>
  );
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

function PaymentMethodBadge({ method }: { method: string }) {
  const m = (method || "").toLowerCase();
  let bg = "var(--paper-2)";
  let text = "var(--ink-2)";
  let label = method || "Inconnu";

  if (m.includes("wave")) {
    bg = "rgba(26,117,87,0.08)";
    text = "var(--forest)";
    label = "Wave";
  } else if (m.includes("orange") || m.includes("om")) {
    bg = "rgba(244,184,41,0.15)";
    text = "var(--ink)";
    label = "Orange Money";
  } else if (m.includes("mtn")) {
    bg = "rgba(30,91,180,0.08)";
    text = "var(--ink)";
    label = "MTN MoMo";
  } else if (m.includes("card") || m.includes("visa")) {
    bg = "rgba(20,50,104,0.08)";
    text = "var(--ink)";
    label = "Carte Bancaire";
  }

  return (
    <span style={{
      fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.03em",
      padding: "4px 8px", borderRadius: 999, background: bg, color: text
    }}>
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
    <div>
      {/* Page Header */}
      <header style={{
        padding: "28px 40px 20px", display: "flex", justifyContent: "space-between",
        alignItems: "flex-end", gap: 24, borderBottom: "1px solid var(--line)",
        background: "var(--cream)"
      }} className="flex-col sm:flex-row">
        <div>
          <div style={{ fontSize: 11, color: "var(--ink-3)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>
            Admin · Contributions
          </div>
          <h1 className="serif text-[#143268]" style={{ fontSize: 36, letterSpacing: "-0.025em", margin: 0, lineHeight: 1.05, fontWeight: 500 }}>
            Paiements
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

        {/* Summary strip */}
        {data && !loading && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Total", value: data.total.toLocaleString("fr-FR"), unit: "transactions" },
              { label: "Payés", value: data.contributions.filter(c => c.status === "paid").length, unit: "confirmées" },
              { label: "Montant page", value: `${fmtAmount(totalPaid)} FCFA`, unit: "sur cette page" },
            ].map(item => (
              <div key={item.label} style={{
                background: "var(--cream)", border: "1px solid var(--line)", borderRadius: 16,
                padding: "20px 24px", display: "flex", flexDirection: "column", justifyContent: "space-between"
              }}>
                <div style={{ fontSize: 11, color: "var(--ink-3)", letterSpacing: "0.05em", textTransform: "uppercase" }}>{item.label}</div>
                <div className="mono font-semibold text-[#143268] mt-2" style={{ fontSize: 24, letterSpacing: "-0.02em" }}>{item.value}</div>
                {item.unit && <div style={{ fontSize: 11, color: "var(--ink-4)", marginTop: 4 }}>{item.unit}</div>}
              </div>
            ))}
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Rechercher par nom, téléphone, cotisation…"
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

        {/* Panel Wrap */}
        <div style={{
          background: "var(--cream)", border: "1px solid var(--line)", borderRadius: 16,
          overflow: "hidden"
        }}>
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <RefreshCw className="w-6 h-6 text-[#DA9810] animate-spin" />
            </div>
          ) : !data?.contributions.length ? (
            <div className="flex flex-col items-center justify-center py-20 text-[#6B7A95]">
              <CreditCard className="w-10 h-10 mb-3 opacity-40" />
              <p className="text-sm font-medium">Aucun paiement trouvé</p>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse" style={{ fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--line)", background: "var(--paper)", fontSize: 10, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 500 }}>
                      <th style={{ padding: "12px 16px" }}>Contributeur</th>
                      <th style={{ padding: "12px 16px" }}>Cotisation</th>
                      <th style={{ padding: "12px 16px" }} className="text-right">Montant</th>
                      <th style={{ padding: "12px 16px" }}>Moyen</th>
                      <th style={{ padding: "12px 16px" }}>Statut</th>
                      <th style={{ padding: "12px 16px" }}>Référence</th>
                      <th style={{ padding: "12px 16px" }}>Date</th>
                    </tr>
                  </thead>
                  <tbody style={{ color: "var(--ink-2)" }}>
                    {data.contributions.map((c, idx) => (
                      <tr
                        key={c.id}
                        style={{ borderBottom: idx < data.contributions.length - 1 ? "1px solid var(--line-soft)" : "none" }}
                        className="hover:bg-slate-50/50 transition-colors group"
                      >
                        <td style={{ padding: "14px 16px" }}>
                          <div className="flex items-center gap-3">
                            <InitialsAvatar name={c.contributor_name || "Anonyme"} />
                            <div className="flex flex-col">
                              <span style={{ fontWeight: 500, color: "var(--ink)" }}>{c.contributor_name || "Anonyme"}</span>
                              <span className="mono" style={{ fontSize: 11, color: "var(--ink-4)", marginTop: 2 }}>{c.contributor_phone || "—"}</span>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <div className="flex items-center gap-1.5">
                            <span style={{ color: "var(--ink)", fontWeight: 500 }} className="line-clamp-1">{c.cotisation_title}</span>
                            {c.cotisation_slug && (
                              <a
                                href={`https://mastercota.com/c/${c.cotisation_slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-[#1E5BB4] shrink-0"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        </td>
                        <td style={{ padding: "14px 16px" }} className="text-right mono font-medium">
                          <span style={{ color: "var(--ink)" }}>{fmtAmount(c.amount)}</span>
                          <span style={{ fontSize: 10, color: "var(--ink-4)", marginLeft: 4 }}>FCFA</span>
                        </td>
                        <td style={{ padding: "14px 16px" }}><PaymentMethodBadge method={c.payment_method} /></td>
                        <td style={{ padding: "14px 16px" }}><StatusBadge status={c.status} /></td>
                        <td style={{ padding: "14px 16px" }}>
                          {c.paystack_reference ? (
                            <span className="mono" style={{ fontSize: 11, color: "var(--ink-3)", background: "var(--paper-2)", padding: "2px 6px", borderRadius: 4 }}>
                              {c.paystack_reference.slice(0, 16)}{c.paystack_reference.length > 16 ? "…" : ""}
                            </span>
                          ) : (
                            <span style={{ color: "var(--ink-4)" }}>—</span>
                          )}
                        </td>
                        <td style={{ padding: "14px 16px" }} className="mono text-slate-400 text-xs whitespace-nowrap">{fmtDate(c.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden divide-y divide-[#F1F5F9]" style={{ background: "var(--cream)" }}>
                {data.contributions.map(c => (
                  <div key={c.id} className="p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <InitialsAvatar name={c.contributor_name || "Anonyme"} />
                      <div className="flex-1 min-w-0">
                        <p style={{ fontWeight: 600, color: "var(--ink)" }} className="text-sm truncate">{c.contributor_name || "Anonyme"}</p>
                        <p style={{ color: "var(--ink-4)" }} className="text-xs">{c.contributor_phone}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="font-bold text-sm" style={{ color: "var(--ink)" }}>{fmtAmount(c.amount)} F</span>
                        <StatusBadge status={c.status} />
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span style={{ color: "var(--ink-3)" }} className="line-clamp-1 max-w-[60%]">{c.cotisation_title}</span>
                      <PaymentMethodBadge method={c.payment_method} />
                    </div>
                    <div className="flex justify-between text-xs text-slate-400 pt-1 border-t border-slate-100">
                      <span>Réf: {c.paystack_reference ? c.paystack_reference.slice(0, 10) + "..." : "—"}</span>
                      <span>{fmtDate(c.created_at)}</span>
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
