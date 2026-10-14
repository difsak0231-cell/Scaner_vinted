import React, { useState, useRef } from 'react';
import { 
  ShieldCheck, Upload, Image as ImageIcon, X, AlertTriangle, Sparkles, 
  ArrowRight, Loader2, CheckCircle2, MessageSquare, Tag, Euro, FileText, Zap
} from 'lucide-react';
import { Platform, AnalysisRecord } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { AnalysisResultView } from './AnalysisResultView';

const PLATFORMS: { id: Platform; label: string; badge: string }[] = [
  { id: 'Vinted', label: 'Vinted', badge: 'bg-[#09B1BA]/20 text-[#09B1BA] border-[#09B1BA]/40' },
  { id: 'eBay', label: 'eBay', badge: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40' },
  { id: 'Facebook Marketplace', label: 'FB Marketplace', badge: 'bg-blue-600/20 text-blue-400 border-blue-600/40' },
  { id: 'Leboncoin', label: 'Leboncoin', badge: 'bg-orange-500/20 text-orange-400 border-orange-500/40' },
  { id: 'Autre', label: 'Autre site', badge: 'bg-zinc-800 text-zinc-300 border-zinc-700' },
];

interface AnalyzerSectionProps {
  initialSample?: 'iphone' | 'sneakers' | 'safe' | null;
  onClearSample?: () => void;
}

export const AnalyzerSection: React.FC<AnalyzerSectionProps> = ({
  initialSample,
  onClearSample,
}) => {
  const { user, quota, refreshUserData, openUpgradeModal } = useAuth();

  // Form State
  const [platform, setPlatform] = useState<Platform>('Vinted');
  const [title, setTitle] = useState('');
  const [claimedPrice, setClaimedPrice] = useState('');
  const [adText, setAdText] = useState('');
  const [sellerMessages, setSellerMessages] = useState('');

  // Image upload
  const [imageFile, setImageFile] = useState<{
    file: File;
    previewUrl: string;
    base64: string;
    mimeType: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Execution state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisRecord | null>(null);
  const [confidenceScore, setConfidenceScore] = useState<number>(88);
  const [limitationsDisclaimer, setLimitationsDisclaimer] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Apply initial sample if requested from hero
  React.useEffect(() => {
    if (initialSample) {
      loadSample(initialSample);
      if (onClearSample) onClearSample();
    }
  }, [initialSample]);

  const loadSample = (type: 'iphone' | 'sneakers' | 'safe') => {
    setErrorMsg(null);
    setAnalysisResult(null);

    if (type === 'iphone') {
      setPlatform('Vinted');
      setTitle('iPhone 15 Pro Titane Naturel 256Go comme neuf facture Apple');
      setClaimedPrice('280 €');
      setAdText(
        'Bonjour, je vends mon iPhone 15 Pro 256Go neuf sous blister suite à un double cadeau pour mon anniversaire. Jamais allumé, avec facture Apple officielle fournie. Prix sacrifié car besoin urgent d\'argent pour payer des frais de vétérinaire imprévus. Envoi très rapide et soigné sous 24h.'
      );
      setSellerMessages(
        'Bonjour, merci pour votre intérêt. Par contre mon compte bancaire associé à Vinted est bloqué pour vérification, pouvez-vous me régler directement par Paylib entre particuliers ou PayPal entre proches ? Je vous l\'envoie dès demain matin par Chronopost express avec numéro de suivi. Donnez-moi aussi votre numéro WhatsApp ce sera plus pratique pour discuter et vous envoyer la photo de la facture.'
      );
    } else if (type === 'sneakers') {
      setPlatform('Leboncoin');
      setTitle('Nike Air Jordan 4 Retro Military Black Pointure 43');
      setClaimedPrice('130 €');
      setAdText(
        'Vend Jordan 4 Military Black taille 43 neuves jamais portées, achetées sur l\'application SNKRS il y a 2 semaines. Vendues avec boîte d\'origine, lacets de rechange et ticket de caisse Foot Locker.'
      );
      setSellerMessages(
        'Salut ! Oui la paire est dispo. Par contre je ne prends pas le paiement Leboncoin car trop de litiges abusifs avec les acheteurs fantômes. Uniquement PayPal entre amis ou virement instantané. Je te fais un prix à 110€ frais de port compris si tu valides dans l\'heure car j\'ai d\'autres acheteurs dessus.'
      );
    } else {
      setPlatform('Vinted');
      setTitle('Manteau d\'hiver The North Face Nuptse 1996 Noir Taille M');
      setClaimedPrice('95 €');
      setAdText(
        'Manteau doudoune The North Face modèle Nuptse 1996 couleur noir taille M. Porté une saison, en excellent état, aucune déchirure ni trace d\'usure. Fermetures éclair YKK fonctionnelles. Vêtement lavé et imperméabilisé. Maison non fumeur. Envoi soigné via Mondial Relay ou remise en main propre possible sur Lyon 3e.'
      );
      setSellerMessages(
        'Bonjour ! Oui le manteau est toujours disponible. Vous pouvez passer directement commande via le bouton d\'achat sécurisé de Vinted. Je pourrai déposer le colis en point relais dès demain matin. N\'hésitez pas si vous souhaitez une photo supplémentaire de l\'étiquette holographique pour vérifier l\'authenticité.'
      );
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Veuillez sélectionner un fichier image valide (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setErrorMsg('L\'image dépasse la taille maximale recommandée de 8 Mo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setImageFile({
        file,
        previewUrl: URL.createObjectURL(file),
        base64,
        mimeType: file.type,
      });
      setErrorMsg(null);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!adText.trim() && !sellerMessages.trim() && !imageFile) {
      setErrorMsg('Veuillez fournir au moins le texte de l\'annonce, les messages du vendeur ou une capture d\'écran.');
      return;
    }

    // Check quota
    const isPremium = user?.plan === 'premium';
    if (!isPremium && quota && quota.remaining <= 0) {
      openUpgradeModal();
      return;
    }

    setIsAnalyzing(true);

    try {
      const response = await api.analyzeListing({
        platform,
        title: title.trim() || 'Annonce sans titre',
        claimedPrice: claimedPrice.trim() || undefined,
        adText: adText.trim(),
        sellerMessages: sellerMessages.trim() || undefined,
        imageData: imageFile ? { mimeType: imageFile.mimeType, base64: imageFile.base64 } : undefined,
      });

      setAnalysisResult(response.analysis);
      setConfidenceScore(response.confidenceScore);
      setLimitationsDisclaimer(response.limitationsDisclaimer);
      await refreshUserData();
      // Scroll smoothly to results
      window.scrollTo({ top: 180, behavior: 'smooth' });
    } catch (err: any) {
      if (err.data?.quotaExceeded) {
        openUpgradeModal();
      } else {
        setErrorMsg(err.message || 'Une erreur est survenue lors de l\'analyse.');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetForm = () => {
    setAnalysisResult(null);
    setTitle('');
    setClaimedPrice('');
    setAdText('');
    setSellerMessages('');
    removeImage();
    setErrorMsg(null);
  };

  // If result is ready, show Result view
  if (analysisResult) {
    return (
      <section id="analyzer" className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <AnalysisResultView
          analysis={analysisResult}
          confidenceScore={confidenceScore}
          limitationsDisclaimer={limitationsDisclaimer}
          onNewAnalysis={resetForm}
          onOpenUpgrade={openUpgradeModal}
        />
      </section>
    );
  }

  const isQuotaReached = !user?.plan?.includes('premium') && quota && quota.remaining <= 0;

  return (
    <section id="analyzer" className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Card Header */}
      <div className="bg-zinc-950/80 rounded-3xl border border-zinc-800 shadow-2xl overflow-hidden backdrop-blur-xl">
        <div className="p-6 sm:p-8 border-b border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Analyseur d'annonces IA
              </h2>
            </div>
            <p className="text-sm text-zinc-400">
              Copiez l'annonce, collez les messages suspects et joignez vos captures pour un diagnostic instantané.
            </p>
          </div>

          {/* Quick sample buttons in header */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-zinc-400 mr-1 font-medium">Exemples :</span>
            <button
              type="button"
              onClick={() => loadSample('iphone')}
              className="px-2.5 py-1 text-xs rounded-lg bg-zinc-900 hover:bg-zinc-800 text-rose-400 border border-rose-500/30 transition-colors"
            >
              iPhone 15 (Arnaque)
            </button>
            <button
              type="button"
              onClick={() => loadSample('sneakers')}
              className="px-2.5 py-1 text-xs rounded-lg bg-zinc-900 hover:bg-zinc-800 text-amber-400 border border-amber-500/30 transition-colors"
            >
              Sneakers (Suspect)
            </button>
            <button
              type="button"
              onClick={() => loadSample('safe')}
              className="px-2.5 py-1 text-xs rounded-lg bg-zinc-900 hover:bg-zinc-800 text-emerald-400 border border-emerald-500/30 transition-colors"
            >
              Annonce Sûre
            </button>
          </div>
        </div>

        {/* Quota alert if exhausted */}
        {isQuotaReached && (
          <div className="m-6 p-4 rounded-2xl bg-gradient-to-r from-purple-950/60 to-zinc-900 border border-purple-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-600/20 text-purple-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  Quota gratuit journalier atteint (3/3 utilisées)
                </h4>
                <p className="text-xs text-zinc-300">
                  Passez à la formule Premium pour 4,99 €/mois et débloquez des analyses illimitées.
                </p>
              </div>
            </div>
            <button
              onClick={openUpgradeModal}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold whitespace-nowrap shadow-md shadow-purple-600/30 transition-all glow-purple-sm"
            >
              Débloquer Premium
            </button>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          
          {/* 1. Plateforme de l'annonce */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">
              1. Plateforme où se trouve l'annonce
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {PLATFORMS.map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPlatform(p.id)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all text-center flex items-center justify-center gap-1.5 ${
                    platform === p.id
                      ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/20'
                      : 'bg-zinc-900/90 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Titre et Prix de l'objet */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-purple-400" />
                Titre de l'annonce ou objet
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Ex : iPhone 15 Pro, Veste The North Face, PS5..."
                className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-purple-500 focus:outline-none text-white text-sm placeholder:text-zinc-500 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                <Euro className="w-3.5 h-3.5 text-purple-400" />
                Prix affiché (€)
              </label>
              <input
                type="text"
                value={claimedPrice}
                onChange={e => setClaimedPrice(e.target.value)}
                placeholder="Ex : 250 €"
                className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-purple-500 focus:outline-none text-white text-sm placeholder:text-zinc-500 transition-colors"
              />
            </div>
          </div>

          {/* 3. Description de l'annonce (Copier-Coller) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-purple-400" />
                2. Texte complet de l'annonce (Copier-coller)
              </label>
              <span className="text-[11px] text-zinc-500">
                {adText.length} caractères
              </span>
            </div>
            <textarea
              rows={4}
              value={adText}
              onChange={e => setAdText(e.target.value)}
              placeholder="Collez ici la description exacte de l'annonce, les mentions d'état de l'objet, les conditions de livraison et les éventuelles justifications du vendeur..."
              className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-purple-500 focus:outline-none text-white text-sm placeholder:text-zinc-500 transition-colors leading-relaxed"
            />
          </div>

          {/* 4. Messages échangés avec le vendeur (Copier-Coller) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
                3. Messages reçus du vendeur (WhatsApp, SMS, Messagerie)
              </label>
              <span className="text-[11px] text-purple-400 font-medium">
                Fortement recommandé
              </span>
            </div>
            <textarea
              rows={3}
              value={sellerMessages}
              onChange={e => setSellerMessages(e.target.value)}
              placeholder="Collez ici les échanges avec le vendeur : demandes de virement, Paylib, PayPal, envoi de numéro de téléphone, proposition de livreur Chronopost ou DPD..."
              className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-purple-500 focus:outline-none text-white text-sm placeholder:text-zinc-500 transition-colors leading-relaxed"
            />
          </div>

          {/* 5. Capture d'écran ou Photo (Upload) */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-purple-400" />
              4. Capture d'écran ou photo de l'annonce / conversation (Optionnel)
            </label>

            {imageFile ? (
              <div className="relative p-3 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center gap-4">
                <img
                  src={imageFile.previewUrl}
                  alt="Aperçu upload"
                  className="w-16 h-16 object-cover rounded-xl border border-zinc-700"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white truncate">
                    {imageFile.file.name}
                  </p>
                  <p className="text-[11px] text-zinc-400">
                    {(imageFile.file.size / 1024).toFixed(0)} Ko • Image prête pour analyse multimodale
                  </p>
                </div>
                <button
                  type="button"
                  onClick={removeImage}
                  className="p-2 rounded-xl bg-zinc-800 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-6 rounded-2xl border-2 border-dashed border-zinc-800 hover:border-purple-500/50 bg-zinc-900/40 hover:bg-zinc-900/80 transition-all cursor-pointer text-center group"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="p-3 rounded-2xl bg-zinc-800 text-zinc-400 group-hover:text-purple-400 group-hover:bg-purple-600/20 transition-all">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-zinc-300 group-hover:text-white">
                      Cliquez pour ajouter une capture d'écran ou glissez-la ici
                    </span>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Formats supportés : JPG, PNG, WebP (Max 8 Mo)
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Submit Action Button */}
          <div className="pt-4 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-zinc-500 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Analyse instantanée et confidentielle</span>
            </div>

            <button
              type="submit"
              disabled={isAnalyzing}
              className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold text-sm tracking-wide flex items-center justify-center gap-3 transition-all ${
                isAnalyzing
                  ? 'bg-purple-800 text-purple-200 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-500 text-white shadow-xl shadow-purple-600/30 hover:scale-[1.02] active:scale-[0.98] glow-purple-sm'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-purple-300" />
                  <span>Analyse IA en cours (vérification des signaux)...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-white" />
                  <span>Analyser l'annonce avec l'IA</span>
                  <ArrowRight className="w-4 h-4 text-purple-200" />
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </section>
  );
};
