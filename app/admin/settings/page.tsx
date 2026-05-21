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
      <label className="block text-sm font-semibold text-[#0A1120]">{label}</label>
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
          className={`w-full py-3 pr-4 rounded-xl border border-[#E8ECF2] bg-[#F5F7FB] text-[#0A1120] text-sm focus:outline-none focus:ring-2 focus:ring-[#1E5BB4]/20 focus:border-[#1E5BB4] transition-all placeholder:text-[#CBD5E1] ${icon ? "pl-10" : "pl-4"}`}
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
    <div className="p-5 rounded-2xl border border-[#E8ECF2] bg-[#F8FAFC] space-y-4 hover:border-[#CBD5E1] transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className="font-semibold text-[#0A1120] text-sm leading-snug">{title}</p>
          <p className="text-xs text-[#94A3B8] mt-1">{subtitle}</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-[#1E5BB4]/10 text-[#1E5BB4] flex items-center justify-center flex-shrink-0">
          <FileText className="w-5 h-5" />
        </div>
      </div>

      {currentUrl ? (
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0]">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          <span className="text-emerald-700 font-medium text-xs flex-1 truncate">Document en ligne</span>
          <a
            href={currentUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-xs text-[#1E5BB4] font-bold hover:underline whitespace-nowrap"
          >
            Voir <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      ) : (
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#FFFBEB] border border-[#FDE68A]">
          <XCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span className="text-amber-700 text-xs font-medium">Aucun document uploadé</span>
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
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-[#1E5BB4]/30 text-[#1E5BB4] bg-[#1E5BB4]/5 text-sm font-semibold hover:bg-[#1E5BB4]/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
    <div className="pb-4 border-b border-[#F1F5F9]">
      <h2 className="font-bold text-[#0A1120] text-base">{title}</h2>
      <p className="text-xs text-[#94A3B8] mt-0.5">{subtitle}</p>
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
    <div className="min-h-screen bg-[#F5F7FB]">

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

      {/* Header */}
      <header className="bg-white border-b border-[#E8ECF2] px-6 h-16 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#EEA226] to-[#C78114] flex items-center justify-center">
            <span className="text-white font-extrabold text-lg leading-none">₣</span>
          </div>
          <div className="leading-tight">
            <p className="font-extrabold text-[#0A1120] text-sm">Mastercota</p>
            <p className="text-[11px] text-[#94A3B8]">Administration</p>
          </div>
        </div>
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            router.replace("/admin/login");
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-[#64748B] hover:bg-[#F5F7FB] hover:text-[#0A1120] transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:block">Déconnexion</span>
        </button>
      </header>

      {/* Main content */}
      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-xl font-extrabold text-[#0A1120]">Paramètres du site</h1>
          <p className="text-sm text-[#64748B] mt-1">
            Ces informations sont affichées sur le site web et dans l'application mobile.
          </p>
        </div>

        {/* Tab navigation */}
        <nav className="flex gap-1 bg-white rounded-2xl p-1 border border-[#E8ECF2] overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 min-w-max px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                tab === t.id
                  ? "bg-[#1E5BB4] text-white shadow-sm"
                  : "text-[#64748B] hover:text-[#0A1120] hover:bg-[#F5F7FB]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>

        {/* Tab content */}
        <div className="bg-white rounded-2xl border border-[#E8ECF2] p-6 space-y-5">
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
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-[#EEA226] to-[#C78114] text-white rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-[#EEA226]/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
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
      </main>
    </div>
  );
}
