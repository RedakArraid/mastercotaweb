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
    recent: { id: string; amount: number; status: string; created_at: string }[];
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
  if (m < 60) return `il y a ${m}min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `il y a ${h}h`;
  return `il y a ${Math.floor(h / 24)}j`;
}

// ── Stat card ──────────────────────────────────────────────

function StatCard({
  icon: Icon, label, value, sub, trendValue, iconBg, iconColor,
}: {
  icon: React.ElementType; label: string; value: string; sub?: string;
  trendValue?: number; iconBg: string; iconColor: string;
}) {
  const positive = (trendValue ?? 0) >= 0;
  return (
    <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        {trendValue !== undefined && (
          <span
            className={`flex items-center gap-0.5 text-xs font-bold px-2 py-1 rounded-full ${
              positive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
            }`}
          >
            {positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {Math.abs(trendValue)}%
          </span>
        )}
      </div>
      <p className="text-2xl font-extrabold text-[#0A1120] leading-tight">{value}</p>
      <p className="text-sm text-[#64748B] mt-0.5">{label}</p>
      {sub && <p className="text-xs text-[#94A3B8] mt-1.5">{sub}</p>}
    </div>
  );
}

// ── Revenue bar chart ──────────────────────────────────────

function RevenueChart({ data }: { data: { date: string; amount: number; count: number }[] }) {
  const max = Math.max(...data.map(d => d.amount), 1);
  return (
    <div className="flex items-end gap-0.5" style={{ height: 80 }}>
      {data.map((d, i) => {
        const pct = (d.amount / max) * 100;
        const isRecent = i >= data.length - 7;
        const hasValue = d.amount > 0;
        return (
          <div
            key={d.date}
            title={`${new Date(d.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}: ${fmt.format(d.amount)} FCFA (${d.count} pmt)`}
            className="flex-1 rounded-sm cursor-default transition-opacity hover:opacity-80"
            style={{
              height: `${Math.max(pct, hasValue ? 4 : 0)}%`,
              backgroundColor: isRecent ? "#1E40AF" : "#BFDBFE",
              minHeight: hasValue ? 3 : 0,
            }}
          />
        );
      })}
    </div>
  );
}

// ── Status badge ───────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const cfg: Record<string, { bg: string; text: string; label: string }> = {
    active: { bg: "bg-emerald-50", text: "text-emerald-700", label: "Actif" },
    completed: { bg: "bg-blue-50", text: "text-blue-700", label: "Complété" },
    closed: { bg: "bg-slate-100", text: "text-slate-500", label: "Fermé" },
    paid: { bg: "bg-emerald-50", text: "text-emerald-700", label: "Payé" },
    pending: { bg: "bg-amber-50", text: "text-amber-700", label: "En attente" },
    failed: { bg: "bg-red-50", text: "text-red-600", label: "Échoué" },
  };
  const s = cfg[status] ?? { bg: "bg-slate-100", text: "text-slate-500", label: status };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}>
      {s.label}
    </span>
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
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-7 h-7 text-[#1E40AF] animate-spin" />
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
    <div className="p-6 space-y-6 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-[#0A1120]">Tableau de bord</h1>
          <p className="text-sm text-[#64748B] mt-0.5">
            Vue d'ensemble de votre activité Mastercota
          </p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E2E8F0] text-[#64748B] rounded-xl text-sm font-medium hover:bg-[#F8FAFC] hover:text-[#0A1120] transition-all shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Actualiser
        </button>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Utilisateurs"
          value={fmt.format(users.total)}
          sub={`+${users.thisMonth} ce mois`}
          trendValue={userTrend}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />
        <StatCard
          icon={Wallet}
          label="Cotisations"
          value={fmt.format(cotisations.total)}
          sub={`${cotisations.active} actives`}
          iconBg="bg-violet-50"
          iconColor="text-violet-600"
        />
        <StatCard
          icon={CreditCard}
          label="Total collecté"
          value={`${fmtAmount(cotisations.totalCollected)} ₣`}
          sub={`${fmt.format(contributions.paid)} paiements`}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        <StatCard
          icon={TrendingUp}
          label="Ce mois"
          value={`${fmtAmount(contributions.thisMonthAmount)} ₣`}
          sub={`${contributions.thisMonth} contributions`}
          trendValue={revTrend}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
        />
      </div>

      {/* Revenue chart */}
      <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-bold text-[#0A1120] text-sm">Revenus — 30 derniers jours</h2>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Total paiements Paystack validés (FCFA)
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-[#94A3B8]">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#1E40AF] inline-block" />
              7 derniers jours
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#BFDBFE] inline-block" />
              Précédent
            </span>
          </div>
        </div>
        <RevenueChart data={contributions.daily} />
        <div className="flex justify-between text-[10px] text-[#CBD5E1] mt-2">
          <span>{new Date(contributions.daily[0]?.date ?? "").toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}</span>
          <span>{new Date(contributions.daily[contributions.daily.length - 1]?.date ?? "").toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}</span>
        </div>
      </div>

      {/* Cotisations status pills */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Actives", value: cotisations.active, color: "bg-emerald-500" },
          { label: "Complétées", value: cotisations.completed, color: "bg-blue-500" },
          { label: "Fermées", value: cotisations.closed, color: "bg-slate-400" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-sm flex items-center gap-3">
            <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${color}`} />
            <div>
              <p className="text-lg font-extrabold text-[#0A1120] leading-tight">{value}</p>
              <p className="text-xs text-[#64748B]">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom row: recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent contributions */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#F1F5F9]">
            <div className="flex items-center gap-2.5">
              <Activity className="w-4 h-4 text-[#1E40AF]" />
              <h2 className="font-bold text-[#0A1120] text-sm">Derniers paiements</h2>
            </div>
            <Link href="/admin/contributions" className="flex items-center gap-1 text-xs text-[#1E40AF] font-semibold hover:underline">
              Voir tout <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-[#F1F5F9]">
            {contributions.recent.length === 0 ? (
              <p className="px-5 py-8 text-sm text-[#94A3B8] text-center">Aucun paiement</p>
            ) : (
              contributions.recent.map((c) => (
                <div key={c.id} className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#F0F4F8] flex items-center justify-center flex-shrink-0">
                      <CreditCard className="w-3.5 h-3.5 text-[#64748B]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#0A1120]">
                        {fmt.format(c.amount)} <span className="text-[#94A3B8] font-normal text-xs">FCFA</span>
                      </p>
                      <p className="text-xs text-[#94A3B8]">{relDate(c.created_at)}</p>
                    </div>
                  </div>
                  <StatusBadge status={c.status} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent cotisations */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#F1F5F9]">
            <div className="flex items-center gap-2.5">
              <Wallet className="w-4 h-4 text-violet-600" />
              <h2 className="font-bold text-[#0A1120] text-sm">Cotisations récentes</h2>
            </div>
            <Link href="/admin/cotisations" className="flex items-center gap-1 text-xs text-[#1E40AF] font-semibold hover:underline">
              Voir tout <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-[#F1F5F9]">
            {stats.recentCotisations.length === 0 ? (
              <p className="px-5 py-8 text-sm text-[#94A3B8] text-center">Aucune cotisation</p>
            ) : (
              stats.recentCotisations.map((c) => {
                const pct = c.target_amount > 0
                  ? Math.round((c.current_amount / c.target_amount) * 100)
                  : 0;
                return (
                  <div key={c.id} className="px-5 py-3 space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-[#0A1120] leading-snug flex-1 truncate">
                        {c.title}
                      </p>
                      <StatusBadge status={c.status} />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#1E40AF] rounded-full transition-all"
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs text-[#64748B] font-medium whitespace-nowrap">
                        {fmtAmount(c.current_amount)} / {fmtAmount(c.target_amount)} ₣
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
