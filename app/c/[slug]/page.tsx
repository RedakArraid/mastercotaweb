"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { 
  Shield, 
  Calendar, 
  Users, 
  Award, 
  Loader2, 
  AlertCircle,
  TrendingUp,
  CheckCircle,
  Copy,
  Smartphone,
  ChevronLeft,
  Info,
  DollarSign
} from "lucide-react";

// Types
import { Cotisation, Contribution } from "@/lib/supabase";

// Colors/Gradients to match the Flutter AppColors
const CARD_GRADIENTS = [
  ["from-[#1E3C72]", "to-[#2A5298]"], // Royal Blue
  ["from-[#3A6073]", "to-[#52788C]"], // Muted Teal
  ["from-[#4A00E0]", "to-[#8E2DE2]"], // Purple Indigo
  ["from-[#1F4037]", "to-[#387A65]"], // Emerald Pine
  ["from-[#0F2027]", "to-[#2C5364]"], // Slate Navy
  ["from-[#D38312]", "to-[#A83279]"], // Gold Magenta
  ["from-[#800080]", "to-[#FF007F]"], // Violet Rose
  ["from-[#13223F]", "to-[#1F355E]"], // Glass Navy
];

// Presets for West African region (FCFA)
const PRESET_AMOUNTS = [1000, 2000, 5000, 10000, 25000, 50000];

// Math calculations
const PAYSTACK_RATE = 0.015;
const PAYSTACK_CAP = 2000; // FCFA
const PLATFORM_RATE = 0.01;

function calcPaystackFee(gross: number): number {
  return Math.min(gross * PAYSTACK_RATE, PAYSTACK_CAP);
}

function calcPlatformFee(gross: number): number {
  return gross * PLATFORM_RATE;
}

function calcNet(gross: number): number {
  return gross - calcPaystackFee(gross) - calcPlatformFee(gross);
}

