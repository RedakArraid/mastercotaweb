"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { Loader2, Eye, EyeOff } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (authError) {
      setError(
        authError.message === "Invalid login credentials"
          ? "Email ou mot de passe incorrect"
          : authError.message
      );
    } else {
      router.replace("/admin/dashboard");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F7FB] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl overflow-hidden mx-auto mb-4 shadow-xl shadow-[#0A1120]/15">
            <Image src="/app_icon.png" alt="Mastercota" width={64} height={64} className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#0A1120]">Mastercota Admin</h1>
          <p className="text-sm text-[#64748B] mt-1">Espace réservé aux administrateurs</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-[#E8ECF2] p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-[#0A1120]">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                placeholder="admin@mastercota.com"
                className="w-full px-4 py-3 rounded-xl border border-[#E8ECF2] bg-[#F5F7FB] text-[#0A1120] text-sm focus:outline-none focus:ring-2 focus:ring-[#1E5BB4]/20 focus:border-[#1E5BB4] transition-all placeholder:text-[#CBD5E1]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-[#0A1120]">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-[#E8ECF2] bg-[#F5F7FB] text-[#0A1120] text-sm focus:outline-none focus:ring-2 focus:ring-[#1E5BB4]/20 focus:border-[#1E5BB4] transition-all placeholder:text-[#CBD5E1]"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B] transition-colors"
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600 font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-[#EEA226] to-[#C78114] text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-[#EEA226]/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Connexion...</>
              ) : (
                "Se connecter"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
