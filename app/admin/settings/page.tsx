"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { SiteConfig } from "@/lib/supabase";
import {
  Phone, Mail, Camera, Globe, Bird, Music2, PlayCircle,
  FileText, Upload, ExternalLink, LogOut, Save,
  CheckCircle2, XCircle, Loader2, X,
} from "lucide-react";

// ── Toast ──────────────────────────────────────────────────

type ToastItem = { id: number; message: string; type: "success" | "error" };

function useToast() {
  const [items, setItems] = useState<ToastItem[]>([]);
  const counter = useRef(0);
  const show = useCallback((message: string, type: "success" | "error") => {
    const id = ++counter.current;
    setItems((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);
  const dismiss = useCallback((id: number) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);
  return { items, show, dismiss };
}

// ── Form field ─────────────────────────────────────────────

function Field({
  label, value, onChange, placeholder, type = "text", icon,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }} className="block">{label}</label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none">
            {icon}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            height: 42, padding: `0 14px 0 ${icon ? "40px" : "14px"}`, borderRadius: 8,
            background: "var(--cream)", border: "1px solid var(--line)",
            color: "var(--ink)", fontSize: 13, outline: "none"
          }}
          className="w-full focus:border-slate-400 transition-colors"
        />
      </div>
    </div>
  );
}

// ── Document upload card ───────────────────────────────────

function DocCard({
  title, subtitle, fieldKey, currentUrl, onUpload, isUploading,
}: {
  title: string;
  subtitle: string;
  fieldKey: string;
  currentUrl: string;
  onUpload: (key: string, file: File) => void;
  isUploading: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div style={{
      padding: 20, borderRadius: 12, border: "1px solid var(--line)",
      background: "var(--paper-2)"
    }} className="space-y-4 hover:border-slate-300 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p style={{ fontWeight: 600, color: "var(--ink)", fontSize: 14 }}>{title}</p>
          <p style={{ fontSize: 11, color: "var(--ink-4)", marginTop: 4 }}>{subtitle}</p>
        </div>
        <div style={{
          width: 38, height: 38, borderRadius: 8, background: "rgba(20,50,104,0.06)",
          color: "var(--ink)", display: "flex", alignItems: "center", justifyContent: "center"
        }} className="shrink-0">
          <FileText className="w-4 h-4" />
        </div>
      </div>

      {currentUrl ? (
        <div style={{
          display: "flex", alignItems: "center", gap: 10, padding: 12, borderRadius: 8,
          background: "rgba(26,117,87,0.06)", border: "1px solid rgba(26,117,87,0.15)"
        }}>
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span style={{ color: "var(--forest)", fontWeight: 500, fontSize: 12 }} className="flex-1 truncate">Document en ligne</span>
          <a
            href={currentUrl}
            target="_blank"
            rel="noreferrer"
            style={{ fontSize: 12, color: "var(--ink)", fontWeight: 600 }}
            className="flex items-center gap-1 hover:underline whitespace-nowrap"
          >
            Voir <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      ) : (
        <div style={{
          display: "flex", alignItems: "center", gap: 10, padding: 12, borderRadius: 8,
          background: "rgba(244,184,41,0.08)", border: "1px solid rgba(244,184,41,0.2)"
        }}>
          <XCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
          <span style={{ color: "var(--ink)", fontSize: 12, fontWeight: 500 }}>Aucun document uploadé</span>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onUpload(fieldKey, file);
          e.target.value = "";
        }}
      />
      <button
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          padding: "10px 14px", borderRadius: 8, border: "2px dashed rgba(20,50,104,0.2)",
          color: "var(--ink)", background: "rgba(20,50,104,0.03)", fontSize: 13, fontWeight: 600,
          cursor: "pointer"
        }}
        className="hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isUploading ? (
          <><Loader2 className="w-4 h-4 animate-spin" />Upload en cours...</>
        ) : (
          <><Upload className="w-4 h-4" />{currentUrl ? "Remplacer le PDF" : "Uploader le PDF"}</>
        )}
      </button>
    </div>
  );
}

// ── Section header ─────────────────────────────────────────

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="pb-4 border-b border-slate-100">
      <h2 style={{ fontWeight: 700, color: "var(--ink)", fontSize: 16 }}>{title}</h2>
      <p style={{ fontSize: 12, color: "var(--ink-4)", marginTop: 2 }}>{subtitle}</p>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────

type Tab = "contact" | "social" | "documents";
type ConfigForm = Omit<SiteConfig, "id" | "updated_at">;

