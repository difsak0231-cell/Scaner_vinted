# ScamCheck IA - Plateforme Antifraude pour Marketplaces

**ScamCheck IA** est une application web professionnelle conçue pour détecter les arnaques, fausses annonces et paiements piégés sur les marketplaces de seconde main (**Vinted**, **eBay**, **Facebook Marketplace**, **Leboncoin**).

---

## 🚀 Fonctionnalités Implémentées

1. **Copier-coller d'annonces** : analyse du titre, prix, description complète et plateforme cible.
2. **Analyse des messages du vendeur** : détection de la manipulation psychologique, sentiment d'urgence injustifié, et incitations à quitter la messagerie.
3. **Analyse visuelle & multimodale** : upload de captures d'écran (preuves de virement, fausses factures, photos d'articles).
4. **Intelligence Artificielle Google Gemini 3.8 Flash** : prompt antifraude spécialisé côté serveur (clé API sécurisée, jamais exposée au navigateur).
5. **Score de Risque de 0 à 100** : avec jauge animée et classification nette (*Risque Faible*, *Risque Moyen*, *Risque Élevé*).
6. **Grille détaillée des signaux suspects** : catégorisés par Paiement, Prix, Profil, Photos, Communication et Logistique.
7. **Checklist interactive de sécurité** : étapes concrètes d'autodéfense à cocher avant de finaliser une transaction.
8. **Historique des analyses** : recherche, filtrage par plateforme/risque, réouverture des rapports et suppression.
9. **Système de Quotas & Monétisation** :
   - **Formule Gratuite** : 3 analyses par jour (comptabilisées automatiquement par compte ou par IP).
   - **Formule Premium (4,99 €/mois)** : analyses illimitées, vision capture d'écran, export de rapport pour litige.
10. **Passerelle d'abonnement intégrée** : simulation complète de paiement sécurisé avec déverrouillage immédiat et célébration confetti.
11. **Guide éducatif complet** : dossiers pratiques sur les arnaques au faux transporteur (DPD, Mondial Relay), le piège Paylib / PayPal Entre proches, et les démarches officielles (plainte THESEE).

---

## 🛠️ Architecture Technique & Guide de Reprise / Revente

L'application a été pensée pour un futur repreneur ou acheteur de logiciel (SaaS clé en main) :

```text
├── server/
│   ├── auth.ts         # Authentification sécurisée (PBKDF2 10000 itérations, JWT HMAC-SHA256)
│   ├── db.ts           # Couche de persistance autonome (users, analyses, quotas, abonnements)
│   └── gemini.ts       # Service d'analyse IA avec Gemini 3.8 Flash & fallback heuristique
├── server.ts           # Serveur Express full-stack + proxy API + middleware Vite
├── src/
│   ├── components/
│   │   ├── Analyzer/   # Formulaire d'analyse & affichage du score de risque
│   │   ├── Auth/       # Modale de connexion / inscription avec compte démo 1-clic
│   │   ├── Guide/      # Guides pratiques et fiches réflexes
│   │   ├── History/    # Historique complet avec recherche et filtres
│   │   ├── Pricing/    # Page de tarifs et comparatif Free vs Premium
│   │   └── Subscription/ # Modale de paiement CB / Apple Pay / PayPal
│   ├── context/        # AuthContext (gestion session, quotas, triggers)
│   ├── services/       # Client API typé
│   └── types.ts        # Définitions TypeScript
```

---

## ⚙️ Configuration Externe pour Mise en Production

Toutes les fonctionnalités de base sont opérationnelles immédiatement. Pour un déploiement commercial à grande échelle :

1. **Clé API Gemini (`GEMINI_API_KEY`)** :
   - Déjà injectée automatiquement via les secrets AI Studio. En production indépendante, définissez la variable d'environnement `GEMINI_API_KEY` dans votre hébergeur (Cloud Run, Railway, Render, VPS).

2. **Passerelle Stripe (Paiements réels)** :
   - L'endpoint `POST /api/subscription/upgrade` dans `server.ts` simule actuellement l'acceptation bancaire et active le statut Premium.
   - Pour brancher Stripe en production :
     - Installez `stripe` via `npm i stripe`.
     - Créez une session `stripe.checkout.sessions.create` avec le produit à 4,99 €/mois.
     - Écoutez le webhook `customer.subscription.created` pour synchroniser le statut de l'utilisateur.

3. **Base de données SQL (Optionnel)** :
   - La persistance actuelle utilise un moteur de stockage sécurisé avec écriture atomique dans `.data/scamcheck_db.json`.
   - Pour passer à PostgreSQL ou Cloud SQL, remplacez les méthodes de `server/db.ts` par votre ORM préféré (Drizzle ou Prisma).
