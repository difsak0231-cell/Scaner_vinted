import fs from 'fs';
import path from 'path';

export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  salt: string;
  plan: 'free' | 'premium';
  subscriptionExpiresAt: string | null;
  createdAt: string;
}

export interface SuspiciousFlag {
  id: string;
  category: 'PAIEMENT' | 'PRIX' | 'PROFIL' | 'COMMUNICATION' | 'PHOTOS' | 'LIVRAISON';
  title: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
}

export interface AnalysisRecord {
  id: string;
  userId: string | null;
  guestIp?: string;
  platform: 'Vinted' | 'eBay' | 'Facebook Marketplace' | 'Leboncoin' | 'Autre';
  title: string;
  claimedPrice?: string;
  riskScore: number; // 0 to 100
  riskLevel: 'FAIBLE' | 'MOYEN' | 'ELEVE';
  summary: string;
  flags: SuspiciousFlag[];
  suspiciousElements: string[];
  positivePoints: string[];
  recommendations: string[];
  safetyChecklist: { item: string; tip: string }[];
  chatInsights?: string;
  originalText: string;
  originalMessages?: string;
  hasImage: boolean;
  imageUrl?: string;
  createdAt: string;
}

export interface QuotaEntry {
  identifier: string; // userId or guestIp
  date: string; // YYYY-MM-DD
  count: number;
}

export interface DatabaseSchema {
  users: User[];
  analyses: AnalysisRecord[];
  quotas: QuotaEntry[];
  subscriptions: {
    id: string;
    userId: string;
    plan: 'premium';
    amount: number;
    currency: string;
    status: 'active' | 'cancelled';
    paymentMethod: string;
    createdAt: string;
  }[];
}

const DATA_DIR = path.resolve(process.cwd(), '.data');
const DB_FILE = path.join(DATA_DIR, 'scamcheck_db.json');

// Initial seed data for immediate testing
const INITIAL_DB: DatabaseSchema = {
  users: [],
  analyses: [],
  quotas: [],
  subscriptions: [],
};

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error('Error loading db file, starting with default', e);
    }
    this.save(INITIAL_DB);
    return INITIAL_DB;
  }

  private save(dataToSave?: DatabaseSchema) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const data = dataToSave || this.data;
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error saving db file', e);
    }
  }

  public getUsers(): User[] {
    return this.data.users;
  }

  public findUserById(id: string): User | undefined {
    return this.data.users.find(u => u.id === id);
  }

  public findUserByEmail(email: string): User | undefined {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public addUser(user: User): User {
    this.data.users.push(user);
    this.save();
    return user;
  }

  public updateUserPlan(userId: string, plan: 'free' | 'premium', expiresAt: string | null): boolean {
    const user = this.data.users.find(u => u.id === userId);
    if (!user) return false;
    user.plan = plan;
    user.subscriptionExpiresAt = expiresAt;
    this.save();
    return true;
  }

  public addSubscription(record: {
    userId: string;
    plan: 'premium';
    amount: number;
    currency: string;
    paymentMethod: string;
  }) {
    const sub = {
      id: 'sub_' + Math.random().toString(36).substring(2, 9),
      userId: record.userId,
      plan: record.plan,
      amount: record.amount,
      currency: record.currency,
      status: 'active' as const,
      paymentMethod: record.paymentMethod,
      createdAt: new Date().toISOString(),
    };
    this.data.subscriptions.push(sub);
    this.save();
    return sub;
  }

  public getAnalyses(userId?: string): AnalysisRecord[] {
    if (!userId) {
      // return recent public or guest
      return this.data.analyses.slice(-20).reverse();
    }
    return this.data.analyses
      .filter(a => a.userId === userId)
      .reverse();
  }

  public getAnalysisById(id: string): AnalysisRecord | undefined {
    return this.data.analyses.find(a => a.id === id);
  }

  public addAnalysis(analysis: AnalysisRecord): AnalysisRecord {
    this.data.analyses.push(analysis);
    this.save();
    return analysis;
  }

  public deleteAnalysis(id: string, userId: string): boolean {
    const idx = this.data.analyses.findIndex(a => a.id === id && a.userId === userId);
    if (idx !== -1) {
      this.data.analyses.splice(idx, 1);
      this.save();
      return true;
    }
    return false;
  }

  // Daily quota system (3 analyses per day for free users/guests)
  public getDailyQuota(identifier: string, isPremium: boolean): { used: number; max: number; remaining: number } {
    if (isPremium) {
      return { used: 0, max: 999999, remaining: 999999 };
    }
    const today = new Date().toISOString().slice(0, 10);
    const quota = this.data.quotas.find(q => q.identifier === identifier && q.date === today);
    const used = quota ? quota.count : 0;
    const max = 3;
    const remaining = Math.max(0, max - used);
    return { used, max, remaining };
  }

  public incrementDailyQuota(identifier: string, isPremium: boolean): boolean {
    if (isPremium) return true;
    const today = new Date().toISOString().slice(0, 10);
    let quota = this.data.quotas.find(q => q.identifier === identifier && q.date === today);
    if (!quota) {
      quota = { identifier, date: today, count: 0 };
      this.data.quotas.push(quota);
    }
    if (quota.count >= 3) {
      return false; // Quota exceeded
    }
    quota.count += 1;
    this.save();
    return true;
  }
}

export const db = new Database();