const DEFAULT: ConfigForm = {
  phone_whatsapp: "",
  email_contact: "",
  email_support: "",
  social_instagram: "",
  social_facebook: "",
  social_twitter: "",
  social_tiktok: "",
  social_youtube: "",
  doc_cgu_url: "",
  doc_privacy_url: "",
  doc_mentions_url: "",
};

export default function AdminPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("contact");
  const [config, setConfig] = useState<ConfigForm>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const { items: toasts, show: showToast, dismiss } = useToast();

  useEffect(() => {
    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.replace("/admin/login");
        return;
      }

      const { data } = await supabase
        .from("site_config")
        .select("*")
        .eq("id", 1)
        .single();

      if (data) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, updated_at, ...rest } = data as SiteConfig;
        setConfig(rest);
      }
      setLoading(false);
    })();
  }, [router]);

  const set = (key: keyof ConfigForm) => (value: string) =>
    setConfig((prev) => ({ ...prev, [key]: value }));

  async function handleSave() {
    setSaving(true);
    const { error } = await supabase
      .from("site_config")
      .upsert({ id: 1, ...config, updated_at: new Date().toISOString() });
    setSaving(false);
    if (error) showToast("Erreur : " + error.message, "error");
    else showToast("Modifications sauvegardées", "success");
  }

  async function handleUpload(fieldKey: string, file: File) {
    setUploading((p) => ({ ...p, [fieldKey]: true }));
    try {
      const ext = file.name.split(".").pop() ?? "pdf";
      const path = `${fieldKey}_${Date.now()}.${ext}`;

      const { data: uploaded, error: upErr } = await supabase.storage
        .from("documents")
        .upload(path, file, { contentType: "application/pdf" });

      if (upErr) throw upErr;

      const {
        data: { publicUrl },
      } = supabase.storage.from("documents").getPublicUrl(uploaded.path);

      const newConfig = { ...config, [fieldKey]: publicUrl };
      setConfig(newConfig);

      const { error: saveErr } = await supabase
        .from("site_config")
        .upsert({ id: 1, ...newConfig, updated_at: new Date().toISOString() });

      if (saveErr) throw saveErr;
      showToast("Document uploadé avec succès", "success");
    } catch (e: unknown) {
      showToast(
        "Erreur upload : " + (e instanceof Error ? e.message : String(e)),
        "error"
      );
    } finally {
      setUploading((p) => ({ ...p, [fieldKey]: false }));
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7FB]">
        <Loader2 className="w-8 h-8 text-[#EEA226] animate-spin" />
      </div>
    );
  }

  const TABS: { id: Tab; label: string }[] = [
    { id: "contact", label: "Contact & Support" },
    { id: "social", label: "Réseaux sociaux" },
    { id: "documents", label: "Documents" },
  ];

  return (
    <div>
      {/* Toasts */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-semibold text-white pointer-events-auto ${
              t.type === "success" ? "bg-emerald-500" : "bg-red-500"
            }`}
          >
            {t.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            ) : (
              <XCircle className="w-4 h-4 flex-shrink-0" />
            )}
            <span className="flex-1">{t.message}</span>
            <button
              onClick={() => dismiss(t.id)}
              className="ml-1 opacity-70 hover:opacity-100 transition-opacity"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Page Header */}
      <header style={{
        padding: "28px 40px 20px", display: "flex", justifyContent: "space-between",
        alignItems: "flex-end", gap: 24, borderBottom: "1px solid var(--line)",
        background: "var(--cream)"
      }} className="flex-col sm:flex-row">
        <div>
          <div style={{ fontSize: 11, color: "var(--ink-3)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>
            Admin · Configuration
          </div>
          <h1 className="serif text-[#143268]" style={{ fontSize: 36, letterSpacing: "-0.025em", margin: 0, lineHeight: 1.05, fontWeight: 500 }}>
            Paramètres
          </h1>
        </div>
      </header>

      {/* Main Content Area */}
      <div style={{ padding: "32px 40px 60px" }} className="space-y-6 max-w-3xl">
        <p style={{ color: "var(--ink-3)", fontSize: 14 }}>
          Gérez les contacts de support, réseaux sociaux officiels, et documents légaux affichés sur le site web et dans l'application mobile.
        </p>

        {/* Tab navigation */}
        <nav style={{
          display: "flex", gap: 4, background: "var(--paper-2)", borderRadius: 12,
          padding: 4, border: "1px solid var(--line)"
        }}>
          {TABS.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  flex: 1, textAlign: "center", padding: "10px 16px", borderRadius: 8,
                  fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer",
                  background: active ? "var(--ink)" : "transparent",
                  color: active ? "var(--paper)" : "var(--ink-3)",
                }}
                className="transition-all hover:text-[#143268]"
              >
                {t.label}
              </button>
            );
          })}
        </nav>

        {/* Tab content */}
        <div style={{
          background: "var(--cream)", border: "1px solid var(--line)", borderRadius: 16,
          padding: 24
        }} className="space-y-6">
          {tab === "contact" && (
            <>
              <SectionHeader
                title="Contact & Support"
                subtitle="Ces informations apparaissent dans l'application mobile et le footer du site."
              />
              <Field
                label="Numéro WhatsApp (support)"
                value={config.phone_whatsapp}
                onChange={set("phone_whatsapp")}
                placeholder="+225 07 00 00 00 00"
                type="tel"
                icon={<Phone className="w-4 h-4" />}
              />
              <Field
                label="Email de contact général"
                value={config.email_contact}
                onChange={set("email_contact")}
                placeholder="contact@mastercota.com"
                type="email"
                icon={<Mail className="w-4 h-4" />}
              />
              <Field
                label="Email de support utilisateur"
                value={config.email_support}
                onChange={set("email_support")}
                placeholder="support@mastercota.com"
                type="email"
                icon={<Mail className="w-4 h-4" />}
              />
            </>
          )}

          {tab === "social" && (
            <>
              <SectionHeader
                title="Réseaux sociaux"
                subtitle="Liens vers les pages officielles Mastercota. Laissez vide pour masquer le lien."
              />
              <Field
                label="Instagram"
                value={config.social_instagram}
                onChange={set("social_instagram")}
                placeholder="https://instagram.com/mastercota"
                icon={<Camera className="w-4 h-4" />}
              />
              <Field
                label="Facebook"
                value={config.social_facebook}
                onChange={set("social_facebook")}
                placeholder="https://facebook.com/mastercota"
                icon={<Globe className="w-4 h-4" />}
              />
              <Field
                label="Twitter / X"
                value={config.social_twitter}
                onChange={set("social_twitter")}
                placeholder="https://x.com/mastercota"
                icon={<Bird className="w-4 h-4" />}
              />
              <Field
                label="TikTok"
                value={config.social_tiktok}
                onChange={set("social_tiktok")}
                placeholder="https://tiktok.com/@mastercota"
                icon={<Music2 className="w-4 h-4" />}
              />
              <Field
                label="YouTube"
                value={config.social_youtube}
                onChange={set("social_youtube")}
                placeholder="https://youtube.com/@mastercota"
                icon={<PlayCircle className="w-4 h-4" />}
              />
            </>
          )}

          {tab === "documents" && (
            <>
              <SectionHeader
                title="Documents légaux"
                subtitle="Uploadez vos PDFs. Les liens sont automatiquement mis à jour sur le site et dans l'app."
              />
              <DocCard
                title="Conditions Générales d'Utilisation (CGU)"
                subtitle="Lien CGU dans le footer du site et de l'application"
                fieldKey="doc_cgu_url"
                currentUrl={config.doc_cgu_url}
                onUpload={handleUpload}
                isUploading={!!uploading["doc_cgu_url"]}
              />
              <DocCard
                title="Politique de confidentialité"
                subtitle="Ouvre ce PDF quand l'utilisateur appuie sur Confidentialité dans l'app"
                fieldKey="doc_privacy_url"
                currentUrl={config.doc_privacy_url}
                onUpload={handleUpload}
                isUploading={!!uploading["doc_privacy_url"]}
              />
              <DocCard
                title="Mentions légales"
                subtitle="Accessible depuis le footer du site"
                fieldKey="doc_mentions_url"
                currentUrl={config.doc_mentions_url}
                onUpload={handleUpload}
                isUploading={!!uploading["doc_mentions_url"]}
              />
            </>
          )}

          {/* Save button — not needed for documents (auto-saved on upload) */}
          {tab !== "documents" && (
            <div className="pt-2">
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  padding: "12px 16px", background: "var(--ink)", color: "var(--paper)",
                  border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer"
                }}
                className="hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <><Loader2 className="w-4 h-4 animate-spin" />Sauvegarde...</>
                ) : (
                  <><Save className="w-4 h-4" />Sauvegarder les modifications</>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
