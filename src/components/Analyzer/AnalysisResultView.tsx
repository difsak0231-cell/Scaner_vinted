import React, { useState } from 'react';
import { 
  ShieldCheck, AlertTriangle, CheckCircle, Info, Copy, Check, Download, 
  ArrowLeft, ExternalLink, ShieldAlert, FileText, CheckSquare, Square, 
  DollarSign, MessageSquare, AlertCircle, Sparkles
} from 'lucide-react';
import { AnalysisRecord, RiskLevel } from '../../types';

interface AnalysisResultViewProps {
  analysis: AnalysisRecord;
  confidenceScore?: number;
  limitationsDisclaimer?: string;
  onNewAnalysis: () => void;
  onOpenUpgrade?: () => void;
}

export const AnalysisResultView: React.FC<AnalysisResultViewProps> = ({
  analysis,
  confidenceScore = 88,
  limitationsDisclaimer,
  onNewAnalysis,
  onOpenUpgrade,
}) => {
  const [copied, setCopied] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  const toggleCheck = (idx: number) => {
    setCheckedItems(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const getScoreTheme = (score: number, level: RiskLevel) => {
    if (score >= 70 || level === 'ELEVE') {
      return {
        badgeBg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
        textColor: 'text-rose-400',
        strokeColor: '#F43F5E',
        bgColor: 'bg-rose-950/20',
        borderColor: 'border-rose-500/30',
        glowClass: 'glow-red',
        label: 'Risque Élevé',
        subtext: 'Forte probabilité d\'arnaque ou tentative de fraude',
        icon: ShieldAlert,
      };
    }
    if (score >= 30 || level === 'MOYEN') {
      return {
        badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        textColor: 'text-amber-400',
        strokeColor: '#F59E0B',
        bgColor: 'bg-amber-950/20',
        borderColor: 'border-amber-500/30',
        glowClass: 'glow-amber',
        label: 'Risque Moyen',
        subtext: 'Anomalies suspectes ou garanties insuffisantes',
        icon: AlertTriangle,
      };
    }
    return {
      badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      textColor: 'text-emerald-400',
      strokeColor: '#10B981',
      bgColor: 'bg-emerald-950/20',
      borderColor: 'border-emerald-500/30',
      glowClass: 'glow-green',
      label: 'Risque Faible',
      subtext: 'Annonce globalement cohérente, vigilance normale',
      icon: ShieldCheck,
    };
  };

  const theme = getScoreTheme(analysis.riskScore, analysis.riskLevel);
  const IconComponent = theme.icon;

  const handleCopySummary = () => {
    const text = `Rapport ScamCheck IA pour "${analysis.title}" (${analysis.platform}) :
Score de risque : ${analysis.riskScore}/100 (${theme.label})
Synthèse : ${analysis.summary}
Conseil : Utilisez toujours le système de paiement officiel.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top action bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <button
          onClick={onNewAnalysis}
          className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Analyser une autre annonce
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopySummary}
            className="px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-medium text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Résumé copié !' : 'Copier le résumé'}</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-medium text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Imprimer / PDF</span>
          </button>
        </div>
      </div>

      {/* Main Score & Risk Banner Card */}
      <div className={`p-6 sm:p-8 rounded-3xl border ${theme.borderColor} ${theme.bgColor} backdrop-blur-sm relative overflow-hidden shadow-2xl`}>
        <div className="flex flex-col md:flex-row items-center gap-8">
          
          {/* Circular Score Gauge */}
          <div className="relative flex-shrink-0 flex items-center justify-center">
            <svg className="w-36 h-36 transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="58"
                stroke="currentColor"
                strokeWidth="10"
                className="text-zinc-800/80"
                fill="transparent"
              />
              <circle
                cx="72"
                cy="72"
                r="58"
                stroke={theme.strokeColor}
                strokeWidth="10"
                strokeDasharray={364}
                strokeDashoffset={364 - (364 * analysis.riskScore) / 100}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className={`text-4xl font-extrabold ${theme.textColor}`}>
                {analysis.riskScore}
              </span>
              <span className="text-[11px] text-zinc-400 uppercase tracking-widest font-semibold">
                sur 100
              </span>
            </div>
          </div>

          {/* Details & Assessment */}
          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${theme.badgeBg}`}>
                <IconComponent className="w-4 h-4" />
                {theme.label}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-zinc-900 border border-zinc-800 text-zinc-300">
                Plateforme : {analysis.platform}
              </span>
              {analysis.claimedPrice && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-zinc-900 border border-zinc-800 text-zinc-300">
                  Prix : {analysis.claimedPrice}
                </span>
              )}
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-950/40 border border-purple-500/20 text-purple-300">
                Précision IA : {confidenceScore}%
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {analysis.title}
            </h2>

            <p className="text-zinc-300 text-sm leading-relaxed bg-zinc-950/40 p-4 rounded-2xl border border-zinc-800/60">
              {analysis.summary}
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Detected Red Flags / Elements */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-purple-400" />
            Éléments suspects et signaux d'alerte détectés
          </h3>
          <span className="text-xs text-zinc-400">
            {analysis.flags.length} signal{analysis.flags.length > 1 ? 'ux' : ''} répertorié{analysis.flags.length > 1 ? 's' : ''}
          </span>
        </div>

        {analysis.flags.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysis.flags.map(flag => (
              <div
                key={flag.id}
                className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 hover:border-zinc-700 transition-all flex flex-col justify-between space-y-2"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-600/20 border border-purple-500/30 text-purple-300">
                      {flag.category}
                    </span>
                    <h4 className="text-sm font-semibold text-white">{flag.title}</h4>
                  </div>
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                      flag.severity === 'HIGH'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : flag.severity === 'MEDIUM'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}
                  >
                    {flag.severity === 'HIGH' ? 'Critique' : flag.severity === 'MEDIUM' ? 'Important' : 'Mineur'}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {flag.description}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800 text-sm text-zinc-400">
            Aucun signal d'arnaque majeur explicite détecté dans les éléments fournis.
          </div>
        )}
      </div>

      {/* Seller Chat Analysis (if present) */}
      {analysis.chatInsights && (
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
          <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
            <MessageSquare className="w-4 h-4" />
            Analyse psychologique des messages échangés
          </div>
          <p className="text-sm text-zinc-300 leading-relaxed">
            {analysis.chatInsights}
          </p>
        </div>
      )}

      {/* Concrete Checklist & Safety recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Interactive Safety Checklist */}
        <div className="p-6 rounded-3xl bg-zinc-900/50 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-purple-400" />
              Checklist de vérification à cocher
            </h3>
            <span className="text-[11px] text-zinc-400">
              Avant de verser le moindre euro
            </span>
          </div>

          <div className="space-y-3">
            {analysis.safetyChecklist.map((check, idx) => (
              <div
                key={idx}
                onClick={() => toggleCheck(idx)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                  checkedItems[idx]
                    ? 'bg-purple-950/20 border-purple-500/40 text-purple-200'
                    : 'bg-zinc-900/80 border-zinc-800/80 text-zinc-300 hover:border-zinc-700'
                }`}
              >
                <div className="mt-0.5 flex-shrink-0">
                  {checkedItems[idx] ? (
                    <CheckSquare className="w-4 h-4 text-purple-400" />
                  ) : (
                    <Square className="w-4 h-4 text-zinc-500" />
                  )}
                </div>
                <div className="text-xs">
                  <p className={`font-semibold ${checkedItems[idx] ? 'line-through text-zinc-400' : 'text-zinc-200'}`}>
                    {check.item}
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    {check.tip}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actionable Recommendations */}
        <div className="p-6 rounded-3xl bg-zinc-900/50 border border-zinc-800 space-y-4">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            Conseils pour acheter en toute sécurité
          </h3>

          <ul className="space-y-3">
            {analysis.recommendations.map((rec, idx) => (
              <li
                key={idx}
                className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800/80 text-xs text-zinc-300 flex items-start gap-2.5"
              >
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-[10px]">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{rec}</span>
              </li>
            ))}
          </ul>

          {/* Positive points if any */}
          {analysis.positivePoints && analysis.positivePoints.length > 0 && (
            <div className="pt-2 border-t border-zinc-800">
              <p className="text-xs font-semibold text-zinc-400 mb-2">Points positifs identifiés :</p>
              <div className="flex flex-wrap gap-1.5">
                {analysis.positivePoints.map((pt, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 flex items-center gap-1"
                  >
                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                    {pt}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Mandatory Limitations & Ethical Disclaimer */}
      <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 flex items-start gap-3">
        <Info className="w-5 h-5 text-zinc-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-zinc-400 space-y-1">
          <p className="font-semibold text-zinc-300">Avis de non-responsabilité et limites de l'IA</p>
          <p className="leading-relaxed">
            {limitationsDisclaimer || analysis.summary} ScamCheck IA analyse les schémas textuels, visuels et comportementaux pour fournir un indice probabiliste. Cette évaluation ne garantit en aucun cas qu'une transaction est totalement dépourvue de risque. N'achetez jamais si vous ressentez le moindre doute.
          </p>
        </div>
      </div>
    </div>
  );
};
