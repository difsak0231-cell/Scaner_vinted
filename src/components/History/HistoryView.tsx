import React, { useState, useEffect } from 'react';
import { 
  History, Search, Filter, ShieldCheck, ShieldAlert, AlertTriangle, 
  Trash2, Eye, Calendar, ArrowRight, Sparkles, ExternalLink, RefreshCw 
} from 'lucide-react';
import { AnalysisRecord, Platform, RiskLevel } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { AnalysisResultView } from '../Analyzer/AnalysisResultView';

interface HistoryViewProps {
  onGoToAnalyzer: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ onGoToAnalyzer }) => {
  const { user, openAuthModal } = useAuth();
  const [history, setHistory] = useState<AnalysisRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('ALL');
  const [selectedRisk, setSelectedRisk] = useState<string>('ALL');
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisRecord | null>(null);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await api.getHistory();
      setHistory(data);
    } catch (err) {
      console.error('Error fetching history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Voulez-vous supprimer cette analyse de votre historique ?')) return;

    try {
      await api.deleteHistory(id);
      setHistory(prev => prev.filter(item => item.id !== id));
      if (selectedAnalysis?.id === id) {
        setSelectedAnalysis(null);
      }
    } catch (err) {
      console.error('Error deleting analysis:', err);
    }
  };

  const filteredHistory = history.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.claimedPrice && item.claimedPrice.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesPlatform = selectedPlatform === 'ALL' || item.platform === selectedPlatform;
    const matchesRisk = selectedRisk === 'ALL' || item.riskLevel === selectedRisk;

    return matchesSearch && matchesPlatform && matchesRisk;
  });

  const getRiskBadge = (level: RiskLevel, score: number) => {
    if (level === 'ELEVE' || score >= 70) {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center gap-1">
          <ShieldAlert className="w-3.5 h-3.5" />
          Risque Élevé ({score}/100)
        </span>
      );
    }
    if (level === 'MOYEN' || score >= 30) {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1">
          <AlertTriangle className="w-3.5 h-3.5" />
          Risque Moyen ({score}/100)
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
        <ShieldCheck className="w-3.5 h-3.5" />
        Risque Faible ({score}/100)
      </span>
    );
  };

  if (selectedAnalysis) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <AnalysisResultView
          analysis={selectedAnalysis}
          onNewAnalysis={() => setSelectedAnalysis(null)}
        />
      </div>
    );
  }

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <History className="w-6 h-6 text-purple-400" />
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Historique des vérifications
            </h2>
          </div>
          <p className="text-sm text-zinc-400">
            Retrouvez tous vos diagnostics d'annonces et rapports d'analyse.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!user && (
            <button
              onClick={() => openAuthModal('login')}
              className="px-3.5 py-2 rounded-xl bg-purple-600/15 border border-purple-500/30 text-purple-300 text-xs font-semibold hover:bg-purple-600/25 transition-colors"
            >
              Se connecter pour synchroniser
            </button>
          )}

          <button
            onClick={fetchHistory}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
            title="Rafraîchir"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 mb-6 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Rechercher par mot-clé, titre d'annonce, prix..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-purple-500 focus:outline-none text-white text-xs placeholder:text-zinc-500"
          />
        </div>

        {/* Platform Filter */}
        <select
          value={selectedPlatform}
          onChange={e => setSelectedPlatform(e.target.value)}
          className="px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-purple-500 focus:outline-none text-zinc-300 text-xs"
        >
          <option value="ALL">Toutes les plateformes</option>
          <option value="Vinted">Vinted</option>
          <option value="eBay">eBay</option>
          <option value="Facebook Marketplace">Facebook Marketplace</option>
          <option value="Leboncoin">Leboncoin</option>
          <option value="Autre">Autre</option>
        </select>

        {/* Risk Filter */}
        <select
          value={selectedRisk}
          onChange={e => setSelectedRisk(e.target.value)}
          className="px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-purple-500 focus:outline-none text-zinc-300 text-xs"
        >
          <option value="ALL">Tous les niveaux de risque</option>
          <option value="ELEVE">Risque Élevé</option>
          <option value="MOYEN">Risque Moyen</option>
          <option value="FAIBLE">Risque Faible</option>
        </select>
      </div>

      {/* List of Analyses */}
      {loading ? (
        <div className="py-20 text-center text-zinc-500 text-sm">
          Chargement de votre historique...
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="p-12 rounded-3xl bg-zinc-950/40 border border-zinc-800/80 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-500 mx-auto flex items-center justify-center">
            <History className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Aucune analyse trouvée</h3>
            <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
              {searchQuery || selectedPlatform !== 'ALL' || selectedRisk !== 'ALL'
                ? 'Aucun résultat ne correspond à vos filtres actuels.'
                : 'Vous n\'avez pas encore analysé d\'annonce. Commencez dès maintenant pour sécuriser votre prochain achat.'}
            </p>
          </div>
          <button
            onClick={onGoToAnalyzer}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-600/20"
          >
            Analyser une première annonce
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredHistory.map(item => (
            <div
              key={item.id}
              onClick={() => setSelectedAnalysis(item)}
              className="p-4 sm:p-5 rounded-2xl bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 hover:border-purple-500/40 transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                    {item.platform}
                  </span>
                  {getRiskBadge(item.riskLevel, item.riskScore)}
                  {item.claimedPrice && (
                    <span className="text-xs text-zinc-400 font-medium">
                      • {item.claimedPrice}
                    </span>
                  )}
                  <span className="text-[11px] text-zinc-500 flex items-center gap-1 ml-auto sm:ml-0">
                    <Calendar className="w-3 h-3" />
                    {new Date(item.createdAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors truncate">
                  {item.title}
                </h3>

                <p className="text-xs text-zinc-400 line-clamp-1">
                  {item.summary}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-xl bg-zinc-800 group-hover:bg-purple-600 group-hover:text-white text-zinc-300 text-xs font-semibold flex items-center gap-1 transition-all"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Détails</span>
                </button>
                {user && (
                  <button
                    type="button"
                    onClick={e => handleDelete(item.id, e)}
                    className="p-2 rounded-xl bg-zinc-800/60 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
