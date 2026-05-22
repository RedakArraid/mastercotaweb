"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import {
  LayoutDashboard, Users, Wallet, CreditCard, Settings,
  LogOut, Menu, X, Loader2,
} from "lucide-react";

const NAV = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Tableau de bord", symbol: "▦" },
  { href: "/admin/users", icon: Users, label: "Utilisateurs", symbol: "○○" },
  { href: "/admin/cotisations", icon: Wallet, label: "Cotisations", symbol: "◐" },
  { href: "/admin/contributions", icon: CreditCard, label: "Paiements", symbol: "↗" },
  { href: "/admin/settings", icon: Settings, label: "Paramètres", symbol: "⚙" },
];

function Sidebar({ open, onClose, email }: { open: boolean; onClose: () => void; email: string }) {
  const pathname = usePathname();
  const router = useRouter();
  
  // Get initials from email
  const initials = email ? email.slice(0, 2).toUpperCase() : "AD";
  const displayName = email ? email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1) : "Admin";

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}
      <aside
        style={{
          background: "var(--ink)",
          color: "var(--paper)",
        }}
        className={`
          fixed md:sticky top-0 left-0 h-screen w-60 flex flex-col flex-shrink-0
          z-50 py-6 transition-transform duration-300 ease-in-out
          md:translate-x-0
          ${open ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
        `}
      >
        {/* Header Logo */}
        <div className="px-5 pb-5 border-b border-white/8 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 bg-white/10 flex items-center justify-center">
                <Image src="/app_icon.png" alt="MasterCota" width={32} height={32} className="w-full h-full object-cover" />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: "var(--paper)" }}>MasterCota</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                  Admin
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="md:hidden w-7 h-7 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 flex flex-col gap-0.5 overflow-y-auto">
          <div style={{
            fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em",
            textTransform: "uppercase", padding: "0 12px 10px"
          }}>
            Navigation
          </div>
          {NAV.map(({ href, icon: Icon, label, symbol }) => {
            const isActive = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 12px",
                  borderRadius: 10,
                  background: isActive ? "rgba(244,184,41,0.12)" : "transparent",
                  color: isActive ? "var(--accent-bright)" : "rgba(255,255,255,0.6)",
                  fontSize: 13,
                  fontWeight: 500,
                  position: "relative"
                }}
                className="transition-colors hover:text-white group"
              >
                {isActive && (
                  <span style={{
                    position: "absolute", left: -12, top: 6, bottom: 6, width: 3,
                    background: "var(--accent-bright)", borderRadius: "0 4px 4px 0"
                  }} />
                )}
                <span 
                  style={{
                    width: 20, textAlign: "center", fontFamily: "var(--mono)",
                    fontSize: 11, opacity: 0.85
                  }}
                  className="flex justify-center items-center shrink-0"
                >
                  <Icon className="w-3.5 h-3.5" />
                </span>
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Administrator profile and logout */}
        <div className="px-3 flex-shrink-0">
          <div style={{
            padding: "12px 14px", borderRadius: 12,
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
            display: "flex", alignItems: "center", gap: 12
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 50, background: "var(--accent-bright)",
              color: "var(--ink)", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 600
            }} className="flex items-center justify-center shrink-0 select-none">
              {initials}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: "var(--paper)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {displayName}
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }} className="mono truncate">
                {email}
              </div>
            </div>
          </div>
          
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.replace("/admin/login");
            }}
            style={{
              width: "100%", marginTop: 10, padding: "10px 12px", borderRadius: 10,
              background: "transparent", color: "rgba(255,255,255,0.4)",
              border: "none", fontSize: 12, textAlign: "left", display: "flex", alignItems: "center", gap: 10
            }}
            className="hover:text-red-400 hover:bg-white/5 transition-colors cursor-pointer"
          >
            <span style={{ fontFamily: "var(--mono)" }}>↗</span> Se déconnecter
          </button>
        </div>
      </aside>
    </>
  );
}

function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace("/admin/login");
      } else {
        setEmail(session.user?.email || "admin@mastercota.com");
        setReady(true);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setReady(false);
        router.replace("/admin/login");
      } else {
        setEmail(session.user?.email || "admin@mastercota.com");
        setReady(true);
      }
    });
    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFBFD]">
        <Loader2 className="w-7 h-7 text-[#DA9810] animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#FAFBFD]">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} email={email} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center gap-3 px-4 h-14 bg-white border-b border-slate-100 flex-shrink-0 shadow-sm justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 rounded-lg text-[#64748B] hover:bg-[#F0F4F8] hover:text-[#0A1120] transition-all"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                <Image src="/app_icon.png" alt="Mastercota" width={28} height={28} className="w-full h-full object-cover" />
              </div>
              <span className="font-extrabold text-sm text-[#0A1120]">
                MasterCota Admin
              </span>
            </div>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto bg-[#EEF2F8]">{children}</main>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  if (pathname === "/admin/login") return <>{children}</>;
  return <AuthGuard>{children}</AuthGuard>;
}

