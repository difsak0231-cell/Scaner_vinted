import React from 'react';
import { ShieldCheck, ArrowRight, AlertTriangle, Sparkles, CheckCircle2, Lock, Eye, ShoppingCart } from 'lucide-react';

interface HeroProps {
  onStartAnalysis: () => void;
  onSelectSample: (sampleType: 'iphone' | 'sneakers' | 'safe') => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartAnalysis, onSelectSample }) => {
  return (
    <section className="relative pt-10 pb-16 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-purple-600/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[300px] h-[200px] bg-indigo-600/10 blur-[90px] rounded-full pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Marketplace pills banner */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-6 shadow-lg shadow-purple-900/10">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>Compatible Vinted, eBay, Facebook Marketplace & Leboncoin</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6">
          Vérifie avant d'acheter.
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-zinc-300 font-normal leading-relaxed mb-8">
          L'intelligence artificielle spécialisée qui analyse vos annonces, captures d'écran et messages de vendeurs pour détecter les arnaques, fausses preuves et paiements piégés.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <button
            onClick={onStartAnalysis}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-base tracking-wide flex items-center justify-center gap-3 shadow-xl shadow-purple-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] glow-purple"
          >
            <ShieldCheck className="w-5 h-5 text-white" />
            <span>Analyser une annonce</span>
            <ArrowRight className="w-4 h-4 text-purple-200" />
          </button>

          <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            3 analyses gratuites par jour sans carte bancaire
          </div>
        </div>

        {/* Quick Sample Selector */}
        <div className="pt-6 border-t border-zinc-800/80">
          <p className="text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-3">
            Ou essayez instantanément avec un exemple réel :
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <button
              onClick={() => onSelectSample('iphone')}
              className="px-3.5 py-2 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-rose-500/40 text-xs text-zinc-200 flex items-center gap-2 transition-all group"
            >
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>Arnaque iPhone 15 Pro (Paylib & WhatsApp)</span>
              <span className="text-[10px] text-rose-400 font-bold group-hover:underline">Tester</span>
            </button>

            <button
              onClick={() => onSelectSample('sneakers')}
              className="px-3.5 py-2 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-amber-500/40 text-xs text-zinc-200 flex items-center gap-2 transition-all group"
            >
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Sneakers Jordan 4 (Faux reçu & Paypal Proches)</span>
              <span className="text-[10px] text-amber-400 font-bold group-hover:underline">Tester</span>
            </button>

            <button
              onClick={() => onSelectSample('safe')}
              className="px-3.5 py-2 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-emerald-500/40 text-xs text-zinc-200 flex items-center gap-2 transition-all group"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Annonce Sûre (Vendeur Vinted conforme)</span>
              <span className="text-[10px] text-emerald-400 font-bold group-hover:underline">Tester</span>
            </button>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-zinc-900 text-left">
          <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/60">
            <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm mb-1">
              <Lock className="w-4 h-4" />
              Anti-Paiements Piégés
            </div>
            <p className="text-xs text-zinc-400">
              Détecte Paylib, fausses confirmations de virement, coupons et liens frauduleux.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/60">
            <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm mb-1">
              <Eye className="w-4 h-4" />
              Analyse Visuelle IA
            </div>
            <p className="text-xs text-zinc-400">
              Scanne les photos et captures de chat pour repérer les incohérences graphiques.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/60">
            <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm mb-1">
              <AlertTriangle className="w-4 h-4" />
              Score de 0 à 100
            </div>
            <p className="text-xs text-zinc-400">
              Un indice de risque clair, ventilé par catégories d'alertes avec conseils pratiques.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/60">
            <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm mb-1">
              <CheckCircle2 className="w-4 h-4" />
              Checklist Sécurité
            </div>
            <p className="text-xs text-zinc-400">
              Les questions pièges à poser et les réflexes d'autodéfense avant de payer.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
