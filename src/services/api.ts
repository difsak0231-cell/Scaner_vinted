import { AnalysisRecord, AnalysisResponse, Platform, Quota, User } from '../types';

const TOKEN_KEY = 'scamcheck_token';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string | null) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});
  
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = data?.message || data?.error || 'Une erreur est survenue';
    const err: any = new Error(errorMsg);
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data as T;
}

export const api = {
  // Auth
  async login(email: string, password: string): Promise<{ token: string; user: User; quota: Quota }> {
    const res = await request<{ token: string; user: User; quota: Quota }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setStoredToken(res.token);
    return res;
  },

  async register(email: string, password: string, name?: string): Promise<{ token: string; user: User; quota: Quota }> {
    const res = await request<{ token: string; user: User; quota: Quota }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
    setStoredToken(res.token);
    return res;
  },

  async getMe(): Promise<{ user: User | null; quota: Quota }> {
    return request<{ user: User | null; quota: Quota }>('/api/auth/me');
  },

  logout() {
    setStoredToken(null);
  },

  async getQuota(): Promise<Quota> {
    return request<Quota>('/api/quota');
  },

  // Analysis
  async analyzeListing(data: {
    platform: Platform;
    title: string;
    claimedPrice?: string;
    adText: string;
    sellerMessages?: string;
    imageData?: { mimeType: string; base64: string };
  }): Promise<AnalysisResponse> {
    return request<AnalysisResponse>('/api/analyze', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // History
  async getHistory(): Promise<AnalysisRecord[]> {
    return request<AnalysisRecord[]>('/api/history');
  },

  async getHistoryById(id: string): Promise<AnalysisRecord> {
    return request<AnalysisRecord>(`/api/history/${id}`);
  },

  async deleteHistory(id: string): Promise<{ success: boolean }> {
    return request<{ success: boolean }>(`/api/history/${id}`, {
      method: 'DELETE',
    });
  },

  // Subscription
  async upgradeToPremium(paymentMethod: string = 'card'): Promise<{
    success: boolean;
    message: string;
    user: User;
    quota: Quota;
  }> {
    return request<{
      success: boolean;
      message: string;
      user: User;
      quota: Quota;
    }>('/api/subscription/upgrade', {
      method: 'POST',
      body: JSON.stringify({ paymentMethod }),
    });
  },

  async cancelPremium(): Promise<{ success: boolean; user: User }> {
    return request<{ success: boolean; user: User }>('/api/subscription/cancel', {
      method: 'POST',
    });
  },
};
