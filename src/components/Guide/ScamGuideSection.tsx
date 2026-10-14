import React, { useState } from 'react';
import { 
  BookOpen, ShieldAlert, AlertTriangle, CheckCircle, ExternalLink, 
  HelpCircle, ArrowRight, Smartphone, CreditCard, Truck, Users, FileCheck 
} from 'lucide-react';

const SCAM_TOPICS = [
  {
    id: 'transport',
    icon: Truck,
    title: "L'arnaque au faux transporteur (DPD, Mondial Relay, DHL)",
    badge: 'Très Fréquent',
    badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    description:
      "L'acheteur prétendra envoyer un coursier à votre domicile avec une enveloppe d'argent liquide. En réalité, vous recevrez un SMS ou email usurpant la marque du transporteur vous réclamant une 'assurance' ou 'taxe' sous forme de coupons Neosurf ou PCS.",
    warningSigns: [
      "L'acheteur refuse la livraison intégrée de la plateforme et impose 'son transporteur'.",
      "Demande insistante de votre numéro de téléphone et de votre adresse e-mail personnelle.",
      "Email de confirmation provenant d'une adresse Gmail ou Outlook louche (ex: service-mondialrelay-validation@gmail.com).",
      "Demande d'achat de cartes cadeaux ou recharges PCS / Transcash pour valider la livraison.",
    ],
    defenseTips: [
      "N'acceptez JAMAIS de livraison gérée en dehors de l'étiquette fournie par la plateforme.",
      "Aucun transporteur légitime ne remet d'enveloppe contenant de l'argent liquide.",
      "Vérifiez scrupuleusement l'adresse email de l'expéditeur (le domaine officiel après l'@).",
    ],
  },
  {
    id: 'paylib',
    icon: CreditCard,
    title: "Le piège Paylib & PayPal 'Entre proches'",
    badge: 'Critique',
    badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    description:
      "Le vendeur prétexte un blocage technique de son compte Vinted/Leboncoin et vous demande de payer par Paylib ou PayPal en mode 'Envoi d'argent à un ami'. En choisissant ce mode, vous renoncez intégralement à toute protection acheteur.",
    warningSigns: [
      "Phrase type : 'Mon porte-monnaie Vinted est bloqué par la banque, réglez-moi par Paylib'.",
      "Offre d'une réduction importante si vous réglez par virement direct sans passer par le bouton acheter.",
      "Le vendeur vous envoie un faux lien SMS Paylib qui vous invite à saisir vos identifiants bancaires.",
    ],
    defenseTips: [
      "Payez TOUJOURS via le bouton 'Acheter' officiel avec protection intégrée.",
      "Si un vendeur a son compte bloqué, c'est généralement qu'il a déjà été signalé pour fraude.",
      "Le mode 'PayPal Entre proches' est réservé à la famille : aucun recours n'est possible.",
    ],
  },
  {
    id: 'phishing',
    icon: Smartphone,
    title: "Le phishing et fausses confirmations de paiement",
    badge: 'Urgent',
    badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    description:
      "Dès la publication de votre annonce, un profil vous contacte en affirmant qu'il a acheté votre article et vous transmet une capture d'écran ou un SMS prétendant que votre paiement est en attente sur un lien.",
    warningSigns: [
      "L'acheteur vous demande d'aller sur un lien externe pour 'récupérer vos fonds'.",
      "La page web imite l'apparence de votre banque ou de la plateforme avec une URL bizarre (ex: leboncoin-securite-france.top).",
      "On vous demande votre code de carte bancaire ou votre mot de passe pour 'recevoir' de l'argent.",
    ],
    defenseTips: [
      "Pour recevoir un paiement, vous n'avez JAMAIS besoin de fournir votre numéro de carte bancaire.",
      "Consultez toujours votre solde directement depuis l'application officielle, sans cliquer sur des liens.",
    ],
  },
  {
    id: 'counterfeit',
    icon: FileCheck,
    title: "Contrefaçons haut de gamme avec faux tickets de caisse",
    badge: 'Répandu',
    badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    description:
      "Particulièrement présent sur les sneakers (Jordan, Dunk), la maroquinerie de luxe et les AirPods. Les escrocs fournissent de faux reçus d'achat générés sur des applications spécialisées (faux ticket Foot Locker, faux reçu Apple).",
    warningSigns: [
      "Prix inférieur de 50% au prix du marché pour un produit neuf très convoité.",
      "Facture avec typographie décalée, montant incohérent ou numéro de TVA inexistant.",
      "Refus d'envoyer des photos en gros plan des coutures, étiquettes intérieures ou numéros de série.",
    ],
    defenseTips: [
      "Demandez une photo de l'article avec un papier manuscrit portant la date d'aujourd'hui.",
      "Utilisez l'option de vérification d'authenticité proposée par Vinted ou eBay.",
    ],
  },
];

