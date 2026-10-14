import React from 'react';
import { ShieldCheck, Heart, Lock, AlertTriangle, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: 'analyzer' | 'history' | 'pricing' | 'guide') => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="mt-20 border-t border-zinc-800 bg-[#09090b] text-zinc-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <div className="w-8 h-8 rounded-lg bg-purple-600/20 border border-purple-500/40 text-purple-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span>ScamCheck IA</span>
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed max-w-md">
              La plateforme de référence pour identifier les annonces frauduleuses, faux paiements et profils usurpés sur Vinted, eBay, Facebook Marketplace et Leboncoin grâce à l'intelligence artificielle.
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] text-zinc-500">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Données chiffrées • Clés API protégées côté serveur • Aucune télémétrie abusive</span>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => onSelectTab('analyzer')}
                  className="hover:text-purple-400 transition-colors"
                >
                  Analyser une annonce
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('history')}
                  className="hover:text-purple-400 transition-colors"
                >
                  Historique personnel
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('pricing')}
                  className="hover:text-purple-400 transition-colors"
                >
                  Formule Premium (4,99 €)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('guide')}
                  className="hover:text-purple-400 transition-colors"
                >
                  Guide anti-fraude 2026
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Platforms */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              Marketplaces supportées
            </h4>
            <ul className="space-y-1.5 text-xs text-zinc-400">
              <li>Vinted (France, Belgique, UE)</li>
              <li>eBay (Petites annonces & enchères)</li>
              <li>Facebook Marketplace</li>
              <li>Leboncoin & ParuVendu</li>
            </ul>
          </div>

        </div>

        {/* Disclaimer Notice */}
        <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80 mb-8 space-y-1.5">
          <div className="flex items-center gap-2 text-zinc-300 font-semibold text-xs">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Avertissement légal et déontologique</span>
          </div>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            ScamCheck IA est un outil indépendant d'aide à la décision qui fournit une estimation statistique de risque. Il n'est affilié à aucune des plateformes mentionnées. Le score de risque et les analyses ne constituent pas une garantie contractuelle ou légale absolue. Privilégiez systématiquement la remise en main propre ou le paiement sécurisé officiel.
          </p>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-zinc-900 text-[11px] text-zinc-500">
          <p>© {new Date().getFullYear()} ScamCheck IA. Tous droits réservés.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-zinc-300 cursor-pointer">Conditions Générales</span>
            <span>•</span>
            <span className="hover:text-zinc-300 cursor-pointer">Politique de Confidentialité</span>
            <span>•</span>
            <span className="hover:text-zinc-300 cursor-pointer">Mentions Légales</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
