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
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Tableau de bord" },
  { href: "/admin/users", icon: Users, label: "Utilisateurs" },
  { href: "/admin/cotisations", icon: Wallet, label: "Cotisations" },
  { href: "/admin/contributions", icon: CreditCard, label: "Paiements" },
  { href: "/admin/settings", icon: Settings, label: "Paramètres" },
];

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}
      <aside
        className={`
          fixed md:sticky top-0 left-0 h-screen w-60 flex flex-col flex-shrink-0
          bg-[#0A1120] z-50
          transition-transform duration-300 ease-in-out
          md:translate-x-0
          ${open ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-white/8 flex-shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0 bg-[#0D1829]">
              <Image src="/app_icon.png" alt="Mastercota" width={36} height={36} className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <p className="text-white font-extrabold text-sm leading-tight tracking-tight">Mastercota</p>
              <p className="text-white/30 text-[10px] leading-tight">Admin Dashboard</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="md:hidden w-7 h-7 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV.map(({ href, icon: Icon, label }) => {
            const isActive =
              pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                  ${
                    isActive
                      ? "bg-[#1E40AF] text-white shadow-md shadow-[#1E40AF]/30"
                      : "text-white/45 hover:text-white hover:bg-white/6"
                  }
                `}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 pb-4 flex-shrink-0">
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.replace("/admin/login");
            }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/35 hover:text-red-400 hover:bg-red-500/10 w-full transition-all"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            Se déconnecter
          </button>
        </div>
      </aside>
    </>
  );
}

function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.replace("/admin/login");
      else setReady(true);
    });
  }, [router]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0F4F8]">
        <Loader2 className="w-7 h-7 text-[#1E40AF] animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#F0F4F8]">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center gap-3 px-4 h-14 bg-white border-b border-[#E2E8F0] flex-shrink-0 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-lg text-[#64748B] hover:bg-[#F0F4F8] hover:text-[#0A1120] transition-all"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg overflow-hidden bg-[#0D1829] flex-shrink-0">
              <Image src="/app_icon.png" alt="Mastercota" width={28} height={28} className="w-full h-full object-cover" />
            </div>
            <span className="font-extrabold text-sm text-[#0A1120]">
              Mastercota Admin
            </span>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto">{children}</main>
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
