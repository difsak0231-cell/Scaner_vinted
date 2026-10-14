export type Platform = 'Vinted' | 'eBay' | 'Facebook Marketplace' | 'Leboncoin' | 'Autre';

export type RiskLevel = 'FAIBLE' | 'MOYEN' | 'ELEVE';

export interface SuspiciousFlag {
  id: string;
  category: 'PAIEMENT' | 'PRIX' | 'PROFIL' | 'COMMUNICATION' | 'PHOTOS' | 'LIVRAISON';
  title: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
}

export interface SafetyChecklistItem {
  item: string;
  tip: string;
}

export interface AnalysisRecord {
  id: string;
  userId: string | null;
  guestIp?: string;
  platform: Platform;
  title: string;
  claimedPrice?: string;
  riskScore: number;
  riskLevel: RiskLevel;
  summary: string;
  flags: SuspiciousFlag[];
  suspiciousElements: string[];
  positivePoints: string[];
  recommendations: string[];
  safetyChecklist: SafetyChecklistItem[];
  chatInsights?: string;
  originalText: string;
  originalMessages?: string;
  hasImage: boolean;
  imageUrl?: string;
  createdAt: string;
}

export interface AnalysisResponse {
  analysis: AnalysisRecord;
  quota: Quota;
  confidenceScore: number;
  limitationsDisclaimer: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  plan: 'free' | 'premium';
  subscriptionExpiresAt: string | null;
}

export interface Quota {
  used: number;
  max: number;
  remaining: number;
}
