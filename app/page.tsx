"use client";

import React from "react";
import Link from "next/link";
import {
  Shield,
  ArrowRight,
  Smartphone,
  Zap,
  Heart,
  Users,
  Check,
  Award,
  Download,
  Share2,
  TrendingUp,
  Wallet,
  MapPin,
  ChevronRight,
} from "lucide-react";

const scrollTo = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F5F7FB] text-[#0A1120] font-sans selection:bg-brand-gold/30 selection:text-brand-gold-dark">

      {/* ── HEADER ────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-md border-b border-app-border/40 px-6 py-4 flex items-center justify-between transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-gold to-brand-gold-dark flex items-center justify-center shadow-lg shadow-brand-gold/20">
            <span className="text-white font-extrabold text-xl leading-none">₣</span>
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-brand-blue-dark to-brand-blue bg-clip-text text-transparent">
              Mastercota
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <button onClick={() => scrollTo("features")} className="text-sm font-medium text-text-secondary hover:text-brand-blue transition-colors">
            Fonctionnalités
          </button>
          <button onClick={() => scrollTo("howto")} className="text-sm font-medium text-text-secondary hover:text-brand-blue transition-colors">
            Comment ça marche
          </button>
          <button onClick={() => scrollTo("about")} className="text-sm font-medium text-text-secondary hover:text-brand-blue transition-colors">
            À propos
          </button>
          <button onClick={() => scrollTo("security")} className="text-sm font-medium text-text-secondary hover:text-brand-blue transition-colors">
            Sécurité
          </button>
        </nav>

        <div>
          <button
            onClick={() => scrollTo("download")}
            className="px-5 py-2.5 bg-gradient-to-r from-brand-blue to-brand-blue-dark text-white rounded-full text-sm font-semibold hover:shadow-lg hover:shadow-brand-blue/20 transition-all duration-300 transform active:scale-95 flex items-center gap-2"
          >
            <Smartphone className="w-4 h-4" />
            Télécharger l'app
          </button>
        </div>
      </header>

      {/* ── HERO SECTION ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-24 pb-20 px-6 md:px-12 flex flex-col items-center text-center">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 -right-32 w-96 h-96 bg-brand-blue/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto flex flex-col items-center gap-6 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold-dark text-xs font-semibold uppercase tracking-wider animate-pulse">
            <Zap className="w-3.5 h-3.5" />
            Nouveau : Paiements mobiles simplifiés
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-text-primary leading-[1.1] max-w-3xl">
            Participez aux cotisations collectives en{" "}
            <span className="bg-gradient-to-r from-brand-gold to-brand-gold-dark bg-clip-text text-transparent">
              un clic
            </span>
          </h1>

          <p className="text-lg md:text-xl text-text-secondary max-w-2xl leading-relaxed">
            La solution moderne, transparente et sécurisée pour organiser des cagnottes de groupe, collecter des fonds et soutenir des causes communes en Afrique de l'Ouest.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full justify-center">
            <button
              onClick={() => scrollTo("download")}
              className="px-8 py-4 bg-gradient-to-r from-brand-gold to-brand-gold-dark text-white rounded-2xl text-base font-bold shadow-lg shadow-brand-gold/30 hover:shadow-xl hover:shadow-brand-gold/40 hover:-translate-y-0.5 transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2"
            >
              Télécharger l'app
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => scrollTo("howto")}
              className="px-8 py-4 bg-white border border-app-border text-text-primary rounded-2xl text-base font-bold shadow-sm hover:bg-app-surface-elevated hover:border-text-tertiary transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2"
            >
              Comment ça marche
            </button>
          </div>

          {/* Mockup card */}
          <div className="mt-16 w-full max-w-3xl rounded-3xl border border-white/60 bg-white/40 p-4 shadow-2xl backdrop-blur-md">
            <div className="rounded-2xl bg-gradient-to-br from-brand-blue-dark to-brand-blue p-6 md:p-10 text-white text-left relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-8 shadow-inner">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-12 -translate-y-12 pointer-events-none" />

              <div className="space-y-4 max-w-lg z-10">
                <div className="px-3 py-1 rounded-full bg-white/20 border border-white/30 text-xs font-bold inline-block">
                  Cagnotte en cours
                </div>
                <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                  Projet Anniversaire de Fatou
                </h3>
                <p className="text-white/80 text-sm">
                  Cagnotte commune pour lui organiser un anniversaire surprise et lui offrir son cadeau de rêve !
                </p>

                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span>750 000 FCFA collectés</span>
                    <span>75%</span>
                  </div>
                  <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden">
                    <div className="bg-brand-gold h-full rounded-full" style={{ width: "75%" }} />
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 w-full md:w-auto md:min-w-[240px] flex flex-col items-center justify-center gap-4 z-10">
                <div className="text-center">
                  <span className="text-xs uppercase tracking-wider text-white/60 block">Objectif</span>
                  <span className="text-2xl font-black">1 000 000 F</span>
                </div>
                <div className="w-full h-[1px] bg-white/10" />
                {/* Demo only — not clickable */}
                <div className="w-full py-3 bg-brand-gold/70 text-white font-extrabold rounded-xl text-center text-sm opacity-60 cursor-default select-none">
                  Faire un don
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES SECTION ─────────────────────────────────────── */}
      <section id="features" className="py-20 px-6 bg-white border-y border-app-border/40 relative">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center max-w-xl mx-auto space-y-4">
            <h2 className="text-3xl font-extrabold tracking-tight text-text-primary">
              Pourquoi choisir Mastercota ?
            </h2>
            <p className="text-text-secondary">
              Une plateforme moderne conçue pour simplifier les collectes de fonds et encourager l'entraide communautaire.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl border border-app-border bg-app-surface-elevated hover:border-brand-gold/30 hover:shadow-xl hover:shadow-brand-gold/5 transition-all duration-300 flex flex-col gap-5 group">
              <div className="w-12 h-12 rounded-xl bg-brand-gold/10 text-brand-gold flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-text-primary">Collecte Express</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Créez une page de cotisation en quelques secondes, partagez le lien sur WhatsApp, Telegram ou SMS et recevez des fonds immédiatement.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-app-border bg-app-surface-elevated hover:border-brand-blue/30 hover:shadow-xl hover:shadow-brand-blue/5 transition-all duration-300 flex flex-col gap-5 group">
              <div className="w-12 h-12 rounded-xl bg-brand-blue/10 text-brand-blue flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-text-primary">Transparence Totale</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Suivez les contributions en temps réel grâce à la page publique interactive. Les contributeurs voient l'avancement et les badges honorifiques.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-app-border bg-app-surface-elevated hover:border-red-500/20 hover:shadow-xl hover:shadow-red-500/5 transition-all duration-300 flex flex-col gap-5 group">
              <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-text-primary">Sécurité de Bout en Bout</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Intégration native avec Paystack pour sécuriser vos paiements Mobile Money (Orange, MTN, Moov, Wave) et Cartes Bancaires.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS SECTION ─────────────────────────────────── */}
      <section id="howto" className="py-20 px-6 bg-[#F5F7FB] relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-app-border to-transparent" />

        <div className="max-w-5xl mx-auto space-y-14">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/20 text-brand-blue text-xs font-bold uppercase tracking-wider">
              Démarrer en 2 minutes
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-text-primary">
              Comment ça marche ?
            </h2>
            <p className="text-text-secondary max-w-lg mx-auto text-sm md:text-base">
              Quatre étapes simples pour lancer votre cagnotte et commencer à recevoir des contributions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                step: "01",
                icon: <Download className="w-6 h-6" />,
                color: "brand-gold",
                title: "Téléchargez l'application",
                desc: "Disponible sur iOS et Android. L'inscription se fait en 30 secondes via votre numéro de téléphone, sans mot de passe.",
              },
              {
                step: "02",
                icon: <Zap className="w-6 h-6" />,
                color: "brand-blue",
                title: "Créez votre cotisation",
                desc: "Donnez un titre, une description, un objectif en FCFA et une date limite. Votre page publique est générée instantanément.",
              },
              {
                step: "03",
                icon: <Share2 className="w-6 h-6" />,
                color: "emerald-500",
                title: "Partagez le lien",
                desc: "Un lien unique est créé (ex: mastercota.com/c/votre-cagnotte). Partagez-le sur WhatsApp, SMS ou Telegram en un tap.",
              },
              {
                step: "04",
                icon: <Wallet className="w-6 h-6" />,
                color: "purple-500",
                title: "Collectez et retirez",
                desc: "Les contributions arrivent en temps réel. Reversement automatique sur votre compte Mobile Money ou bancaire.",
              },
            ].map(({ step, icon, color, title, desc }) => (
              <div
                key={step}
                className="relative p-7 rounded-2xl bg-white border border-app-border hover:border-app-border/80 hover:shadow-lg transition-all duration-300 flex gap-5 group"
              >
                <div className="flex-shrink-0 flex flex-col items-center gap-3">
                  <span className="text-[10px] font-black text-text-tertiary tracking-widest">{step}</span>
                  <div className={`w-11 h-11 rounded-xl bg-${color}/10 text-${color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    {icon}
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-text-primary text-base">{title}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => scrollTo("download")}
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-brand-gold to-brand-gold-dark text-white rounded-2xl text-sm font-bold shadow-lg shadow-brand-gold/20 hover:shadow-xl hover:shadow-brand-gold/30 hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
            >
              <Smartphone className="w-4 h-4" />
              Commencer maintenant
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ── SECURITY / PARTNER SECTION ───────────────────────────── */}
      <section id="security" className="py-20 px-6 bg-[#0A1120] text-white overflow-hidden relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-blue/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 z-10 relative">
          <div className="space-y-6 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/20 border border-brand-blue/30 text-brand-blue text-xs font-bold">
              <Shield className="w-3.5 h-3.5" />
              Paiements Certifiés PCI-DSS
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Des transactions cryptées et garanties avec Paystack
            </h2>
            <p className="text-white/70 leading-relaxed text-sm md:text-base">
              Vos informations de paiement ne sont jamais stockées sur nos serveurs. L'initialisation se fait via les protocoles de sécurité de Paystack et les fonds sont directement transférés sur le sous-compte du créateur de la cotisation.
            </p>

            <ul className="space-y-3">
              {[
                "Chiffrement AES 256 bits des transactions",
                "Support complet Wave, Orange Money, MTN MoMo, Moov",
                "Reversement automatique et commission transparente",
                "Protection anti-fraude active 24/7",
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-sm text-white/90">
                  <div className="w-5 h-5 rounded-full bg-brand-gold/20 text-brand-gold flex items-center justify-center">
                    <Check className="w-3 h-3" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md w-full md:w-auto md:min-w-[340px] flex flex-col gap-6">
            <h4 className="font-bold text-center text-white/95">Payer en toute sécurité</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center gap-2">
                <span className="text-2xl">📱</span>
                <span className="text-xs font-semibold text-white/80">Mobile Money</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center gap-2">
                <span className="text-2xl">💳</span>
                <span className="text-xs font-semibold text-white/80">Cartes Visa/MC</span>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-brand-gold/10 border border-brand-gold/20 flex gap-3">
              <Award className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" />
              <p className="text-xs text-brand-gold/90 leading-normal">
                Partenaire technologique officiel de confiance pour les paiements en Afrique.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT SECTION ────────────────────────────────────────── */}
      <section id="about" className="py-20 px-6 bg-white border-b border-app-border/40">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-14">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold-dark text-xs font-bold uppercase tracking-wider">
              Notre mission
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-text-primary leading-tight">
              Rendre la cotisation collective{" "}
              <span className="bg-gradient-to-r from-brand-gold to-brand-gold-dark bg-clip-text text-transparent">
                accessible à tous
              </span>
            </h2>
            <p className="text-text-secondary leading-relaxed">
              Mastercota est né d'un constat simple : en Afrique de l'Ouest, les cotisations entre amis, familles ou collègues sont une pratique culturelle forte — mais elles restent souvent organisées à la main, source de malentendus et de perte de confiance.
            </p>
            <p className="text-text-secondary leading-relaxed">
              Notre application apporte la transparence, la traçabilité et la sécurité des paiements numériques à cette tradition communautaire essentielle.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              {["Côte d'Ivoire", "Sénégal", "Cameroun", "Bénin", "Togo", "Burkina Faso"].map((country) => (
                <span key={country} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-app-surface-elevated border border-app-border text-xs font-semibold text-text-secondary">
                  <MapPin className="w-3 h-3 text-brand-gold" />
                  {country}
                </span>
              ))}
            </div>
          </div>

          <div className="flex-shrink-0 grid grid-cols-2 gap-4 w-full md:w-auto md:min-w-[300px]">
            {[
              { value: "2.5%", label: "Frais tout inclus", sub: "Paystack 1.5% + Mastercota 1%", color: "brand-gold" },
              { value: "0s", label: "Sans inscription", sub: "Pour contribuer via le lien", color: "brand-blue" },
              { value: "100%", label: "Transparence", sub: "Liste publique des contributions", color: "emerald-500" },
              { value: "24/7", label: "Disponible", sub: "Paiements en temps réel", color: "purple-500" },
            ].map(({ value, label, sub, color }) => (
              <div key={label} className="p-5 rounded-2xl bg-app-surface-elevated border border-app-border text-center space-y-1">
                <span className={`text-2xl font-black text-${color}`}>{value}</span>
                <p className="text-xs font-bold text-text-primary">{label}</p>
                <p className="text-[10px] text-text-tertiary leading-tight">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DOWNLOAD SECTION ─────────────────────────────────────── */}
      <section id="download" className="py-24 px-6 bg-[#F5F7FB] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-brand-blue/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl mx-auto text-center space-y-10 relative z-10">
          <div className="space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-gold to-brand-gold-dark flex items-center justify-center shadow-xl shadow-brand-gold/20 mx-auto">
              <span className="text-white font-extrabold text-3xl leading-none">₣</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-text-primary">
              Téléchargez Mastercota
            </h2>
            <p className="text-text-secondary max-w-md mx-auto leading-relaxed">
              Disponible gratuitement sur iOS et Android. Créez votre première cotisation en moins de 2 minutes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {/* App Store */}
            <div className="relative group">
              <div className="flex items-center gap-4 bg-[#0A1120] text-white px-6 py-4 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 cursor-not-allowed opacity-80 hover:opacity-90 w-full sm:w-auto min-w-[200px]">
                <span className="text-3xl leading-none"></span>
                <div className="text-left">
                  <p className="text-[10px] text-white/60 font-medium uppercase tracking-wider">Télécharger sur</p>
                  <p className="text-base font-extrabold leading-tight">App Store</p>
                </div>
              </div>
              <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-brand-gold text-white text-[9px] font-extrabold uppercase tracking-wider shadow">
                Bientôt
              </span>
            </div>

            {/* Play Store */}
            <div className="relative group">
              <div className="flex items-center gap-4 bg-[#0A1120] text-white px-6 py-4 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 cursor-not-allowed opacity-80 hover:opacity-90 w-full sm:w-auto min-w-[200px]">
                <span className="text-3xl leading-none">▶</span>
                <div className="text-left">
                  <p className="text-[10px] text-white/60 font-medium uppercase tracking-wider">Disponible sur</p>
                  <p className="text-base font-extrabold leading-tight">Google Play</p>
                </div>
              </div>
              <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-brand-gold text-white text-[9px] font-extrabold uppercase tracking-wider shadow">
                Bientôt
              </span>
            </div>
          </div>

          <p className="text-xs text-text-tertiary font-medium">
            L'application est actuellement en phase de lancement. Suivez-nous pour être notifié dès la disponibilité.
          </p>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <footer className="mt-auto py-12 px-6 bg-app-surface-elevated border-t border-app-border/40 text-center text-text-secondary text-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-brand-gold flex items-center justify-center text-white text-xs font-black">
              ₣
            </div>
            <span className="font-extrabold text-[#0A1120]">Mastercota</span>
          </div>

          <p>© {new Date().getFullYear()} Mastercota. Tous droits réservés. Plus simple de cotiser.</p>

          <div className="flex gap-4">
            <a href="/cgu" className="hover:text-brand-blue transition-colors">CGU & Mentions</a>
            <span>•</span>
            <a href="mailto:support@mastercota.com" className="hover:text-brand-blue transition-colors">Support</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
