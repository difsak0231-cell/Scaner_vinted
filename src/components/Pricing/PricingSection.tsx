import React from 'react';
import { 
  Check, Sparkles, ShieldCheck, Zap, HelpCircle, 
  ArrowRight, CreditCard, Lock, CheckCircle2, ChevronRight, Code 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface PricingSectionProps {
  onGoToAnalyzer: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onGoToAnalyzer }) => {
  const { user, openUpgradeModal, openAuthModal } = useAuth();
  const isPremium = user?.plan === 'premium';

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-600/15 border border-purple-500/30 text-purple-300 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          Tarifs Simples & Transparents
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Investissez 4,99 € pour éviter de perdre des centaines d'euros.
        </h2>
        <p className="text-base text-zinc-400">
          Une seule arnaque évitée rembourse des années d'abonnement. Commencez gratuitement ou débloquez la puissance illimitée.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
        
        {/* FREE PLAN */}
        <div className="p-8 rounded-3xl bg-zinc-950/70 border border-zinc-800 flex flex-col justify-between hover:border-zinc-700 transition-all shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-zinc-800 text-zinc-300 border border-zinc-700">
                Formule Découverte
              </span>
              <span className="text-xs text-zinc-500">Sans carte bancaire</span>
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">Gratuit</h3>
            <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
              Idéal pour une vérification ponctuelle avant d'acheter un vêtement ou un objet du quotidien.
            </p>

            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-4xl font-extrabold text-white">0 €</span>
              <span className="text-xs text-zinc-500">/ toujours gratuit</span>
            </div>

            <ul className="space-y-3.5 text-xs text-zinc-300">
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span><strong>3 analyses complètes par jour</strong></span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Détection des arnaques de paiement (Paylib, faux virements)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Score de risque instantané de 0 à 100</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Checklist de sécurité de base</span>
              </li>
              <li className="flex items-center gap-2.5 text-zinc-500">
                <span className="w-4 h-4 rounded-full border border-zinc-700 flex items-center justify-center text-[10px]">✕</span>
                <span className="line-through">Analyses illimitées</span>
              </li>
              <li className="flex items-center gap-2.5 text-zinc-500">
                <span className="w-4 h-4 rounded-full border border-zinc-700 flex items-center justify-center text-[10px]">✕</span>
                <span className="line-through">Analyse multimodale des captures d'écran</span>
              </li>
            </ul>
          </div>

          <div className="pt-8">
            <button
              onClick={onGoToAnalyzer}
              className="w-full py-3.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs border border-zinc-700 transition-all text-center block"
            >
              Commencer gratuitement (3/jour)
            </button>
          </div>
        </div>

        {/* PREMIUM PLAN */}
        <div className="relative p-8 rounded-3xl bg-gradient-to-b from-purple-950/40 via-zinc-950 to-zinc-950 border-2 border-purple-500 shadow-2xl flex flex-col justify-between glow-purple">
          {/* Badge */}
          <div className="absolute -top-3.5 right-8 px-4 py-1 rounded-full bg-purple-600 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-purple-600/40">
            Recommandé
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                Formule Protection Totale
              </span>
              <span className="text-xs text-purple-400 font-semibold">Sans engagement</span>
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">ScamCheck Premium</h3>
            <p className="text-xs text-zinc-300 mb-6 leading-relaxed">
              Pour les acheteurs réguliers, les collectionneurs et toute personne achetant des produits high-tech ou de valeur.
            </p>

            <div className="flex items-baseline gap-1.5 mb-8">
              <span className="text-5xl font-black text-white">4,99 €</span>
              <span className="text-xs text-zinc-400">/ mois TTC</span>
            </div>

            <ul className="space-y-3.5 text-xs text-zinc-200">
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <span><strong>Analyses illimitées 24h/24 et 7j/7</strong></span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <span><strong>Vision IA multimodale</strong> (captures d'écran, faux reçus, photos)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <span><strong>Analyse psychologique</strong> des messages de vendeurs (pression, urgence)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <span>Rapports anti-fraude téléchargeables et exportables (dossier litige)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <span>Historique cloud sauvegardé sans limite de temps</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <span>Mises à jour prioritaires des nouveaux scénarios de piratage</span>
              </li>
            </ul>
          </div>

          <div className="pt-8">
            {isPremium ? (
              <div className="w-full py-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-center font-bold text-xs">
                ✓ Vous êtes déjà membre Premium
              </div>
            ) : (
              <button
                onClick={user ? openUpgradeModal : () => openAuthModal('register')}
                className="w-full py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs tracking-wide shadow-xl shadow-purple-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>S'abonner à 4,99 € / mois</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Monétisation & FAQ */}
      <div className="max-w-3xl mx-auto space-y-6 pt-10 border-t border-zinc-800">
        <h3 className="text-xl font-bold text-white text-center mb-6">
          Questions fréquentes sur l'abonnement
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 space-y-1.5">
            <h4 className="font-bold text-white">Comment fonctionne le quota gratuit ?</h4>
            <p className="text-zinc-400 leading-relaxed">
              Chaque utilisateur ou visiteur bénéficie de 3 analyses gratuites chaque jour, réinitialisées à minuit. Aucun moyen de paiement n'est exigé.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 space-y-1.5">
            <h4 className="font-bold text-white">Puis-je résilier à tout moment ?</h4>
            <p className="text-zinc-400 leading-relaxed">
              Oui, l'offre est 100% sans engagement. Vous pouvez stopper votre abonnement en un clic depuis votre espace membre sans préavis.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 space-y-1.5">
            <h4 className="font-bold text-white">Quels sont les moyens de paiement acceptés ?</h4>
            <p className="text-zinc-400 leading-relaxed">
              Carte bancaire (Visa, Mastercard, CB), Apple Pay et PayPal. Les transactions sont sécurisées par chiffrement bancaire 256 bits.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 space-y-1.5">
            <h4 className="font-bold text-white">ScamCheck IA garantit-il le risque zéro ?</h4>
            <p className="text-zinc-400 leading-relaxed">
              L'IA calcule une probabilité statistique de risque basée sur des milliers de signaux d'arnaques répertoriés. Elle constitue une aide à la décision, mais ne remplace pas votre vigilance.
            </p>
          </div>
        </div>

        {/* Resale & Buyer Readiness architecture block */}
        <div className="p-5 rounded-2xl bg-zinc-950 border border-purple-500/20 text-xs space-y-2 mt-8">
          <div className="flex items-center gap-2 text-purple-400 font-bold">
            <Code className="w-4 h-4" />
            <span>Architecture technique SaaS & Revente clé en main</span>
          </div>
          <p className="text-zinc-400 leading-relaxed">
            Ce logiciel a été développé selon une architecture découplée Express + React + Gemini AI, intégrant une base de données autonome, un module de quotas journaliers et des routes prêtes pour brancher directement des webhooks Stripe (`STRIPE_SECRET_KEY`) ou Supabase/PostgreSQL. Un repreneur peut déployer et monétiser l'application immédiatement.
          </p>
        </div>

      </div>
    </section>
  );
};
