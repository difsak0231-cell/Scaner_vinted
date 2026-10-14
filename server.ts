import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { db, AnalysisRecord, User } from './server/db.js';
import {
  hashPassword,
  verifyPassword,
  generateToken,
  authMiddleware,
  requireAuth,
  AuthenticatedRequest,
} from './server/auth.js';
import { analyzeListing } from './server/gemini.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

// Parse JSON payloads up to 20MB for images/screenshots
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Attach user if Bearer token is provided
app.use(authMiddleware);

// Helper for client IP
function getClientIdentifier(req: AuthenticatedRequest): string {
  if (req.user) return req.user.id;
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress || 'guest-unknown';
}

// ================= AUTH ROUTES =================

app.post('/api/auth/register', (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis.' });
    }

    const existing = db.findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ error: 'Cet email est déjà utilisé.' });
    }

    const { hash, salt } = hashPassword(password);
    const newUser: User = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      email,
      name: name || email.split('@')[0],
      passwordHash: hash,
      salt,
      plan: 'free',
      subscriptionExpiresAt: null,
      createdAt: new Date().toISOString(),
    };

    db.addUser(newUser);
    const token = generateToken(newUser);
    const quota = db.getDailyQuota(newUser.id, false);

    return res.status(201).json({
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        plan: newUser.plan,
        subscriptionExpiresAt: newUser.subscriptionExpiresAt,
      },
      quota,
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: 'Erreur lors de la création du compte.' });
  }
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis.' });
    }

    const user = db.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Identifiants invalides.' });
    }

    const isValid = verifyPassword(password, user.passwordHash, user.salt);
    if (!isValid) {
      return res.status(401).json({ error: 'Identifiants invalides.' });
    }

    const isPremium = user.plan === 'premium';
    const token = generateToken(user);
    const quota = db.getDailyQuota(user.id, isPremium);

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        plan: user.plan,
        subscriptionExpiresAt: user.subscriptionExpiresAt,
      },
      quota,
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Erreur de connexion.' });
  }
});

app.get('/api/auth/me', (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    const identifier = getClientIdentifier(req);
    const quota = db.getDailyQuota(identifier, false);
    return res.json({ user: null, quota });
  }

  const isPremium = req.user.plan === 'premium';
  const quota = db.getDailyQuota(req.user.id, isPremium);

  return res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
      plan: req.user.plan,
      subscriptionExpiresAt: req.user.subscriptionExpiresAt,
    },
    quota,
  });
});

app.get('/api/quota', (req: AuthenticatedRequest, res: Response) => {
  const isPremium = req.user?.plan === 'premium';
  const identifier = getClientIdentifier(req);
  const quota = db.getDailyQuota(identifier, isPremium);
  res.json(quota);
});

// ================= ANALYSIS ROUTES =================

app.post('/api/analyze', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { platform, title, claimedPrice, adText, sellerMessages, imageData } = req.body;

    if (!adText && !sellerMessages && !imageData) {
      return res.status(400).json({
        error: 'Veuillez fournir au moins la description de l\'annonce, les messages ou une capture d\'écran.',
      });
    }

    const identifier = getClientIdentifier(req);
    const isPremium = req.user?.plan === 'premium';

    // Check daily quota
    const quota = db.getDailyQuota(identifier, isPremium);
    if (!isPremium && quota.remaining <= 0) {
      return res.status(429).json({
        error: 'Quota journalier atteint',
        quotaExceeded: true,
        message:
          'Vous avez utilisé vos 3 analyses gratuites pour aujourd\'hui. Passez à la formule Premium pour des analyses illimitées à 4,99 €/mois !',
      });
    }

    // Call Gemini AI
    const analysisResult = await analyzeListing({
      platform: platform || 'Vinted',
      title: title || 'Annonce sans titre',
      claimedPrice,
      adText: adText || '',
      sellerMessages: sellerMessages || '',
      imageData,
    });

    // Increment quota after successful check
    db.incrementDailyQuota(identifier, isPremium);

    // Save record to DB
    const record: AnalysisRecord = {
      id: 'anl_' + Math.random().toString(36).substring(2, 9),
      userId: req.user ? req.user.id : null,
      guestIp: !req.user ? identifier : undefined,
      platform: platform || 'Vinted',
      title: title || 'Annonce analysée',
      claimedPrice: claimedPrice || '',
      riskScore: analysisResult.riskScore,
      riskLevel: analysisResult.riskLevel,
      summary: analysisResult.summary,
      flags: analysisResult.flags,
      suspiciousElements: analysisResult.suspiciousElements,
      positivePoints: analysisResult.positivePoints,
      recommendations: analysisResult.recommendations,
      safetyChecklist: analysisResult.safetyChecklist,
      chatInsights: analysisResult.chatInsights,
      originalText: adText || '',
      originalMessages: sellerMessages || '',
      hasImage: !!imageData,
      imageUrl: imageData ? (imageData.base64?.slice(0, 50) + '...') : undefined,
      createdAt: new Date().toISOString(),
    };

    db.addAnalysis(record);

    const updatedQuota = db.getDailyQuota(identifier, isPremium);

    return res.json({
      analysis: record,
      quota: updatedQuota,
      confidenceScore: analysisResult.confidenceScore,
      limitationsDisclaimer: analysisResult.limitationsDisclaimer,
    });
  } catch (err: any) {
    console.error('Analysis endpoint error:', err);
    return res.status(500).json({ error: 'Erreur lors de l\'analyse de l\'annonce.' });
  }
});