interface ScamGuideSectionProps {
  onGoToAnalyzer: () => void;
}

export const ScamGuideSection: React.FC<ScamGuideSectionProps> = ({ onGoToAnalyzer }) => {
  const [activeTopic, setActiveTopic] = useState<string>('transport');

  const selectedScam = SCAM_TOPICS.find(t => t.id === activeTopic) || SCAM_TOPICS[0];
  const IconComponent = selectedScam.icon;

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-600/15 border border-purple-500/30 text-purple-300 text-xs font-bold">
          <BookOpen className="w-3.5 h-3.5 text-purple-400" />
          Guide Anti-Fraude
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Comment fonctionnent les arnaques sur Vinted & Marketplaces
        </h2>
        <p className="text-sm text-zinc-400">
          Apprenez à repérer les techniques d'ingénierie sociale et les pièges les plus répandus en 2026.
        </p>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-8">
        {SCAM_TOPICS.map(topic => {
          const TabIcon = topic.icon;
          const isActive = topic.id === activeTopic;
          return (
            <button
              key={topic.id}
              onClick={() => setActiveTopic(topic.id)}
              className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col gap-2 ${
                isActive
                  ? 'bg-purple-950/40 border-purple-500 text-white shadow-lg shadow-purple-900/20'
                  : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <TabIcon className={`w-5 h-5 ${isActive ? 'text-purple-400' : 'text-zinc-500'}`} />
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${topic.badgeColor}`}>
                  {topic.badge}
                </span>
              </div>
              <span className="text-xs font-bold line-clamp-1">{topic.title}</span>
            </button>
          );
        })}
      </div>

      {/* Active Scam Deep Dive Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-zinc-800 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
              <IconComponent className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                {selectedScam.title}
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Dossier de décryptage technique et psychologique
              </p>
            </div>
          </div>

          <button
            onClick={onGoToAnalyzer}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all self-start sm:self-auto"
          >
            <span>Tester une annonce suspecte</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mechanism description */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400">
            Le mode opératoire des escrocs
          </h4>
          <p className="text-sm text-zinc-300 leading-relaxed bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800/80">
            {selectedScam.description}
          </p>
        </div>

        {/* Warning signs & Defense checklist */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          
          <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              Signaux d'alerte qui doivent vous alerter
            </h4>
            <ul className="space-y-2 text-xs text-zinc-300">
              {selectedScam.warningSigns.map((sign, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">•</span>
                  <span>{sign}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" />
              Réflexes de sécurité recommandés
            </h4>
            <ul className="space-y-2 text-xs text-zinc-300">
              {selectedScam.defenseTips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Recourse Guide */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 to-zinc-900 border border-purple-500/20 text-xs text-zinc-300 space-y-2">
          <p className="font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-purple-400" />
            Que faire si vous êtes victime d'une escroquerie ?
          </p>
          <p className="leading-relaxed text-zinc-400">
            1. Faites opposition immédiate auprès de votre banque si vous avez communiqué vos coordonnées bancaires.
            <br />
            2. Déposez une plainte en ligne sur la plateforme officielle du ministère de l'Intérieur : <strong>THESEE</strong> (Traitement Harmonisé des Enquêtes et Signalements d'E-Escroqueries).
            <br />
            3. Signalez le profil sur Vinted/Leboncoin avec captures d'écran pour éviter d'autres victimes.
          </p>
        </div>

      </div>
    </section>
  );
};