function grossFromNet(net: number): number {
  const threshold = PAYSTACK_CAP / PAYSTACK_RATE; // 133333 FCFA
  const gross1 = net / (1 - PAYSTACK_RATE - PLATFORM_RATE);
  if (gross1 < threshold) return gross1;
  return (net + PAYSTACK_CAP) / (1 - PLATFORM_RATE);
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

export default function CotisationPublicPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  // State
  const [cotisation, setCotisation] = useState<Cotisation | null>(null);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [modePay, setModePay] = useState<boolean>(true); // true = Gross (donor pays), false = Net (cagnotte receives)
  const [amountInput, setAmountInput] = useState<string>("");
  const [contributorName, setContributorName] = useState<string>("");
  const [contributorPhone, setContributorPhone] = useState<string>("");
  const [anonymous, setAnonymous] = useState<boolean>(false);
  
  // Payment Status State
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [paymentInitiated, setPaymentInitiated] = useState<boolean>(false);
  const [checkoutUrl, setCheckoutUrl] = useState<string>("");
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Fetch Cotisation and Contributions
  useEffect(() => {
    if (!slug) return;

    async function fetchInitialData() {
      try {
        setLoading(true);
        // 1. Fetch Cotisation by slug
        const { data: cotData, error: cotError } = await supabase
          .from("cotisations")
          .select("*")
          .eq("slug", slug)
          .maybeSingle();

        if (cotError) throw cotError;
        if (!cotData) {
          setCotisation(null);
          setLoading(false);
          return;
        }

        setCotisation(cotData as Cotisation);

        // 2. Fetch Contributions (only 'paid' status for public visibility)
        const { data: contrData, error: contrError } = await supabase
          .from("contributions")
          .select("*")
          .eq("cotisation_id", cotData.id)
          .eq("status", "paid")
          .order("created_at", { ascending: false });

        if (contrError) throw contrError;
        setContributions(contrData as Contribution[]);
        setLoading(false);

        // 3. Subscribe to Realtime Updates
        const cotisationChannel = supabase
          .channel(`public-cotisation-${cotData.id}`)
          .on(
            "postgres_changes",
            {
              event: "UPDATE",
              schema: "public",
              table: "cotisations",
              filter: `id=eq.${cotData.id}`,
            },
            (payload) => {
              setCotisation(payload.new as Cotisation);
            }
          )
          .subscribe();

        const contributionsChannel = supabase
          .channel(`public-contributions-${cotData.id}`)
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "contributions",
              filter: `cotisation_id=eq.${cotData.id}`,
            },
            async () => {
              // Re-fetch contributions list to ensure security policy compliance
              const { data: refetchedContr } = await supabase
                .from("contributions")
                .select("*")
                .eq("cotisation_id", cotData.id)
                .eq("status", "paid")
                .order("created_at", { ascending: false });
              
              if (refetchedContr) {
                setContributions(refetchedContr as Contribution[]);
              }
            }
          )
          .subscribe();

        return () => {
          supabase.removeChannel(cotisationChannel);
          supabase.removeChannel(contributionsChannel);
        };

      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.message || "Impossible de charger la cotisation.");
        setLoading(false);
      }
    }

    fetchInitialData();
  }, [slug]);

  // Calculations
  const calculatedFees = useMemo(() => {
    const rawVal = parseFloat(amountInput) || 0;
    if (rawVal <= 0) {
      return { gross: 0, net: 0, paystackFee: 0, platformFee: 0 };
    }

    if (modePay) {
      // Input is gross
      const paystackFee = calcPaystackFee(rawVal);
      const platformFee = calcPlatformFee(rawVal);
      const net = calcNet(rawVal);
      return { gross: rawVal, net, paystackFee, platformFee };
    } else {
      // Input is net
      const gross = grossFromNet(rawVal);
      const paystackFee = calcPaystackFee(gross);
      const platformFee = calcPlatformFee(gross);
      return { gross, net: rawVal, paystackFee, platformFee };
    }
  }, [amountInput, modePay]);

  // Preset click handler
  const handlePresetClick = (amount: number) => {
    setModePay(true); // Presets are gross payments
    setAmountInput(amount.toString());
  };

  // Payment Handler
  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cotisation) return;

    if (!amountInput || parseFloat(amountInput) <= 0) {
      alert("Veuillez entrer un montant valide.");
      return;
    }

    const minAmount = cotisation.settings?.min_amount || 0;
    const finalAmount = calculatedFees.gross;
    const netAmount = calculatedFees.net;

    if (minAmount > 0 && netAmount < minAmount) {
      alert(`Le montant net de contribution doit être d'au moins ${minAmount} FCFA.`);
      return;
    }

    if (!contributorPhone) {
      alert("Veuillez saisir votre numéro de téléphone.");
      return;
    }

    const name = anonymous ? "Anonyme" : (contributorName.trim() || "Anonyme");

    try {
      setSubmitting(true);
      // Invoke Paystack initialize supabase Edge Function
      const { data, error: fnError } = await supabase.functions.invoke("paystack-initialize", {
        body: {
          cotisation_id: cotisation.id,
          amount: finalAmount, // Gross amount sent to paystack
          contributor_name: name,
          contributor_phone: contributorPhone.trim(),
        },
      });

      if (fnError) throw fnError;
      if (!data || !data.authorization_url) {
        throw new Error("L'initialisation de la transaction a échoué.");
      }

      setCheckoutUrl(data.authorization_url);
      setPaymentInitiated(true);
      
      // Open Paystack Checkout url in a new tab
      window.open(data.authorization_url, "_blank");

    } catch (err: any) {
      console.error("Payment initialization error:", err);
      alert(`Erreur de paiement : ${err.message || "Une erreur inconnue est survenue."}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Copy share link
  const handleCopyLink = () => {
    const link = `${window.location.origin}/c/${slug}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Formatting helpers
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("fr-FR").format(Math.round(amount));
  };

  const getDaysRemaining = (deadlineStr: string) => {
    const deadline = new Date(deadlineStr);
    const today = new Date();
    // Reset hours to calculate precise days
    deadline.setHours(0,0,0,0);
    today.setHours(0,0,0,0);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Loading Screen
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F7FB]">
        <Loader2 className="w-10 h-10 text-brand-gold animate-spin mb-4" />
        <p className="text-text-secondary font-medium animate-pulse">Chargement de la cotisation...</p>
      </div>
    );
  }

  // Not Found Screen
  if (error || !cotisation) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F7FB] px-6 text-center">
        <AlertCircle className="w-16 h-16 text-error mb-4" />
        <h1 className="text-2xl font-black text-text-primary mb-2">Cotisation introuvable</h1>
        <p className="text-text-secondary max-w-md mb-8">
          Le lien que vous avez suivi est peut-être incorrect ou la cotisation a été supprimée par son créateur.
        </p>
        <button 
          onClick={() => router.push("/")}
          className="px-6 py-3 bg-brand-blue hover:bg-brand-blue-dark text-white font-semibold rounded-xl shadow-md transition-all flex items-center gap-2"
        >
          <ChevronLeft className="w-5 h-5" />
          Retour à l'accueil
        </button>
      </div>
    );
  }

  // Computed Values
  const gradient = CARD_GRADIENTS[hashCode(slug) % CARD_GRADIENTS.length];
  const daysLeft = getDaysRemaining(cotisation.deadline);
  
  // Progress Percent calculation
  const progressPercent = cotisation.target_amount > 0 
    ? Math.min((cotisation.current_amount / cotisation.target_amount) * 100, 100) 
    : 0;

  const isCompleted = cotisation.status === "completed" || progressPercent >= 100;
  const isClosed = cotisation.status === "closed" || (daysLeft < 0 && !isCompleted);
  const isActive = !isClosed && !isCompleted;

  // Best contributor computation
  const bestContributor = contributions.length > 0
    ? contributions.reduce((prev, current) => (prev.amount >= current.amount) ? prev : current)
    : null;

  return (
    <div className="min-h-screen bg-[#F5F7FB] text-[#0A1120] font-sans pb-20 selection:bg-brand-gold/30 selection:text-brand-gold-dark">
      
      {/* ── TOP NAV BAR ───────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-4 pt-6 pb-2">
        <button 
          onClick={() => router.push("/")}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-text-secondary hover:text-brand-blue hover:bg-white transition-all border border-transparent hover:border-app-border"
        >
          <ChevronLeft className="w-4 h-4" />
          Mastercota
        </button>
      </div>

      {/* ── MAIN CONTENT CONTAINER ────────────────────────────────── */}
      <main className="max-w-3xl mx-auto px-4 space-y-6">
        
        {/* ── HERO BANNER CARD ────────────────────────────────────── */}
        <div className={`rounded-3xl bg-gradient-to-br ${gradient[0]} ${gradient[1]} text-white p-6 md:p-8 relative overflow-hidden shadow-xl`}>
          {/* Decorative Background Circles */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/5 rounded-full pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full pointer-events-none" />

          <div className="space-y-6 relative z-10">
            <div className="flex items-center gap-2">
              <div className="px-3 py-1 rounded-full bg-white/20 border border-white/20 text-[10px] md:text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-ping" />
                Cagnotte Collective
              </div>
            </div>

            <div className="space-y-3">
              <h1 className="text-2xl md:text-4xl font-extrabold leading-tight tracking-tight">
                {cotisation.title}
              </h1>
              {cotisation.description && (
                <p className="text-white/85 text-sm md:text-base leading-relaxed font-normal max-w-2xl">
                  {cotisation.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── METRICS & PROGRESS SECTION ──────────────────────────── */}
        {cotisation.settings?.show_progress && (
          <div className="bg-white rounded-3xl p-6 border border-app-border shadow-sm space-y-5">
            <div className="flex justify-between items-end">
              <div>
                <span className="text-xs font-bold text-text-tertiary uppercase tracking-wider block mb-1">
                  Montant collecté
                </span>
                <span className="text-2xl md:text-3xl font-black text-brand-gold">
                  {formatMoney(cotisation.current_amount)} <span className="text-sm font-bold text-text-secondary">FCFA</span>
                </span>
              </div>

              {cotisation.settings?.show_target_amount && (
                <div className="text-right">
                  <span className="text-xs font-bold text-text-tertiary uppercase tracking-wider block mb-1">
                    Objectif cible
                  </span>
                  <span className="text-lg md:text-xl font-bold text-text-primary">
                    {formatMoney(cotisation.target_amount)} <span className="text-xs font-semibold text-text-secondary">FCFA</span>
                  </span>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="w-full bg-app-border-light h-3.5 rounded-full overflow-hidden border border-app-border/40">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r ${isCompleted ? "from-success to-emerald-400" : "from-brand-gold to-amber-500"}`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-xs font-bold text-text-secondary">
                <span>{progressPercent.toFixed(0)}% de l'objectif</span>
                
                {isCompleted ? (
                  <span className="text-success flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Objectif atteint ! 🎉
                  </span>
                ) : isClosed ? (
                  <span className="text-error">Clôturée</span>
                ) : (
                  <span className="flex items-center gap-1 font-semibold text-text-secondary">
                    <Calendar className="w-3.5 h-3.5 text-text-tertiary" />
                    {daysLeft > 0 ? `${daysLeft} jour${daysLeft > 1 ? "s" : ""} restant${daysLeft > 1 ? "s" : ""}` : "Dernier jour"}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── BEST CONTRIBUTOR CARD ──────────────────────────────── */}
        {cotisation.settings?.show_best_contributor && bestContributor && (
          <div className="bg-gradient-to-br from-amber-50/50 to-orange-50/30 rounded-3xl p-5 border border-amber-200/60 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-200/50 flex items-center justify-center text-2xl shadow-inner">
              🏆
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-brand-gold-dark uppercase tracking-wider block mb-0.5">
                Meilleur contributeur
              </span>
              <span className="font-extrabold text-text-primary text-base block truncate">
                {bestContributor.contributor_name || "Anonyme"}
              </span>
            </div>
            <div className="text-right">
              <span className="text-sm font-black text-brand-gold-dark">
                {formatMoney(bestContributor.amount)} FCFA
              </span>
            </div>
          </div>
        )}

        {/* ── RECENT CONTRIBUTORS PREVIEW ────────────────────────── */}
        {cotisation.settings?.show_contributors && contributions.length > 0 && (
          <div className="bg-white rounded-3xl p-6 border border-app-border shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-app-border/40 pb-3">
              <Users className="w-5 h-5 text-brand-blue" />
              <h3 className="font-extrabold text-text-primary text-base">
                Contributeurs ({contributions.length})
              </h3>
            </div>

            <div className="divide-y divide-app-border/40">
              {contributions.slice(0, 5).map((contr, idx) => {
                const initial = contr.contributor_name ? contr.contributor_name[0].toUpperCase() : "?";
                const gradIndex = hashCode(contr.contributor_name || "") % CARD_GRADIENTS.length;
                const grad = CARD_GRADIENTS[gradIndex];

                return (
                  <div key={contr.id} className={`flex items-center justify-between py-3 ${idx === 0 ? "pt-0" : ""}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${grad[0]} ${grad[1]} flex items-center justify-center text-white text-sm font-extrabold shadow-sm`}>
                        {initial}
                      </div>
                      <div>
                        <span className="font-bold text-text-primary text-sm block">
                          {contr.contributor_name || "Anonyme"}
                        </span>
                        <span className="text-[10px] text-text-tertiary">
                          {new Date(contr.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    </div>
                    <div className="text-right font-bold text-sm text-text-primary">
                      {formatMoney(contr.amount)} FCFA
                    </div>
                  </div>
                );
              })}
            </div>

            {contributions.length > 5 && (
              <p className="text-xs text-text-tertiary font-semibold pt-1">
                + {contributions.length - 5} autre{contributions.length - 5 > 1 ? "s" : ""} contributeur{contributions.length - 5 > 1 ? "s" : ""}...
              </p>
            )}
          </div>
        )}

        {/* ── DONATION PAYMENT FORM ──────────────────────────────── */}
        {isActive ? (
          <div className="bg-white rounded-3xl border border-app-border shadow-sm overflow-hidden">
            
            {/* Header */}
            <div className="bg-app-surface-elevated px-6 py-4 border-b border-app-border flex items-center gap-3">
              <Shield className="w-5 h-5 text-success" />
              <div>
                <h3 className="font-extrabold text-text-primary text-base">Faire une contribution</h3>
                <span className="text-[10px] font-semibold text-text-secondary block">Transactions sécurisées par Paystack</span>
              </div>
            </div>

            {paymentInitiated ? (
              /* Payment Pending Screen */
              <div className="p-8 text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-brand-gold/10 text-brand-gold flex items-center justify-center mx-auto animate-bounce">
                  ⚡
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-extrabold text-text-primary">Paiement Initialisé</h4>
                  <p className="text-sm text-text-secondary max-w-md mx-auto leading-relaxed">
                    Une page de paiement Paystack a été ouverte dans un nouvel onglet. Veuillez y compléter votre paiement Mobile Money ou Carte Bancaire.
                  </p>
                </div>

                <div className="flex flex-col gap-3 max-w-xs mx-auto">
                  <a 
                    href={checkoutUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="py-3.5 bg-brand-gold hover:bg-brand-gold-dark text-white font-bold rounded-2xl shadow-md hover:shadow-lg transition-all text-sm block"
                  >
                    Ouvrir la page de paiement
                  </a>
                  <button 
                    onClick={() => setPaymentInitiated(false)}
                    className="py-3 border border-app-border hover:bg-app-surface-elevated text-text-primary font-bold rounded-2xl transition-all text-xs"
                  >
                    Retourner au formulaire
                  </button>
                </div>
              </div>
            ) : (
              /* Input Form */
              <form onSubmit={handlePay} className="p-6 space-y-6">
                
                {/* 1. Mode Switcher (Gross vs Net) */}
                <div className="p-1.5 bg-app-border-light rounded-2xl flex gap-1 border border-app-border/40">
                  <button
                    type="button"
                    onClick={() => setModePay(true)}
                    className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${modePay ? "bg-white text-text-primary shadow-sm" : "text-text-secondary hover:text-text-primary"}`}
                  >
                    Je saisis ce que je paie
                  </button>
                  <button
                    type="button"
                    onClick={() => setModePay(false)}
                    className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${!modePay ? "bg-white text-text-primary shadow-sm" : "text-text-secondary hover:text-text-primary"}`}
                  >
                    La cagnotte doit recevoir
                  </button>
                </div>

                {/* 2. Amount Input & Presets */}
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wider block mb-2">
                      Montant {modePay ? "brut" : "net souhaité"} (FCFA)
                    </label>
                    <div className="relative rounded-2xl border border-app-border bg-app-surface focus-within:border-brand-gold focus-within:ring-2 focus-within:ring-brand-gold/20 transition-all">
                      <input
                        type="number"
                        placeholder="0"
                        min="100"
                        value={amountInput}
                        onChange={(e) => setAmountInput(e.target.value)}
                        className="w-full pl-6 pr-16 py-4 bg-transparent outline-none font-bold text-lg text-text-primary"
                        required
                      />
                      <span className="absolute right-6 top-1/2 -translate-y-1/2 text-sm font-bold text-text-tertiary">
                        FCFA
                      </span>
                    </div>
                  </div>

                  {/* Presets */}
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {PRESET_AMOUNTS.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => handlePresetClick(preset)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all ${amountInput === preset.toString() && modePay ? "bg-brand-gold border-brand-gold text-white shadow-md shadow-brand-gold/15" : "bg-white border-app-border text-text-secondary hover:border-text-tertiary"}`}
                      >
                        +{formatMoney(preset)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Contributor Name & Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wider flex justify-between items-center mb-2">
                      Nom complet
                      {cotisation.settings?.anonymous_allowed && (
                        <label className="inline-flex items-center gap-1 text-[10px] font-semibold text-text-tertiary cursor-pointer lowercase normal-case">
                          <input
                            type="checkbox"
                            checked={anonymous}
                            onChange={(e) => setAnonymous(e.target.checked)}
                            className="rounded border-app-border text-brand-gold focus:ring-brand-gold/40 cursor-pointer"
                          />
                          Anonyme
                        </label>
                      )}
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Kouamé Koffi"
                      value={contributorName}
                      onChange={(e) => setContributorName(e.target.value)}
                      disabled={anonymous}
                      className="w-full px-5 py-3.5 rounded-2xl border border-app-border bg-app-surface disabled:bg-app-border-light disabled:text-text-tertiary focus:outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 transition-all text-sm font-semibold text-text-primary"
                      required={!anonymous}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wider block mb-2">
                      Numéro Mobile Money
                    </label>
                    <input
                      type="tel"
                      placeholder="Ex: 0707070707"
                      value={contributorPhone}
                      onChange={(e) => setContributorPhone(e.target.value)}
                      className="w-full px-5 py-3.5 rounded-2xl border border-app-border bg-app-surface focus:outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 transition-all text-sm font-semibold text-text-primary"
                      required
                    />
                  </div>
                </div>

                {/* 4. Live Calculations Panel */}
                {parseFloat(amountInput) > 0 && (
                  <div className="bg-app-surface-elevated rounded-2xl p-5 border border-app-border/60 space-y-3">
                    <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-app-border/40 pb-2">
                      Détails de la transaction
                    </h4>
                    
                    <div className="space-y-2 text-xs font-medium">
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Montant facturé (Payé par vous)</span>
                        <span className="font-bold text-text-primary">{formatMoney(calculatedFees.gross)} FCFA</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Frais réseau Mobile Money (Paystack 1.5%)</span>
                        <span className="font-bold text-text-primary">-{formatMoney(calculatedFees.paystackFee)} FCFA</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Frais plate-forme (Mastercota 1.0%)</span>
                        <span className="font-bold text-text-primary">-{formatMoney(calculatedFees.platformFee)} FCFA</span>
                      </div>
                      
                      <div className="h-[1px] bg-app-border/40 my-1" />
                      
                      <div className="flex justify-between text-sm font-bold">
                        <span className="text-text-primary">Montant net versé à la cagnotte</span>
                        <span className="text-brand-gold font-extrabold">{formatMoney(calculatedFees.net)} FCFA</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-gradient-to-r from-brand-gold to-brand-gold-dark disabled:from-brand-gold/60 disabled:to-brand-gold-dark/60 text-white font-extrabold rounded-2xl shadow-lg shadow-brand-gold/10 hover:shadow-xl hover:shadow-brand-gold/20 transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2 text-base cursor-pointer disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Initialisation du paiement...
                    </>
                  ) : (
                    <>
                      Contribuer {parseFloat(amountInput) > 0 ? `${formatMoney(calculatedFees.gross)} F` : ""}
                    </>
                  )}
                </button>

              </form>
            )}

          </div>
        ) : (
          /* Closed banner */
          <div className="bg-app-border-light rounded-3xl p-8 border border-app-border/60 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-app-border text-text-tertiary flex items-center justify-center text-lg mx-auto">
              🔒
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-text-primary text-base">Cotisation fermée</h4>
              <p className="text-xs text-text-secondary max-w-sm mx-auto leading-normal">
                Cette cotisation est clôturée ou a expiré. Plus aucune contribution ne peut y être effectuée.
              </p>
            </div>
          </div>
        )}

        {/* ── SHARE & ACTION CARD ────────────────────────────────── */}
        <div className="bg-white rounded-3xl p-6 border border-app-border shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left w-full sm:w-auto">
            <span className="text-xs font-bold text-text-tertiary uppercase tracking-wider block mb-1">
              Lien de partage
            </span>
            <span className="font-bold text-brand-blue text-sm block truncate max-w-xs sm:max-w-md">
              mastercota.com/c/{slug}
            </span>
          </div>

          <button
            onClick={handleCopyLink}
            className="w-full sm:w-auto px-5 py-3 border border-brand-blue/30 bg-brand-blue/5 hover:bg-brand-blue/10 text-brand-blue font-bold rounded-2xl transition-all flex items-center justify-center gap-2 text-xs"
          >
            <Copy className="w-4 h-4" />
            {copiedLink ? "Copié !" : "Copier le lien"}
          </button>
        </div>

      </main>

      {/* ── APP DOWNLOAD CALLOUT FOOTER ───────────────────────────── */}
      <footer className="max-w-3xl mx-auto px-4 mt-16 text-center space-y-6">
        <div className="bg-[#0A1120] text-white rounded-3xl p-8 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="absolute top-0 right-0 w-36 h-36 bg-white/5 rounded-full pointer-events-none" />
          
          <div className="text-left space-y-2 max-w-md">
            <h4 className="font-bold text-lg">Vous aussi, créez votre propre cagnotte !</h4>
            <p className="text-white/60 text-xs leading-normal">
              Téléchargez l'application mobile Mastercota pour créer, paramétrer et gérer vos cotisations directement depuis votre smartphone.
            </p>
          </div>

          <button className="px-6 py-3.5 bg-brand-gold hover:bg-brand-gold-dark text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-brand-gold/15 whitespace-nowrap">
            <Smartphone className="w-4.5 h-4.5" />
            Télécharger Mastercota
          </button>
        </div>

        <p className="text-[10px] text-text-tertiary font-medium">
          Propulsé par Mastercota — Plus simple de cotiser.
        </p>
      </footer>

    </div>
  );
}
