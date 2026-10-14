import React, { useState } from 'react';
import { 
  X, Check, Sparkles, CreditCard, Lock, ShieldCheck, 
  CheckCircle2, ArrowRight, Loader2, AlertCircle 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export const UpgradeModal: React.FC = () => {
  const { isUpgradeModalOpen, closeUpgradeModal, upgradeSuccess, user, openAuthModal } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple' | 'paypal'>('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('123');
  const [cardName, setCardName] = useState(user?.name || 'Jean Dupont');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isUpgradeModalOpen) return null;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!user) {
      closeUpgradeModal();
      openAuthModal('register');
      return;
    }

    setIsProcessing(true);

    try {
      const res = await api.upgradeToPremium(paymentMethod);
      if (res.success) {
        // Trigger celebratory confetti
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#A855F7', '#C084FC', '#FFFFFF', '#34D399'],
        });

        await upgradeSuccess();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Erreur lors du traitement de la transaction.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl bg-zinc-950 border border-zinc-800 shadow-2xl overflow-hidden">
        
        {/* Glow Header */}
        <div className="p-6 bg-gradient-to-b from-purple-900/40 via-purple-950/20 to-transparent border-b border-zinc-800/80">
          <button
            onClick={closeUpgradeModal}
            className="absolute top-5 right-5 p-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-purple-600/20 border border-purple-500/40 text-purple-300 text-xs font-bold w-fit mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Accès Immédiat Illimité
          </div>

          <h3 className="text-2xl font-black text-white tracking-tight">
            Passez à ScamCheck Premium
          </h3>
          <p className="text-xs text-zinc-300 mt-1">
            Sécurisez tous vos achats de seconde main sans restriction.
          </p>
        </div>

        {/* Plan summary badge */}
        <div className="px-6 py-4 bg-zinc-900/60 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-zinc-400">Abonnement Mensuel</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-3xl font-extrabold text-white">4,99 €</span>
              <span className="text-xs text-zinc-400">/ mois TTC</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
              Sans engagement
            </span>
            <p className="text-[10px] text-zinc-500 mt-1">Résiliable en 1 clic</p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handlePay} className="p-6 space-y-4">
          
          {/* Payment method selector */}
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                paymentMethod === 'card'
                  ? 'bg-purple-600/20 border-purple-500 text-purple-200'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              Carte CB / Visa
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('apple')}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                paymentMethod === 'apple'
                  ? 'bg-purple-600/20 border-purple-500 text-purple-200'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              Apple Pay
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('paypal')}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                paymentMethod === 'paypal'
                  ? 'bg-purple-600/20 border-purple-500 text-purple-200'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              PayPal
            </button>
          </div>

          {/* Card fields */}
          <div className="space-y-3 pt-1">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                Nom sur la carte
              </label>
              <input
                type="text"
                value={cardName}
                onChange={e => setCardName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                Numéro de carte bancaire (Simulation sécurisée)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={cardNumber}
                  onChange={e => setCardNumber(e.target.value)}
                  required
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs font-mono focus:border-purple-500 focus:outline-none"
                />
                <CreditCard className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Expiration
                </label>
                <input
                  type="text"
                  value={cardExpiry}
                  onChange={e => setCardExpiry(e.target.value)}
                  required
                  placeholder="MM/AA"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs font-mono focus:border-purple-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  CVC / CVV
                </label>
                <input
                  type="password"
                  value={cardCvc}
                  onChange={e => setCardCvc(e.target.value)}
                  maxLength={4}
                  required
                  placeholder="123"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs font-mono focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Guarantee pill */}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-zinc-400 text-[11px]">
            <Lock className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span>Paiement 256-bit SSL chiffré. Prêt pour Stripe / Passerelle de production.</span>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
              {errorMessage}
            </div>
          )}

          {/* Action button */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 transition-all glow-purple-sm"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Validation du paiement en cours...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Activer mon abonnement (4,99 €)</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer info note for reselling & tech architecture */}
        <div className="px-6 py-3 bg-zinc-950 border-t border-zinc-900 text-center">
          <p className="text-[10px] text-zinc-500">
            Architecture modulaire prête à être branchée sur les webhooks Stripe en production.
          </p>
        </div>

      </div>
    </div>
  );
};
