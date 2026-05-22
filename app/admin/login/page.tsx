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
    <div style={{
      width: "100%",
      minHeight: "100vh",
      background: "var(--paper-2)",
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))"
    }}>
      {/* Left Pane: Editorial Brand Block */}
      <div 
        style={{
          background: "var(--ink)",
          color: "var(--paper)",
          padding: "56px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          overflow: "hidden"
        }}
        className="hidden md:flex"
      >
        <div style={{
          position: "absolute", top: -120, right: -120, width: 380, height: 380,
          borderRadius: "50%", background: "var(--accent)", opacity: 0.15
        }} />

        {/* Logo block */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, position: "relative" }}>
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/10 flex items-center justify-center">
            <Image src="/app_icon.png" alt="MasterCota" width={38} height={38} className="w-full h-full object-cover" />
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 500, color: "var(--cream)" }}>MasterCota</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Admin
            </div>
          </div>
        </div>

        {/* Editorial center block */}
        <div style={{ position: "relative" }}>
          <span className="eyebrow" style={{ color: "rgba(255,255,255,0.5)" }}>Panel d'administration</span>
          <h2 className="serif" style={{
            fontSize: 52, lineHeight: 1.05, letterSpacing: "-0.03em", margin: "16px 0 18px", color: "var(--cream)"
          }}>
            Bienvenue.<br />
            <span className="serif-italic" style={{ color: "var(--accent-bright)", fontFamily: "Newsreader, Georgia, serif", fontStyle: "italic" }}>Connectez-vous.</span>
          </h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.55, margin: 0, maxWidth: 360 }}>
            Accès réservé aux administrateurs MasterCota. Toute connexion est consignée
            et soumise à validation et audit de sécurité.
          </p>
        </div>

        {/* Bottom footer status */}
        <div style={{ position: "relative", display: "flex", gap: 24, fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
          <span><span className="mono" style={{ color: "var(--paper)" }}>v1.0.3</span> · production</span>
          <span>Région · Abidjan</span>
          <span>Statut · opérationnel</span>
        </div>
      </div>

      {/* Right Pane: Credentials Form */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
        background: "var(--cream)",
        minHeight: "100vh"
      }}>
        <div style={{ width: "100%", maxWidth: 380 }}>
          {/* Mobile-only logo */}
          <div className="flex md:hidden items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center">
              <Image src="/app_icon.png" alt="MasterCota" width={38} height={38} className="w-full h-full object-cover" />
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 500, color: "var(--ink)" }}>MasterCota</div>
              <div style={{ fontSize: 10, color: "var(--ink-3)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Admin
              </div>
            </div>
          </div>

          <span className="eyebrow">Authentification</span>
          <h3 className="serif text-[#143268]" style={{ fontSize: 32, letterSpacing: "-0.025em", margin: "10px 0 32px" }}>
            Identifiez-vous.
          </h3>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field with Underlined Layout */}
            <div style={{ borderBottom: "1px solid var(--line)", paddingBottom: 4 }}>
              <div className="flex justify-between items-baseline">
                <span className="eyebrow">Adresse e-mail</span>
              </div>
              <input
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@mastercota.com"
                style={{
                  width: "100%", border: "none", outline: "none", background: "transparent",
                  padding: "10px 0", fontSize: 16, color: "var(--ink)"
                }}
                className="placeholder:text-slate-300"
              />
            </div>

            {/* Password Field with Underlined Layout */}
            <div style={{ borderBottom: "1px solid var(--line)", paddingBottom: 4 }}>
              <div className="flex justify-between items-baseline">
                <span className="eyebrow">Mot de passe</span>
                <a style={{ fontSize: 11, color: "var(--accent-dark)", fontWeight: 500 }} className="hover:underline cursor-pointer">
                  Oublié ?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  style={{
                    width: "100%", border: "none", outline: "none", background: "transparent",
                    padding: "10px 0", fontSize: 16, color: "var(--ink)"
                  }}
                  className="placeholder:text-slate-300 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600 font-medium">
                {error}
              </div>
            )}

            <label style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 20, fontSize: 12, color: "var(--ink-2)" }}>
              <input type="checkbox" defaultChecked className="accent-[#DA9810] rounded" />
              Garder ma session active pendant 24 h
            </label>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full flex items-center justify-center gap-2"
              style={{
                marginTop: 28, height: 52, fontSize: 14, background: "var(--ink)", color: "var(--paper)",
                borderRadius: "999px"
              }}
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Connexion...</>
              ) : (
                "Continuer →"
              )}
            </button>

            <p style={{ fontSize: 11, color: "var(--ink-3)", textAlign: "center", marginTop: 18, lineHeight: 1.5 }}>
              Cette interface est réservée au personnel autorisé. Toute tentative d'accès non autorisée est enregistrée.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