// ================= HISTORY ROUTES =================

app.get('/api/history', (req: AuthenticatedRequest, res: Response) => {
  // If user is authenticated, return their records; else return guest records for this IP
  if (req.user) {
    const list = db.getAnalyses(req.user.id);
    return res.json(list);
  }
  const identifier = getClientIdentifier(req);
  const all = db.getAnalyses();
  const guestList = all.filter(a => a.guestIp === identifier || !a.userId).slice(0, 10);
  return res.json(guestList);
});

app.get('/api/history/:id', (req: AuthenticatedRequest, res: Response) => {
  const analysis = db.getAnalysisById(req.params.id);
  if (!analysis) {
    return res.status(404).json({ error: 'Analyse introuvable.' });
  }
  return res.json(analysis);
});

app.delete('/api/history/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const success = db.deleteAnalysis(req.params.id, req.user!.id);
  if (!success) {
    return res.status(404).json({ error: 'Analyse introuvable ou non autorisée.' });
  }
  return res.json({ success: true });
});

// ================= SUBSCRIPTION / MONETIZATION =================

app.post('/api/subscription/upgrade', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { paymentMethod = 'card' } = req.body;
    const userId = req.user!.id;

    // Simulate payment transaction
    const expires = new Date();
    expires.setMonth(expires.getMonth() + 1);

    db.updateUserPlan(userId, 'premium', expires.toISOString());
    const sub = db.addSubscription({
      userId,
      plan: 'premium',
      amount: 4.99,
      currency: 'EUR',
      paymentMethod,
    });

    const updatedUser = db.findUserById(userId);

    return res.json({
      success: true,
      message: 'Félicitations ! Votre abonnement ScamCheck Premium est désormais actif.',
      subscription: sub,
      user: {
        id: updatedUser!.id,
        email: updatedUser!.email,
        name: updatedUser!.name,
        plan: updatedUser!.plan,
        subscriptionExpiresAt: updatedUser!.subscriptionExpiresAt,
      },
      quota: db.getDailyQuota(userId, true),
    });
  } catch (err: any) {
    console.error('Subscription error:', err);
    return res.status(500).json({ error: 'Erreur lors du traitement du paiement.' });
  }
});

app.post('/api/subscription/cancel', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  db.updateUserPlan(userId, 'free', null);
  const updatedUser = db.findUserById(userId);
  return res.json({
    success: true,
    message: 'Votre abonnement a été résilié.',
    user: {
      id: updatedUser!.id,
      email: updatedUser!.email,
      name: updatedUser!.name,
      plan: updatedUser!.plan,
      subscriptionExpiresAt: null,
    },
  });
});

// ================= VITE DEV OR STATIC SERVER =================

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[ScamCheck IA] Serveur démarré avec succès sur http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Fatal error starting server:', err);
  process.exit(1);
});
