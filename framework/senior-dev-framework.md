# PRAGMA Senior Dev Framework v2.0

> Le framework qui transforme le vibe coding en code production-grade.
> Codifie 40 ans d'expérience senior dev en règles applicables par l'IA.
> **v2.0** : sécurité profonde, maintenance, debug, rollback, raisonnement senior.

**Auteur :** PRAGMA Studio
**Date :** 15 février 2026
**Statut :** Standard obligatoire pour tous les projets PRAGMA
**Sources :** v1.0 + recherche maintenance Marwane + architecture Daily Hub V1

---

## Pourquoi c'est un Framework de Senior Dev

> **"Si un senior dev avec 40 ans d'XP ne le ferait pas, l'IA ne doit pas le faire."**

### Le problème résolu

*"Tu ne peux pas vibe coder une app avec l'IA sans être dev, l'IA fait n'importe quoi."*

**Notre réponse :** Un senior ne code pas mieux parce qu'il tape plus vite. Il code mieux parce qu'il a des **règles mentales** forgées par l'expérience. Ce framework codifie ces règles et les impose à l'IA.

### Junior vs Senior — 10 Dimensions

| Dimension | Junior | Senior (ce framework) |
|-----------|--------|----------------------|
| **Architecture** | Freestyle, "ça marche" | Template choisi AVANT de coder |
| **Sécurité** | "J'ajouterai plus tard" | Security-first, RLS dès le jour 1 |
| **Tests** | "Ça marche sur ma machine" | Pyramide de tests, coverage > 80% |
| **Erreurs** | `console.log` partout | Logger structuré, Sentry, alerting |
| **Debug** | Panique, tout casser | Méthodologie 5 étapes, post-mortem |
| **Déploiement** | Push sur main en priant | CI/CD, staged rollout, rollback plan |
| **Maintenance** | "On verra quand ça casse" | Monitoring proactif, SLA, checklists |
| **Documentation** | README vide | Architecture, API, troubleshooting à jour |
| **Données** | "SELECT * FROM..." | Migrations versionnées, backup, PITR |
| **Communication** | Silence radio | Templates incident, post-mortem, SLA |

### Pourquoi ça marche avec l'IA

L'IA est un **exécutant parfait mais sans jugement**. Ce framework lui donne le jugement :
- **Règles explicites** → l'IA ne peut pas dévier
- **Checklists** → rien n'est oublié
- **Templates** → la structure est imposée
- **Limites** → l'IA sait ce qu'elle NE DOIT PAS faire

**Résultat :** Un non-dev avec ce framework + IA produit du code plus structuré que beaucoup de devs juniors sans framework.

---

## Table des matières

1. [Templates d'Architecture](#1-templates-darchitecture-obligatoires)
2. [Règles de Structure](#2-règles-de-structure-de-projet)
3. [Tests Obligatoires](#3-tests-obligatoires)
4. [Linter + Formatter](#4-linter--formatter-imposés)
5. [CI/CD](#5-cicd-qui-bloque-sans-tests)
6. [Sécurité Complète](#6-sécurité--la-section-complète)
7. [Maintenance & Opérations](#7-maintenance--opérations)
8. [Debug & Troubleshooting](#8-debug--troubleshooting)
9. [Rollback & Recovery](#9-rollback--recovery)
10. [Edge Cases & Robustesse](#10-edge-cases--robustesse)
11. [Logging Structuré](#11-logging-structuré)
12. [Caching Strategy](#12-caching-strategy)
13. [API Design Standards](#13-api-design-standards)
14. [Feature Flags & Progressive Delivery](#14-feature-flags--progressive-delivery)
15. [Git Hygiene](#15-git-hygiene)
16. [Gestion des Dépendances](#16-gestion-des-dépendances)
17. [Performance Budgets](#17-performance-budgets)
18. [Accessibilité](#18-accessibilité)
19. [Documentation](#19-documentation)
20. [Boundaries IA](#20-boundaries--limitations-pour-lia)
21. [RGPD & Legal](#21-rgpd--legal)
22. [Checklists Opérationnelles](#22-checklists-opérationnelles)

---

## 1. Templates d'Architecture Obligatoires

Chaque projet DOIT choisir un template AVANT de coder. Pas de freestyle.

### Template A — Monolith Moderne (Next.js + Supabase)
> Pour : Apps SaaS, dashboards, outils internes

```
Architecture :
├── Frontend : Next.js App Router (React Server Components)
├── Backend : Next.js API Routes
├── DB : Supabase PostgreSQL
├── Auth : Supabase Auth
├── Storage : Supabase Storage
└── Deploy : Vercel

Structure obligatoire :
app/
├── (auth)/              # Routes publiques (login, signup)
├── (dashboard)/         # Routes protégées (layout commun)
├── api/                 # API routes
components/
├── ui/                  # Composants UI réutilisables (shadcn/ui)
├── features/            # Composants métier par feature
lib/
├── supabase/            # Client Supabase + types
├── utils/               # Utilitaires
├── hooks/               # Custom hooks
supabase/
├── migrations/          # Migrations SQL
├── seed.sql             # Données de seed
```

**Règles :**
- ✅ Server Components par défaut, Client Components uniquement si nécessaire
- ✅ RLS activé sur TOUTES les tables Supabase
- ✅ Types générés automatiquement depuis le schema DB
- ✅ Pas de logique métier dans les composants UI
- ✅ Toutes les routes API doivent valider l'auth

---

### Template B — Microservices (Docker + API Gateway)
> Pour : Apps complexes avec plusieurs domaines métier

```
Structure obligatoire (par service) :
service-name/
├── src/
│   ├── api/             # Routes HTTP
│   ├── domain/          # Logique métier (DDD)
│   ├── infrastructure/  # DB, external APIs
│   └── shared/          # Utils partagés
├── tests/
├── Dockerfile
└── docker-compose.yml
```

**Règles :**
- ✅ Chaque service a sa propre DB (ou schema dédié)
- ✅ Communication via API REST ou message queue
- ✅ Health checks obligatoires sur chaque service
- ✅ Logs centralisés (stdout → aggregator)

---

### Template C — Serverless (Vercel / Supabase Edge Functions)
> Pour : APIs légères, webhooks, automations

**Règles :** Stateless, cold start < 500ms, validation Zod, gestion d'erreurs explicite

### Template D — JAMstack (Static + API)
> Pour : Sites vitrine, blogs, landing pages

**Règles :** Build time < 2 min, Lighthouse > 90, images optimisées, SEO

### Template E — Domain-Driven Design (DDD)
> Pour : Apps complexes avec logique métier riche

**Règles :** Domain ne dépend de RIEN, Repositories = interfaces, Value Objects immutables

---

## 2. Règles de Structure de Projet

### Séparation des Responsabilités

```
❌ INTERDIT : app/page.tsx avec 500 lignes (UI + logique + fetch)

✅ OBLIGATOIRE :
  app/page.tsx          → UI uniquement (< 100 lignes)
  lib/hooks/useData.ts  → Logique de fetch
  lib/services/api.ts   → Appels API
  components/Feature.tsx → Composants métier
```

> **Raisonnement senior :** La séparation des responsabilités n'est pas de l'académisme — c'est ce qui permet de debugger en 5 min au lieu de 2h. Quand la logique est mélangée, chaque bug nécessite de comprendre TOUT le fichier.

### Naming Conventions

```
✅ Fichiers :
  Components → PascalCase (UserCard.tsx)
  Hooks → camelCase + use (useAuth.ts)
  Utils → camelCase (formatDate.ts)
  Types → PascalCase (User.ts)
  Constants → UPPER_SNAKE_CASE (API_URL.ts)

✅ Fonctions :
  Verbes pour actions → getUserById, createOrder, validateEmail
  is/has pour booléens → isValid, hasPermission, canEdit
```

### Taille des Fichiers

```
❌ Fichier > 300 lignes → REFACTOR obligatoire
✅ Fichier < 200 lignes → Idéal
✅ Fonction < 50 lignes → Idéal
✅ Composant React < 150 lignes → OK
```

### Configuration Obligatoire à la Racine

```
✅ .env.example          (jamais de .env committé)
✅ .gitignore
✅ README.md             (instructions setup complètes)
✅ package.json
✅ tsconfig.json         (strict: true)
✅ .eslintrc.json
✅ .prettierrc
```

---

## 3. Tests Obligatoires

> **Raisonnement senior :** Un senior ne déploie JAMAIS sans tests. Un junior teste "quand il a le temps", un senior teste EN MÊME TEMPS qu'il code. C'est non-négociable.

### Pyramide de Tests

| Couche | Part | Quoi | Outil | Quand |
|--------|------|------|-------|-------|
| **Unit** | 60% | Business logic, utils, hooks | Vitest/Jest | Chaque commit |
| **Intégration** | 30% | Routes API, composants ensemble | Testing Library | Chaque PR |
| **E2E** | 10% | Parcours critiques complets | Playwright | Pre-deploy |

### Stratégie Vibe Coding (Black Box Testing)

| Phase | Quand | Quoi | Qui |
|-------|-------|------|-----|
| **Tests itératifs** | À chaque changement | Le changement spécifique | IA + toi |
| **Tests intégration** | Après chaque feature | Tout s'emboîte ? | IA |
| **Tests E2E** | Avant go-live | Parcours utilisateur complets | Toi + Agent Web |

**Règle d'or :** Si tu changes quelque chose, teste immédiatement avant de passer à autre chose.

### Template Scénario E2E

```markdown
## Scénarios de test — [App]

### Parcours 1 : Création de compte
- [ ] Aller sur l'écran d'inscription
- [ ] Remplir le formulaire
- [ ] Recevoir confirmation
- [ ] Être redirigé vers le dashboard

### Parcours 2 : [Feature critique]
- [ ] ...
```

### Coverage Minimum

```
✅ lib/ et domain/ : > 80%
✅ API routes : > 70%
✅ Components : > 50% (focus logique, pas UI)
```

---

## 4. Linter + Formatter Imposés

### ESLint

```json
{
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "prefer-const": "error",
    "no-var": "error"
  }
}
```

### Prettier

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

**Règles :**
- ✅ Pre-commit hook obligatoire (Husky + lint-staged)
- ✅ Formatter auto on save
- ✅ Pas de `any` TypeScript (sauf cas exceptionnel justifié en commentaire)
- ✅ Pas de `console.log` en prod → utiliser le logger (§11)

---

## 5. CI/CD qui Bloque sans Tests

> **Raisonnement senior :** Un senior ne merge JAMAIS sur main si la CI ne passe pas. C'est le filet de sécurité automatisé. Sans CI, c'est du déploiement YOLO — et le YOLO finit toujours par un appel à 3h du matin.

### Pipeline Complet

```
Git Push → Lint + Format → Tests unit → Tests intégration
→ Security scan (npm audit) → Build → Type check
→ {develop → Staging, main → Production}
→ Staged rollout (10% → 50% → 100%)
→ Monitoring post-deploy (15 min watch)
```

### GitHub Actions (Template)

```yaml
name: CI
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test
      - run: npm audit --audit-level=high
      - run: npm run build

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

### Environnements

| Env | Usage | Data | Accès |
|-----|-------|------|-------|
| Local | Dev | Seed data | Dev |
| Staging | Tests intégration | Clone prod anonymisé | Équipe |
| Production | Users réels | Live | Deploy automatisé uniquement |

### Branching Strategy

```
main       ────●─────────●───── (production, protégée)
               ↑          ↑
develop    ──●─┤──●──●──●─┤──── (intégration)
             ↑    ↑     ↑
feature/   ─●─  ─●─  ──●──     (features, nommées feature/xxx)
```

---

## 6. Sécurité — La Section Complète

> **Raisonnement senior :** Un junior ajoute l'auth "à la fin". Un senior commence par l'auth. La sécurité n'est pas un "nice to have" — c'est le **fondement**. Chaque feature commence par "qui a le droit d'accéder à ça ?".

### 6.1 Les 3 Couches de Sécurité

| Couche | Question | Outils |
|--------|----------|--------|
| **Authentification** | Qui es-tu ? | Supabase Auth, JWT |
| **Autorisation** | Qu'as-tu le droit de faire ? | RLS, RBAC, Middleware |
| **Protection des données** | Comment on protège ? | HTTPS, Encryption, Env vars |

### 6.2 Auth — Flow Complet

```
LOGIN FLOW
──────────
1. User → Login (email + mdp)
2. App → Supabase Auth : Authenticate
3. Auth → DB : Verify hash (bcrypt/argon2) — JAMAIS en clair
4. Auth → App : Access Token (15min) + Refresh Token (30j)
5. App : Stockage sécurisé
   - Web : httpOnly cookie (pas localStorage pour les tokens !)
   - iOS : Keychain
   - Android : EncryptedSharedPreferences

UTILISATION
───────────
6. App → API : Requête + Bearer Token → 200 OK
7. Token expiré → Refresh transparent (invisible pour l'user)
8. Refresh expiré (30j) → Re-login obligatoire

SÉCURITÉ
────────
- Rate limiting login : 5 tentatives/min, block 15 min après
- Brute force : delay exponentiel après 3 échecs
- Password reset : token unique, expiration 1h
```

### 6.3 RLS — Row Level Security (Supabase)

```sql
-- RÈGLE 1 : Un user ne voit que SES données
CREATE POLICY "users_own_data" ON table_name
FOR ALL USING (user_id = auth.uid());

-- RÈGLE 2 : Un admin voit tout
CREATE POLICY "admin_all" ON table_name
FOR ALL USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- RÈGLE 3 : Insert — le user ne peut créer que pour lui-même
CREATE POLICY "users_insert_own" ON table_name
FOR INSERT WITH CHECK (user_id = auth.uid());

-- RÈGLE 4 : Service role bypass (pour les edge functions)
-- Le service_role key bypass le RLS — JAMAIS côté client
```

**Test critique pré-go-live :** Un user peut-il voir les données d'un autre ? → La réponse DOIT être **NON**.

### 6.4 RBAC — Rôles et Permissions

| Rôle | Ses données | Données équipe | Admin panel | Gérer users |
|------|:-----------:|:--------------:|:-----------:|:-----------:|
| User | ✅ | ❌ | ❌ | ❌ |
| Manager | ✅ | ✅ | ❌ | ❌ |
| Admin client | ✅ | ✅ | ✅ | ✅ |
| PRAGMA Support | ✅ (tracé) | ✅ (tracé) | ✅ (lecture) | ❌ |

**Modèles d'onboarding utilisateur :**

| Modèle | Quand |
|--------|-------|
| Admin crée les comptes | Apps très contrôlées (recommandé B2B) |
| Code d'invitation | Apps B2B avec auto-inscription |
| Lien public | Apps grand public |

### 6.5 Les 12 Points de Sécurité

1. **Auth & Autorisation** — Routes protégées vérifient l'auth, RLS activé, JWT < 1h
2. **Validation Inputs** — Zod sur toutes les API, double couche (client UX + serveur sécurité), sanitization XSS
3. **HTTPS & CORS** — HTTPS + HSTS, CORS whitelist (pas `*`), CSP headers
4. **Secrets** — .env jamais committé, .env.example à jour, chiffrement AES-256-GCM si stockage clés, rotation 90j
5. **SQL Injection** — SDK uniquement, jamais de raw SQL avec input user, prepared statements
6. **Dépendances** — `npm audit` chaque deploy, Dependabot, pas de deprecated
7. **Logs** — Jamais de données sensibles (mots de passe, tokens, PII) dans les logs
8. **RGPD** — Consentement opt-in, export données, droit à l'oubli, notification breach 72h
9. **Backup** — Automatique quotidien, plan de restore documenté et testé mensuellement
10. **Error Handling** — Pas de stack traces en prod, messages génériques côté user, logs détaillés côté serveur
11. **File Upload** — Validation type MIME + extension, limite taille (ex: 10MB), scan si fichiers publics
12. **API Keys** — Jamais côté client, scopes limités, révocation possible, rotation programmée

### 6.6 Failles Courantes

| Faille | Risque | Prévention |
|--------|--------|-----------|
| **Injection SQL** | Accès direct DB | SDK uniquement, jamais raw SQL avec input |
| **XSS** | Script malicieux client | React auto-escape + CSP headers |
| **CSRF** | Action non voulue | Tokens CSRF (Supabase Auth gère) |
| **Clés API exposées** | Accès total DB | Env vars, JAMAIS dans le code |
| **RLS désactivé** | Tout visible | Toujours activer en prod |
| **Enum sans contrainte** | Données incohérentes | CHECK constraints en DB |
| **Token en localStorage** | Vol de session (XSS) | httpOnly cookies pour les tokens |
| **IDOR** | Accès données d'autres users | Toujours vérifier ownership côté serveur |

### 6.7 Accès aux Données Client

**Clause contrat obligatoire :**
> "PRAGMA peut accéder aux données du Client à des fins de maintenance, debug et amélioration du service. Ces accès sont tracés et limités au strict nécessaire."

**Bonnes pratiques :**
- Accès uniquement pour debug, jamais par curiosité
- Demander l'accord du client avant
- Logger les accès (qui, quand, pourquoi)
- Jamais exporter les données sur son ordi
- Compte "PRAGMA Support" dans chaque app (tracé, transparent)

---

## 7. Maintenance & Opérations

> **Raisonnement senior :** "Le build c'est 10%. La maintenance c'est 90%." Un junior pense que c'est fini quand l'app "marche". Un senior sait que le vrai travail commence APRÈS le déploiement. C'est la différence entre une démo et un produit.

### 7.1 Les Couches Post-Build

```
V1 Fonctionnel → Robustesse (edge cases) → Infrastructure (auth, DB, API)
→ Observabilité (monitoring, logs, alerting) → Intelligence (analytics, feature flags)
→ Distribution (stores, notifs) → Compliance (RGPD, CGU)
→ Performance (optimisation réelle) → Évolution (feature requests)
→ ↺ Observabilité (boucle continue)
```

### 7.2 Monitoring — Savoir AVANT les utilisateurs

| Besoin | Outil | Coût | Priorité |
|--------|-------|------|----------|
| Erreurs & crashes | **Sentry** | Gratuit < 5k events | 🔴 Immédiat |
| Uptime | **Uptime Robot** | Gratuit | 🔴 Immédiat |
| Métriques app | **Vercel Analytics** | Inclus | 🔴 Immédiat |
| DB queries | **Supabase Dashboard** | Inclus | 🔴 Immédiat |
| Analytics produit | **PostHog** | Gratuit self-hosted | 🟠 Après 1er client |
| Métriques infra | **Grafana** | Freemium | 🟡 Plus tard |

### 7.3 Alertes — Seuils et Actions

| Quoi | Seuil | Notification | Action |
|------|-------|-------------|--------|
| API down | 2 checks failed | SMS + appel | Rollback ou fix immédiat |
| Error rate > 5% | 5 min soutenu | Slack + SMS | Investiguer immédiatement |
| Latence P95 > 2s | 5 min soutenu | Slack | Optimiser requête |
| CPU > 80% | 5 min soutenu | Slack | Upgrade ou optimiser |
| DB connections > 80% | Du pool max | Slack | Connection pooling |
| Storage > 80% | Du max | Slack | Prévenir client |
| Certificat SSL < 14j | Expiration | Email | Renouveler |

### 7.4 Protocole d'Incident

```
1. ALERTE reçue (automatique via Sentry/Uptime Robot)
2. ACKNOWLEDGE < 15 min (on a vu, on prend en charge)
3. SÉVÉRITÉ (P0/P1/P2/P3)
4. COMMUNIQUER (status page si P0/P1, email client)
5. DIAGNOSTIQUER (logs + métriques + reproduction)
6. DÉCIDER : Fix rapide OU Rollback
7. APPLIQUER + VÉRIFIER
8. POST-MORTEM dans les 48h (P0/P1 obligatoire)
```

| Sévérité | Définition | Réponse | Résolution |
|----------|-----------|---------|-----------|
| **P0** | App totalement down | < 15 min | < 1h |
| **P1** | Feature critique cassée | < 30 min | < 4h |
| **P2** | Bug important, contournable | < 2h | < 24h |
| **P3** | Bug mineur / cosmétique | < 24h | Prochain sprint |

### 7.5 SLA Standard PRAGMA

| Métrique | Engagement |
|----------|-----------|
| Disponibilité | 99.5% (max ~43h downtime/an) |
| Latence API P95 | < 500ms |
| Résolution P0 | < 4h |
| Résolution P1 | < 24h |
| Maintenance planifiée | < 4h/mois, annoncée 48h avant |
| Backup restaurable | < 1h |

### 7.6 Communication Incidents

**Email 1 — Détection (immédiat) :**
```
Objet : [PRAGMA] Incident détecté sur [App] - Intervention en cours
Corps : Problème détecté, notre équipe intervient. Mise à jour dès résolution.
```

**Email 2 — Résolution :**
```
Objet : [PRAGMA] Incident résolu sur [App]
Corps : Cause : [X]. Action : [Y]. Tout fonctionne normalement.
```

**Automatisation future :** Sentry → n8n → email auto au client + alerte Slack interne.

### 7.7 Maintenance Mensuelle

- Revue crashs/erreurs Sentry
- `npm audit` — pas de vulnérabilités critiques
- Test restauration backup (LE FAIRE, pas juste "on a des backups")
- Mise à jour dépendances (security patches)
- `npx knip` — vérification code mort
- Revue performances
- Rapport au client

---

## 8. Debug & Troubleshooting

> **Raisonnement senior :** Un junior panique quand ça casse et modifie le code au hasard. Un senior a une **méthodologie**. Il isole, reproduit, diagnostique, fixe, et documente. Chaque bug résolu rend le système plus fort.

### 8.1 Méthodologie en 5 Étapes

```
1. REPRODUIRE    → Reproduire le bug systématiquement
                   - Quelles étapes exactes ?
                   - Sur quel environnement ?
                   - Avec quelles données ?

2. ISOLER        → Trouver le composant en cause
                   - Front ? (UI, state, rendu)
                   - API ? (route, validation, logique)
                   - DB ? (requête, RLS, données)
                   - Infra ? (réseau, timeout, config)

3. DIAGNOSTIQUER → Lire les indices
                   - Logs serveur (Vercel Functions)
                   - Logs DB (Supabase Dashboard)
                   - Console navigateur (Network tab)
                   - Sentry (stack trace + contexte)

4. FIXER         → Fix minimal et ciblé
                   - PAS de refactor opportuniste pendant un fix
                   - Un fix = un commit = un problème résolu
                   - Tester le fix avant de deploy

5. DOCUMENTER    → Capitaliser
                   - Ajouter à troubleshooting.md
                   - Post-mortem si P0/P1
                   - Quoi, pourquoi, comment on a fixé
```

### 8.2 Codes HTTP — Guide Rapide

| Code | Signification | Checklist |
|------|--------------|-----------|
| 400 | Requête malformée | ☐ Body valide ? ☐ Content-Type correct ? ☐ Champs requis ? |
| 401 | Non authentifié | ☐ Token présent ? ☐ Token expiré ? ☐ Header Authorization ? |
| 403 | Pas les droits | ☐ RLS policy ? ☐ Rôle correct ? ☐ Ownership vérifié ? |
| 404 | Introuvable | ☐ URL correcte ? ☐ Donnée existe ? ☐ Soft delete ? |
| 422 | Validation | ☐ Format des données ? ☐ Contraintes CHECK ? |
| 429 | Rate limit | ☐ Trop de requêtes ? ☐ Retry-After header ? |
| 500 | Erreur serveur | ☐ Stack trace dans logs ☐ DB accessible ? ☐ Env vars ? |

### 8.3 Post-Mortem Template

Après chaque P0/P1, dans les 48h :

```markdown
## Post-Mortem — [Date] — [Titre court]

**Sévérité :** P0/P1
**Durée :** De [début] à [fin] ([durée totale])
**Impact :** [Nb users affectés, features impactées]

### Timeline
- HH:MM — Alerte reçue / signalement
- HH:MM — Diagnostic : [cause identifiée]
- HH:MM — Fix appliqué / rollback
- HH:MM — Vérifié, situation normale

### Cause racine
[Explication technique claire]

### Résolution
[Ce qu'on a fait concrètement]

### Actions préventives
- [ ] [Action 1 pour que ça ne se reproduise pas]
- [ ] [Action 2]
```

### 8.4 Troubleshooting.md (Document Vivant)

Chaque bug résolu est ajouté → la base de connaissances grandit → les prochains bugs se fixent plus vite.

```markdown
## Erreur : "[Message d'erreur]"
**Contexte :** [Quand ça arrive]
**Cause :** [Pourquoi]
**Solution :** [Comment fixer]
**Date :** [Quand on a eu le problème]
```

---

## 9. Rollback & Recovery

> **Raisonnement senior :** Un senior ne déploie JAMAIS sans plan de rollback. La question n'est pas "est-ce que ça va casser ?" mais "QUAND ça casse, comment on revient ?". Toujours avoir une sortie de secours. Le rollback plan est écrit AVANT le deploy, pas pendant la panique.

### 9.1 Rollback Code (Vercel — 2 clics)

```
1. L'app crash après un déploiement
2. Identifier que c'est le nouveau code (pas la DB, pas l'infra)
3. Vercel Dashboard → Deployments
4. Trouver le déploiement qui marchait (avant le bug)
5. Cliquer "..." → "Promote to Production"
6. L'ancienne version est en prod (~30 secondes)
7. Fixer tranquillement sur branche dev
8. Redéployer quand c'est stable et testé
```

Vercel garde l'historique de TOUS les déploiements. On peut toujours revenir en arrière.

### 9.2 Rollback Base de Données

Plus délicat que le code — les données évoluent en temps réel.

| Mécanisme | Fréquence | Rétention | RTO |
|-----------|-----------|-----------|-----|
| Point-in-time recovery (PITR) | Continu | 30 jours | < 30 min |
| Snapshot automatique | Toutes les 6h | 7 jours | < 1h |
| Full backup | Quotidien 3h AM | 90 jours | < 1h |
| **Test de restauration** | **Mensuel** | — | Validation |

**RTO cible** (temps de restauration) : < 1h
**RPO cible** (données perdues max) : < 6h

**Règle absolue :** Ne JAMAIS faire de migration destructive en production sans backup manuel AVANT.

### 9.3 Règles de Migration DB (6 commandements)

1. **Numérotée** et horodatée (`001_create_users.sql`, `002_add_roles.sql`)
2. **Réversible** — chaque `up()` a un `down()`
3. **Testée en staging** avant production
4. **Non-destructive** — pas de `DROP TABLE` sans plan de migration des données
5. **Backward-compatible** — l'ancienne version de l'app doit fonctionner pendant la migration
6. **Précédée d'un backup** — snapshot complet avant chaque migration prod

### 9.4 Quand Rollback vs Fix Forward

| Situation | Action | Pourquoi |
|-----------|--------|----------|
| App totalement cassée (P0) | **Rollback immédiat** | Chaque seconde coûte |
| Bug sur une feature, le reste marche | **Fix forward** | Rollback casserait les bons changements |
| Migration DB a corrompu des données | **Restaurer backup** + analyser | Les données sont la priorité |
| Bug mineur introduit | **Fix forward** dans les heures | Pas assez grave pour rollback |
| Pas sûr de la cause | **Rollback d'abord**, investiguer ensuite | Restaurer le service d'abord |

### 9.5 Staged Rollout

Jamais 100% d'un coup : **10% → 50% → 100%**.
- Problème au 1er palier → 300 personnes impactées au lieu de 3 000
- Chaque palier : monitoring 15 min minimum avant le suivant
- Si error rate monte → stop immédiat + rollback

---

## 10. Edge Cases & Robustesse

> **Raisonnement senior :** Avec des vrais users, chaque friction est amplifiée. Un senior anticipe les edge cases AVANT la prod, pas après les premiers tickets de support.

### Validation Double Couche

```
┌─────────────────────────────────────────────────────┐
│  Client → valide pour l'UX (feedback immédiat)      │
│  Serveur → valide pour la sécurité (vérité)         │
│  Ne JAMAIS faire confiance aux données côté client  │
└─────────────────────────────────────────────────────┘
```

### Edge Cases par Catégorie

| Catégorie | Problème | Solution |
|-----------|----------|----------|
| **Formulaires** | Double-clic → doublon | Debounce + token d'idempotence |
| **Formulaires** | Champ vide soumis | Validation client + serveur, NOT NULL en DB |
| **Formulaires** | Copier-coller HTML | Strip HTML sur tous les inputs |
| **Formulaires** | 10 000 caractères | Max length + troncature |
| **Réseau** | Perte connexion mid-action | Queue offline + retry auto |
| **Réseau** | 3G lente | Skeleton screens + timeouts progressifs |
| **Données** | Liste vide (0 résultats) | Empty state dédié avec message et CTA |
| **Données** | Liste 1000+ items | Virtualisation + pagination cursor-based |
| **Données** | Donnée supprimée référencée ailleurs | Soft delete + cascade checks |
| **Device** | Rotation écran pendant formulaire | State persisté |
| **Device** | Police système très grande | Unités relatives (rem) |

### Contraintes DB Obligatoires

```sql
-- Enum : jamais de saisie libre quand on veut un menu
ALTER TABLE items ADD CONSTRAINT valid_status
CHECK (status IN ('active', 'inactive', 'archived'));

-- Obligatoire : pas de données incomplètes
ALTER TABLE users ALTER COLUMN email SET NOT NULL;

-- Relations : pas de données orphelines
ALTER TABLE notes ADD CONSTRAINT fk_user
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Unicité : pas de doublons
ALTER TABLE users ADD CONSTRAINT unique_email UNIQUE (email);
```

---

## 11. Logging Structuré

> **Raisonnement senior :** `console.log("ici")` c'est du debug de débutant. Un senior a un logger structuré avec des niveaux, du contexte, et jamais de données sensibles.

### Niveaux de Log

| Niveau | Quand | Exemple |
|--------|-------|---------|
| **ERROR** | L'app ne peut pas continuer | Connexion DB échouée, API return 500 |
| **WARN** | Comportement inattendu mais géré | Rate limit atteint, retry, deprecation |
| **INFO** | Événements importants normaux | User login, paiement reçu, deploy |
| **DEBUG** | Détails techniques (dev only) | Requête SQL, payload API, state |

### Règles de Logging

```
✅ À FAIRE :
  - Logger les actions métier (login, create, delete)
  - Logger les erreurs avec contexte (userId, requestId, endpoint)
  - Logger les performances (temps de requête)
  - Utiliser un format structuré (JSON)

❌ NE JAMAIS LOGGER :
  - Mots de passe (même hashés)
  - Tokens JWT / refresh tokens
  - Numéros de carte bancaire
  - Données personnelles sensibles (santé, etc.)
  - Clés API / secrets
```

### Format Structuré

```json
{
  "level": "error",
  "message": "Failed to create user",
  "timestamp": "2026-02-15T17:00:00Z",
  "requestId": "req_abc123",
  "userId": "user_xyz",
  "error": "duplicate key value violates unique constraint"
}
```

### Implémentation Recommandée

- **Dev :** `console.warn/error` avec préfixes
- **Prod :** Sentry pour les erreurs, Vercel logs pour les API routes
- **Future :** Winston ou Pino si on a besoin de logs structurés avancés

---

## 12. Caching Strategy

> **Raisonnement senior :** Un junior fait un fetch à chaque rendu. Un senior met en cache intelligemment — il sait quoi cacher, combien de temps, et surtout quand invalider.

### Stratégie par Type de Donnée

| Type | Stratégie | TTL | Invalidation |
|------|-----------|-----|-------------|
| Profil utilisateur | Cache-first | 5 min | On mutation |
| Listes / feeds | Stale-while-revalidate | 1 min | Background refresh |
| Médias (images) | Cache-first | 30 jours | URL versionnée |
| Config / feature flags | Network-first | 15 min | Webhook/push |
| Données sensibles/temps réel | Network-only | 0 | Jamais cachées |

### Outils

| Couche | Outil | Quand |
|--------|-------|-------|
| **Frontend** | TanStack Query / SWR | Toujours — gestion auto du cache API |
| **CDN** | Vercel Edge / Cloudflare | Assets statiques, images |
| **Backend** | Redis (optionnel) | Sessions, données fréquentes, rate limiting |

### Règles

- ✅ Utiliser TanStack Query ou SWR pour TOUT le data fetching React
- ✅ Query keys cohérentes (`['users', userId]`, `['tasks', { status: 'todo' }]`)
- ✅ Invalidation on mutation (après POST/PUT/DELETE → refetch)
- ❌ Ne jamais cacher des données sensibles côté client
- ❌ Ne jamais servir du cache périmé pour des données financières

---

## 13. API Design Standards

> **Raisonnement senior :** Un senior ne crée pas des endpoints au hasard. Il suit des conventions REST que TOUT dev comprend instantanément. Une bonne API est prévisible.

### Conventions REST

```
GET    /api/users          → Liste (avec pagination)
GET    /api/users/:id      → Détail
POST   /api/users          → Créer
PUT    /api/users/:id      → Modifier (complet)
PATCH  /api/users/:id      → Modifier (partiel)
DELETE /api/users/:id      → Supprimer
```

### Format de Réponse Standardisé

**Succès :**
```json
{
  "data": { "id": "uuid", "name": "John" },
  "meta": { "total": 100, "page": 1 }
}
```

**Erreur :**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Le champ email est invalide",
    "details": [{ "field": "email", "rule": "format" }],
    "requestId": "req_abc123"
  }
}
```

### Messages Utilisateur par Code HTTP

| Code | Message affiché à l'utilisateur |
|------|-------------------------------|
| 400 | "Vérifiez les informations saisies" |
| 401 | "Veuillez vous reconnecter" |
| 403 | "Vous n'avez pas accès à cette ressource" |
| 404 | "L'élément demandé n'existe plus" |
| 429 | "Trop de requêtes, réessayez dans X secondes" |
| 500 | "Un problème est survenu. Notre équipe est informée." |
| 503 | "Maintenance en cours. Retour prévu à HH:MM." |

### Rate Limiting

| Endpoint | Limite | Fenêtre | Si dépassé |
|----------|--------|---------|-----------|
| Login / Register | 5 req | 1 min | Block 15 min |
| GET (lecture) | 200 req | 1 min | 429 + Retry-After |
| POST/PUT/DELETE | 50 req | 1 min | 429 + queue |
| Upload fichiers | 10 req | 5 min | 429 + message |

### Pagination

```
GET /api/tasks?page=1&limit=20
GET /api/tasks?cursor=abc123&limit=20  (cursor-based, recommandé)
```

### Validation des Inputs (Zod)

```typescript
import { z } from 'zod';

const CreateUserSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  role: z.enum(['user', 'admin']).default('user'),
});

// Dans la route API :
const result = CreateUserSchema.safeParse(body);
if (!result.success) {
  return Response.json({ error: result.error }, { status: 400 });
}
```

---

## 14. Feature Flags & Progressive Delivery

> **Raisonnement senior :** Un senior ne déploie pas une feature en mode "tout ou rien". Il la déploie derrière un flag, teste avec 10% des users, et active pour tout le monde quand c'est validé. Si ça casse, il désactive en 1 seconde sans rollback de code.

### Quand utiliser un Feature Flag

| Situation | Flag ? |
|-----------|--------|
| Nouvelle feature pas encore finalisée | ✅ Oui |
| Refactoring risqué | ✅ Oui |
| A/B test | ✅ Oui |
| Bugfix simple | ❌ Non |
| Configuration | ❌ Non (utiliser des env vars) |

### Implémentation Simple

```typescript
// lib/feature-flags.ts
const FLAGS = {
  NEW_DASHBOARD: process.env.NEXT_PUBLIC_FF_NEW_DASHBOARD === 'true',
  AI_CHAT: process.env.NEXT_PUBLIC_FF_AI_CHAT === 'true',
};

// Usage
if (FLAGS.NEW_DASHBOARD) {
  return <NewDashboard />;
}
return <OldDashboard />;
```

### Implémentation Avancée (PostHog)

```typescript
// Avec PostHog : rollout progressif, targeting par user/segment
const showFeature = posthog.isFeatureEnabled('new-onboarding');
```

### Règles

- ✅ Nommer clairement (`NEW_CHECKOUT_FLOW`, pas `FF_1`)
- ✅ Supprimer les flags après activation complète (pas de dette technique)
- ✅ Documenter chaque flag actif (dans le README ou un fichier dédié)
- ✅ Un flag mort (> 30j activé pour tout le monde) → supprimer le code conditionnel

---

## 15. Git Hygiene

> **Raisonnement senior :** L'historique Git est un outil de debug. Si les commits sont propres, on peut bisect en 5 min pour trouver quel commit a introduit un bug. Si c'est "wip" et "fix", c'est inutilisable.

### Commits Conventionnels

```
Format : type(scope): description

Types :
  feat     → Nouvelle feature
  fix      → Bugfix
  docs     → Documentation
  style    → Formatting (pas de changement fonctionnel)
  refactor → Restructuration sans changement fonctionnel
  test     → Ajout/modification de tests
  chore    → Maintenance (deps, config)

Exemples :
  feat(auth): add magic link login
  fix(tasks): prevent duplicate creation on double-click
  docs(api): add POST /api/users documentation
  chore(deps): update next.js to 15.1
```

### Règles

```
✅ UN commit = UN changement logique
✅ Message en anglais, impératif ("add" pas "added")
✅ Jamais de "wip", "fix", "test", "asdf" seul
✅ Ne JAMAIS commit .env, node_modules, .next
✅ git pull --rebase avant push (éviter les merge commits inutiles)
```

### Branch Naming

```
feature/add-calendar-view
fix/task-duplicate-on-double-click
hotfix/login-500-error
chore/update-dependencies
```

### .gitignore Standard

```
node_modules/
.next/
.env
.env.local
.env.*.local
*.log
.DS_Store
dist/
coverage/
.turbo/
```

---

## 16. Gestion des Dépendances

> **Raisonnement senior :** Chaque dépendance est une surface d'attaque ET une dette de maintenance. Un senior n'ajoute une dep que si le bénéfice justifie le coût.

### Avant d'ajouter une Dépendance

```
☐ Est-ce qu'on peut faire sans ? (souvent oui pour < 50 lignes de code)
☐ Le package est-il activement maintenu ? (dernier commit < 6 mois)
☐ Combien de téléchargements/semaine ? (> 10k minimum)
☐ Y a-t-il des vulnérabilités connues ? (npm audit)
☐ Quelle taille ajoutée au bundle ? (bundlephobia.com)
☐ La licence est-elle compatible ? (MIT, Apache OK — GPL attention)
```

### Maintenance des Dépendances

| Action | Fréquence | Outil |
|--------|-----------|-------|
| Security audit | Chaque deploy + mensuel | `npm audit` |
| Mise à jour patch | Hebdomadaire (auto) | Dependabot |
| Mise à jour mineure | Mensuelle | Manuel + tests |
| Mise à jour majeure | Trimestrielle | Manuel + migration guide |

### Lock File

- ✅ TOUJOURS committer `package-lock.json`
- ✅ TOUJOURS utiliser `npm ci` en CI (pas `npm install`)
- ❌ Ne JAMAIS modifier le lock file manuellement

---

## 17. Performance Budgets

> **Raisonnement senior :** La démo en interne est fluide avec 10 profils fictifs. Avec de vrais users, de vraies données, et des connexions 3G en zone rurale — c'est une autre histoire. Les budgets de performance sont définis AVANT, pas découverts en prod.

### Métriques Cibles

| Métrique | Cible | Inacceptable |
|----------|-------|-------------|
| First Contentful Paint | < 1.5s | > 3s |
| Time to Interactive | < 3s | > 5s |
| Largest Contentful Paint | < 2.5s | > 4s |
| Cumulative Layout Shift | < 0.1 | > 0.25 |
| API response P50 | < 200ms | > 1s |
| API response P95 | < 500ms | > 2s |
| Bundle JS (gzipped) | < 200KB | > 500KB |
| Lighthouse score | > 90 | < 70 |

### Optimisations Par Couche

| Couche | Techniques |
|--------|-----------|
| **Frontend** | Code splitting, lazy loading, images WebP + lazy, memoization |
| **Réseau** | CDN Vercel/Cloudflare, compression brotli, HTTP/2, prefetching |
| **Backend** | Indexation DB, connection pooling, cache, background jobs |
| **DB** | Index stratégiques, éviter N+1, pagination cursor-based |

### Le Piège N+1

```sql
-- ❌ 101 requêtes pour 100 posts
SELECT * FROM posts;
SELECT * FROM users WHERE id = 1;  -- ×100

-- ✅ 2 requêtes
SELECT * FROM posts;
SELECT * FROM users WHERE id IN (1, 2, 3, ...);

-- ✅✅ 1 requête (join)
SELECT posts.*, users.name FROM posts JOIN users ON posts.user_id = users.id;
```

---

## 18. Accessibilité

> **Raisonnement senior :** L'accessibilité n'est pas un "bonus pour les handicapés" — c'est de la qualité logicielle. Un bouton sans label, c'est un bug. Un contraste illisible, c'est un bug.

### Règles Non-Négociables

- ✅ Contraste WCAG AA minimum (4.5:1 pour le texte)
- ✅ Touch targets 44×44px minimum (Apple HIG)
- ✅ Alt text sur toutes les images informatives
- ✅ Labels sur tous les inputs (`<label htmlFor>` ou `aria-label`)
- ✅ Navigation clavier fonctionnelle (tab, enter, escape)
- ✅ Unités relatives (rem) pour les fonts — respecter la taille système
- ✅ Focus visible sur les éléments interactifs
- ✅ Heading hierarchy (un seul h1, puis h2, h3...)
- ✅ Semantic HTML (`<nav>`, `<main>`, `<button>` pas `<div onClick>`)

---

## 19. Documentation

### README.md Standard

```markdown
# [Nom du Projet]

## Description
[Une phrase]

## Stack
- Frontend : Next.js 15
- Backend : Next.js API Routes
- DB : Supabase PostgreSQL
- Auth : Supabase Auth
- Deploy : Vercel

## Setup Local
1. Clone le repo
2. `npm install`
3. Copier `.env.example` → `.env.local`
4. Remplir les variables
5. `npm run dev`

## Tests
- `npm run test` — Tests unitaires
- `npm run test:e2e` — Tests E2E
- `npm run lint` — Linter

## Deploy
Push sur `main` → Auto-deploy Vercel

## Docs
- [Architecture](docs/architecture.md)
- [API Reference](docs/api.md)
- [Troubleshooting](docs/troubleshooting.md)
```

### Règles

- ✅ README.md DOIT être à jour et complet
- ✅ Chaque API route DOIT être documentée
- ✅ Troubleshooting.md DOIT être mis à jour après chaque bug résolu
- ✅ Architecture diagram DOIT refléter le code actuel
- ✅ ADRs (Architecture Decision Records) pour chaque choix structurant

---

## 20. Boundaries & Limitations pour l'IA

### L'IA ne peut PAS :

```
❌ Créer un fichier sans savoir où il va dans l'architecture
❌ Modifier du code sans lire le fichier existant
❌ Ajouter une dépendance sans justification
❌ Créer une route sans auth check
❌ Créer une fonction sans test
❌ Skip les tests "pour aller plus vite"
❌ Résoudre un bug sans mettre à jour troubleshooting.md
❌ Déployer sans la checklist pré-deploy
❌ Faire un console.log — utiliser le logger
❌ Utiliser `any` en TypeScript
❌ Créer des fichiers > 300 lignes
```

### L'IA DOIT :

```
✅ Lire l'architecture avant de coder
✅ Suivre le template choisi
✅ Générer les tests EN MÊME TEMPS que le code
✅ Vérifier l'auth sur toutes les routes protégées
✅ Valider tous les inputs avec Zod
✅ Typer explicitement tout
✅ Documenter chaque API route
✅ Mettre à jour architecture.md si changement structurel
✅ Logger les erreurs avec contexte
✅ Respecter les naming conventions
```

---

## 21. RGPD & Legal

### Documents Obligatoires

| Document | Où | Obligatoire |
|----------|---|:-:|
| Politique de confidentialité | Settings + inscription | ✅ |
| CGU | Acceptation à l'inscription | ✅ |
| Mentions légales | Footer / page dédiée | ✅ |
| DPA (Data Processing Agreement) | Contrat client | ✅ (si sous-traitant) |

### Exigences Techniques RGPD

| Exigence | Implémentation |
|----------|---------------|
| Consentement | Opt-in explicite, pas de cases pré-cochées |
| Droit d'accès | Export toutes les données (JSON/CSV) |
| Droit à l'oubli | Suppression complète compte + données |
| Droit de rectification | Modification infos personnelles |
| Portabilité | Export format standard |
| Notification breach | Process pour notifier sous 72h |
| Privacy by design | Collecter uniquement le nécessaire |
| Registre de traitement | Document interne listant tous les traitements |

---

## 22. Checklists Opérationnelles

### Pré-Commit

```
✅ Le code compile sans erreur
✅ Le linter passe (npm run lint)
✅ Les tests passent (npm run test)
✅ Le coverage est maintenu ou amélioré
✅ Pas de console.log oubliés
✅ Pas de TODO sans issue GitHub liée
✅ Types TypeScript explicites
✅ Documentation à jour
✅ Secrets ne sont pas committés
✅ .env.example à jour si nouvelles vars
✅ Commit message conventionnel
```

### Pré-Deploy

```
✅ Tests E2E passent
✅ npm audit — pas de vulnérabilité critique
✅ Migrations testées en staging
✅ Rollback plan documenté
✅ Variables d'env prod configurées
✅ Monitoring activé (Sentry, Vercel Analytics)
✅ Backups DB activés
✅ Feature flags configurés
✅ Changelog à jour
```

### Pré-Go-Live (Client)

```
TECHNIQUE                          SÉCURITÉ
✅ Auth complète (login, reset)     ✅ RLS toutes tables
✅ Edge cases couverts              ✅ Test : user voit données d'un
✅ Performance < 2s                    autre ? → NON
✅ Mobile responsive                ✅ HTTPS + CORS strict
✅ Monitoring + alerting actif      ✅ Clés en env vars
✅ Analytics en place               ✅ Contraintes CHECK enum
✅ Pas d'erreur console             ✅ Rate limiting
✅ CI/CD pipeline opérationnel      ✅ Audit dépendances clean

COMMERCIAL                         LEGAL
✅ Devis signé                      ✅ Privacy policy + CGU
✅ Acompte reçu (30-50%)           ✅ RGPD : export + delete
✅ Formation client planifiée       ✅ Clause accès données contrat
✅ Contrat maintenance signé        ✅ DPA signé
✅ Compte PRAGMA Support créé       ✅ Données test nettoyées
```

### Mensuelle

```
✅ Revue crashs/erreurs Sentry
✅ npm audit — pas de vulnérabilités
✅ Test restauration backup (LE FAIRE)
✅ Mise à jour dépendances
✅ Knip — pas de code mort
✅ Revue performances (Core Web Vitals)
✅ Feature flags morts → supprimer
✅ Rapport d'activité au client
```

### Par Release

```
✅ Feature freeze J-5
✅ Code review approuvé
✅ Tests passent (unit + intégration + E2E)
✅ Migrations testées en staging
✅ Feature flags en place
✅ Changelog rédigé
✅ Staged rollout configuré (10% → 50% → 100%)
✅ Monitoring en veille post-deploy (15 min)
```

---

## 23. Observabilité End-to-End

> **Raisonnement senior :** Monitoring = "est-ce que c'est up ?". Observabilité = "pourquoi c'est lent / cassé / bizarre ?". Un senior ne se contente pas de savoir que l'API est down — il trace le parcours complet d'une requête pour trouver le bottleneck en 5 minutes.

### Request ID — Le fil d'Ariane

Chaque requête reçoit un ID unique qui la suit du frontend à la DB :

```typescript
// middleware.ts — Générer et propager le requestId
import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

export function middleware(request: NextRequest) {
  const requestId = request.headers.get('x-request-id') || randomUUID();
  const response = NextResponse.next();
  response.headers.set('x-request-id', requestId);
  return response;
}
```

```
Frontend (fetch) → x-request-id: req_abc123
→ API Route (log avec requestId)
→ Supabase query (comment: requestId)
→ Réponse (header x-request-id: req_abc123)

Si bug → Chercher "req_abc123" dans les logs → Parcours complet visible
```

### Dashboard de Santé (Template)

| Widget | Métrique | Source |
|--------|---------|--------|
| 🟢 Uptime | % disponibilité 30j | Uptime Robot |
| 📊 Error rate | Erreurs/min temps réel | Sentry |
| ⏱️ Latence P50/P95 | Temps réponse API | Vercel Analytics |
| 👥 Users actifs | Sessions temps réel | PostHog |
| 💾 DB connections | Pool usage % | Supabase Dashboard |
| 📦 Storage | Usage disque GB | Supabase |

### Métriques Métier (à définir par app)

| Métrique business | Exemple |
|-------------------|---------|
| Taux de conversion | Inscription → 1ère action |
| Feature adoption | % users utilisant feature X |
| Time-to-value | Temps entre signup et 1ère valeur |
| Churn signal | Users inactifs depuis > 14j |

---

## 24. Disaster Recovery Plan

> **Raisonnement senior :** Le rollback couvre les problèmes courants. Le DR plan couvre les catastrophes. Un senior espère le meilleur mais planifie le pire. Le moment de réfléchir à "que faire si Supabase est down" n'est pas pendant que Supabase est down.

### Scénarios et Actions

| Scénario | Impact | Action immédiate | Recovery |
|----------|--------|-----------------|----------|
| **Supabase down** (leur incident) | DB + Auth inaccessibles | 1. Vérifier status.supabase.com 2. Communiquer au client 3. Attendre | PITR automatique par Supabase. RTO < 1h |
| **Vercel down** | Frontend + API inaccessibles | 1. Vérifier vercel.com/status 2. Activer page maintenance (DNS) | Re-deploy dès retour. RTO < 30min |
| **GitHub down** | Pas de push/deploy | 1. Continuer en local 2. Attendre | Push dès retour. Impact minimal |
| **Compte compromis** (GitHub/Supabase) | Accès malveillant | 1. Révoquer tous les tokens 2. Changer tous les mots de passe 3. Auditer les changements | Revert commits, restore backup si DB touchée |
| **Dev supprime la base prod** | Perte données | 1. NE RIEN TOUCHER 2. PITR immédiat vers le point avant la suppression | Restore PITR. RPO dépend du plan Supabase |
| **npm supply chain attack** | Dépendance malicieuse | 1. Identifier la dep 2. Rollback au dernier deploy safe 3. Supprimer la dep | Lock file + audit |
| **Client perd accès** | Ils ne peuvent plus se connecter | 1. Vérifier Auth logs 2. Reset mot de passe admin | Créer un nouvel admin si nécessaire |

### Contacts d'Urgence

```
Supabase Support : support.supabase.com (Pro plan = prioritaire)
Vercel Support  : vercel.com/support
GitHub Support  : support.github.com
Client          : [Contact d'urgence dans chaque contrat]
PRAGMA interne  : [Téléphone fondateur(s)]
```

### Test DR (Trimestriel)

```
☐ Simuler restore PITR sur un projet test
☐ Vérifier que les backups sont effectivement restaurables
☐ Vérifier les contacts d'urgence (toujours valides ?)
☐ Vérifier les accès (qui a accès à quoi ?)
☐ Temps de restore effectif vs objectif (< 1h ?)
```

---

## 25. API Versioning

> **Raisonnement senior :** Quand tu as 5 clients sur ton app et que tu dois changer un endpoint, tu ne peux pas juste modifier et espérer que rien ne casse. Un senior a une stratégie de compatibilité.

### Stratégie PRAGMA (pragmatique)

**Pas de versioning URL** (`/api/v1/`, `/api/v2/`) — c'est overkill à notre échelle.

**À la place : Contrat de stabilité + évolution non-breaking.**

### Changements Breaking vs Non-Breaking

| Changement | Breaking ? | Que faire |
|-----------|:----------:|-----------|
| Ajouter un champ à la réponse | ❌ Non | Faire directement |
| Ajouter un paramètre optionnel | ❌ Non | Faire directement |
| Modifier le type d'un champ existant | ✅ Oui | Migration + deprecation |
| Supprimer un champ de la réponse | ✅ Oui | Deprecation 30j avant |
| Renommer un endpoint | ✅ Oui | Redirect 301 + deprecation |
| Changer le format d'erreur | ✅ Oui | Versionner le format |

### Protocole pour Changements Breaking

```
1. Annoncer la deprecation (log + header "Deprecated: true")
2. Garder l'ancien comportement pendant 30 jours
3. Prévenir les clients utilisant l'ancien endpoint
4. Migrer sur le nouveau
5. Supprimer l'ancien après 30j
```

### Header de Deprecation

```
HTTP/1.1 200 OK
Deprecation: true
Sunset: Sat, 15 Mar 2026 00:00:00 GMT
Link: </api/users-v2>; rel="successor-version"
```

---

## 26. Onboarding & Developer Experience

> **Raisonnement senior :** Le "bus factor" c'est le nombre de personnes qui doivent être renversées par un bus pour que le projet s'arrête. Si c'est 1, c'est un risque business. Un bon onboarding réduit le bus factor.

### First Commit en 30 Minutes

```
1. Clone le repo                           (2 min)
2. npm install                             (3 min)
3. Copier .env.example → .env.local        (1 min)
4. Lire le README + architecture.md        (10 min)
5. npm run dev → vérifier que ça tourne    (2 min)
6. Trouver un "Good First Issue"           (5 min)
7. Faire le changement + test              (5 min)
8. Commit + push                           (2 min)
```

Si ça prend plus de 30 min → le setup est trop compliqué → simplifier.

### Template CONTRIBUTING.md

```markdown
# Contribuer à [Projet]

## Prérequis
- Node.js 20+
- npm 10+
- Accès au projet Supabase (demander à [personne])

## Setup
[Voir README.md]

## Conventions
- Commits : type(scope): description [§15 Git Hygiene]
- Branches : feature/xxx, fix/xxx [§15 Git Hygiene]
- Tests : obligatoires [§3 Tests]
- Linting : npm run lint [§4 Linter]

## Workflow
1. Créer une branche depuis `develop`
2. Faire le changement
3. Tests passent
4. PR vers `develop`
5. Review + merge

## Architecture
Voir docs/architecture.md

## Questions
Demander à [personne] ou ouvrir une issue
```

### Glossaire Métier

Chaque projet DOIT avoir un glossaire des termes métier dans `docs/glossary.md` :

```markdown
| Terme | Définition |
|-------|-----------|
| Dossier | Un dossier client avec ses documents et notes |
| Intervention | Une action planifiée chez un client |
| ...   | ... |
```

---

## 27. Cost Management

> **Raisonnement senior :** Un senior sait combien coûte l'infrastructure. Il ne découvre pas à la fin du mois que Supabase lui facture 3× le prévu. Et il sait estimer les coûts AVANT de signer un client.

### Coûts par Service (février 2026)

| Service | Tier gratuit | Pro plan | Limite critique |
|---------|-------------|----------|----------------|
| **Supabase** | 500MB DB, 1GB storage, 50k auth users | $25/mois | 8GB DB, pgbouncer obligatoire > 200 conn |
| **Vercel** | 100GB bandwidth, 1000 builds | $20/mois/membre | Functions timeout 10s (free) vs 300s (pro) |
| **Sentry** | 5k events/mois | $26/mois | Volume-based, surveiller le ratio erreurs |
| **Uptime Robot** | 50 monitors, 5 min interval | $7/mois | 1 min interval en pro |
| **PostHog** | 1M events/mois (self-hosted illimité) | Self-hosted | Disk usage |
| **GitHub** | Repos illimités, Actions 2000 min/mois | $4/user/mois | Actions minutes, LFS storage |
| **Domaine** | — | ~$12/an | Renouvellement auto |

### Estimation Coût par Client

| Profil client | Users | Coût infra/mois | Inclure dans le pricing |
|--------------|:-----:|:---------------:|:-:|
| Micro (1-10 users) | < 10 | ~$0 (tiers gratuits) | ✅ Marge confortable |
| Small (10-100 users) | 10-100 | ~$50-75 | ✅ Facturer $200+ maintenance |
| Medium (100-1000 users) | 100-1k | ~$100-200 | ⚠️ Pro plans nécessaires |
| Large (1000+ users) | 1k+ | $300+ | 🔴 Calculer précisément |

### Alertes Budget

```
✅ Activer les alertes email sur Vercel (usage > 80% du tier)
✅ Monitorer la taille DB Supabase (Dashboard > Database)
✅ Tracker les events Sentry (si > 4k events → on approche la limite)
✅ Vérifier les builds Vercel (si > 800/mois → on approche)
```

### Règle d'Or

> **Ne jamais promettre un prix sans avoir calculé le coût infra.** Toujours ajouter une marge de 30% pour les imprévus.

---

## 28. Compliance Automation

> **Raisonnement senior :** La compliance RGPD manuelle, ça marche pour 10 users. Pour 1000+, il faut automatiser sinon on oublie, on se trompe, et on risque des amendes.

### Export Automatique des Données (Droit d'Accès)

```typescript
// api/users/[id]/export/route.ts
export async function GET(request: Request, { params }) {
  const { id } = params;
  // Vérifier que c'est bien l'user qui demande ses données
  // ou un admin autorisé

  const userData = await supabase.from('profiles').select('*').eq('id', id);
  const userNotes = await supabase.from('notes').select('*').eq('user_id', id);
  const userFiles = await supabase.from('files').select('*').eq('user_id', id);

  const exportData = {
    exported_at: new Date().toISOString(),
    profile: userData.data,
    notes: userNotes.data,
    files: userFiles.data,
  };

  return new Response(JSON.stringify(exportData, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="export-${id}.json"`,
    },
  });
}
```

### Suppression Automatique (Droit à l'Oubli)

```typescript
// api/users/[id]/delete/route.ts
export async function DELETE(request: Request, { params }) {
  const { id } = params;
  // 1. Supprimer les fichiers Storage
  // 2. Supprimer les données dans chaque table (cascade)
  // 3. Supprimer le profil
  // 4. Supprimer le compte Auth
  // 5. Logger la suppression (sans données perso)

  await supabase.from('notes').delete().eq('user_id', id);
  await supabase.from('files').delete().eq('user_id', id);
  await supabase.from('profiles').delete().eq('id', id);
  await supabase.auth.admin.deleteUser(id);

  // Log anonymisé
  console.info(`[RGPD] Account deleted: ${id.substring(0, 8)}...`);
}
```

### Audit Trail

```sql
-- Table pour tracer les accès aux données sensibles
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,       -- 'view', 'export', 'delete', 'modify'
  target_table TEXT NOT NULL,
  target_id UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS : seuls les admins lisent les logs
CREATE POLICY "admin_audit" ON audit_log
FOR SELECT USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);
```

### Cookie Consent (Template)

```typescript
// Utiliser une lib comme 'cookie-consent-banner' ou un simple composant
// Obligations :
// 1. Pas de tracking AVANT le consentement
// 2. Choix granulaire (analytics vs marketing vs nécessaires)
// 3. Refuser doit être aussi simple qu'accepter
// 4. Mémoriser le choix (cookie de consentement)
```

---

## Conclusion

Ce framework est **non-négociable**. Chaque projet PRAGMA DOIT :

1. ✅ Choisir un template d'architecture
2. ✅ Respecter les règles de structure et naming
3. ✅ Avoir des tests (coverage minimum)
4. ✅ Avoir un linter/formatter + pre-commit hooks
5. ✅ Avoir une CI qui bloque sans tests
6. ✅ Passer la checklist sécurité (12 points)
7. ✅ Avoir du monitoring, alerting et un protocole incident
8. ✅ Avoir une méthodologie de debug et un troubleshooting.md vivant
9. ✅ Avoir un rollback plan documenté AVANT chaque deploy
10. ✅ Gérer les edge cases et la robustesse
11. ✅ Avoir du logging structuré (jamais console.log en prod)
12. ✅ Avoir une stratégie de caching
13. ✅ Respecter les standards API
14. ✅ Utiliser les feature flags pour les changements risqués
15. ✅ Garder un historique Git propre et utilisable
16. ✅ Gérer les dépendances activement
17. ✅ Respecter les budgets de performance
18. ✅ Être accessible (WCAG AA minimum)
19. ✅ Avoir une documentation complète et à jour
20. ✅ Être conforme RGPD
21. ✅ Avoir l'observabilité end-to-end (requestId, dashboard santé)
22. ✅ Avoir un Disaster Recovery Plan testé
23. ✅ Avoir une stratégie de compatibilité API
24. ✅ Avoir un onboarding < 30 min pour tout nouveau
25. ✅ Avoir un budget infra estimé par client
26. ✅ Avoir la compliance RGPD automatisée

**Si l'IA ne peut pas respecter ces règles, elle ne code pas.**

---
---

# ANNEXE A — Pourquoi ce Framework est Puissant (Preuves)

> Cette annexe est séparée du framework opérationnel. Elle explique le raisonnement derrière le framework, prouve la véracité de chaque section majeure, et positionne PRAGMA par rapport à l'industrie.

---

## Ce que ce framework n'est PAS

Ce n'est pas un document théorique. Ce n'est pas un copier-coller de "best practices" génériques. Chaque section est construite sur des standards industriels vérifiables et des méthodologies éprouvées.

## Preuves par Section

### 1. Architecture (Templates imposés)

**Source :** Le concept des templates d'architecture vient de la philosophie "Convention over Configuration" popularisée par Ruby on Rails (2004) et adoptée par Next.js (App Router, file-based routing). La structure `app/`, `components/`, `lib/` est le standard de facto Next.js documenté sur [nextjs.org/docs](https://nextjs.org/docs).

**Pourquoi c'est senior :** Les frameworks modernes ont convergé vers cette approche parce que la liberté de structure crée de l'incohérence. 80% du temps perdu en code review est dû à des choix de structure, pas à la logique. Les templates éliminent ce temps.

### 2. Sécurité (Auth, RLS, 12 points)

**Sources :**
- **OWASP Top 10** (2021) — Le standard mondial de la sécurité web. Notre framework couvre 8/10 des failles OWASP : Injection (§6.5-5), XSS (§6.6), Broken Auth (§6.2), Broken Access Control (§6.3-6.4), Security Misconfiguration (§6.5-4), Cryptographic Failures (§6.5-4), Data Exposure (§6.5-7)
- **Supabase RLS** — Documenté officiellement : [supabase.com/docs/guides/auth/row-level-security](https://supabase.com/docs/guides/auth/row-level-security)
- **JWT Best Practices** — RFC 8725 (2020) recommande des tokens < 15 min avec refresh, exactement notre configuration §6.2

**Ce qui est vérifié :** Chaque faille listée dans §6.6 correspond directement à un item OWASP. Le flow auth §6.2 suit le standard OAuth2/OIDC implémenté par Supabase (GoTrue). Le pattern RLS §6.3 est tiré de la doc officielle Supabase.

### 3. Tests (Pyramide, coverage)

**Source :** La Pyramide de Tests vient de Mike Cohn ("Succeeding with Agile", 2009) et a été adoptée par Google (Google Testing Blog, "Just Say No to More End-to-End Tests", 2015). Notre ratio 60/30/10 est le standard Google.

**Pourquoi le coverage > 80% :** Google impose 80% de coverage sur les librairies critiques. Martin Fowler recommande 80% comme "sweet spot" entre coût et bénéfice. En dessous, les régressions passent. Au-dessus, les rendements diminuent.

### 4. CI/CD (Pipeline, staged rollout)

**Source :** Le Continuous Delivery (Jez Humble, David Farley, 2010) est LE livre de référence. Le staged rollout (canary deployment) est utilisé par Google, Facebook, Netflix pour limiter l'impact des bugs en production.

**Ce qui est vérifié :** Le pipeline §5 suit exactement le pattern recommandé : Lint → Test → Build → Deploy. Le staged rollout 10%→50%→100% est le standard Netflix/Google documenté dans leurs engineering blogs.

### 5. Monitoring & Incidents (SLA, P0-P3)

**Sources :**
- **Google SRE Book** (Beyer et al., 2016) — Le livre qui a inventé le concept de Site Reliability Engineering. Notre classification P0-P3 est une simplification de leur système de sévérité
- **SLA 99.5%** — Correspond à ~43h de downtime/an. C'est réaliste pour une petite équipe (Google vise 99.99%, mais ils ont des milliers d'ingénieurs SRE)
- **Post-mortem blameless** — Concept formalisé par Google SRE, adopté par toute l'industrie

**Ce qui est honnête :** Un SLA de 99.5% est ambitieux mais réaliste pour notre stack (Supabase + Vercel ont eux-mêmes des SLA de 99.9%+). On ne promet pas 99.99% parce qu'on n'a pas l'infra pour.

### 6. Rollback & Recovery (PITR, migrations)

**Source :** Les 6 règles de migration §9.3 sont tirées de la méthodologie "Evolutionary Database Design" de Martin Fowler et Pramod Sadalage (2002, mis à jour 2016). La rétrocompatibilité des migrations (règle 5) est le standard de l'industrie pour zero-downtime deploys.

**Ce qui est vérifié :** Le PITR Supabase est documenté officiellement. Les valeurs RTO/RPO sont alignées avec les plans Supabase Pro.

### 7. Performance (Core Web Vitals, N+1)

**Source :** Les Core Web Vitals sont les métriques officielles de Google (2020) utilisées comme facteur de ranking SEO. Nos cibles (LCP < 2.5s, CLS < 0.1) sont les seuils définis par Google comme "Good".

**Le piège N+1 :** Documenté par tous les ORM (Django, Rails, Prisma) comme le problème de performance #1 des applications web. La solution (JOIN ou IN query) est universellement recommandée.

### 8. RGPD

**Source :** Le Règlement Général sur la Protection des Données (2018) est une loi européenne. Nos exigences §21 correspondent article par article : droit d'accès (Art. 15), droit à l'oubli (Art. 17), portabilité (Art. 20), notification breach (Art. 33, 72h).

**Ce qui n'est pas du bluff :** La CNIL a infligé des amendes de millions d'euros (Google : 150M€ en 2022 pour les cookies). La RGPD n'est pas optionnelle.

---

## Score vs Standards de l'Industrie

| Standard | Couverture | Détail |
|----------|:---------:|--------|
| **OWASP Top 10** | 8/10 | Manque : Security Logging (couvert §11), SSRF (limité par le stack) |
| **12-Factor App** (Heroku, 2012) | 10/12 | Manque : Admin processes formels, Disposability explicite |
| **Google SRE** | 7/10 | Base solide. Manque : Error budgets formels, SLI/SLO par endpoint |
| **SOC2 Type I** | ~60% | Bases en place, pas d'audit formel (coût ~$10k, pas prioritaire à notre stade) |
| **WCAG 2.1 AA** | Couvert §18 | Règles en place, pas d'audit formel |

---

## Le Vrai Avantage Concurrentiel

Ce framework fait quelque chose de rare : **il réconcilie le vibe coding et l'ingénierie senior.**

La plupart des critiques du vibe coding ont raison : sans cadre, l'IA produit du code spaghetti, sans tests, sans sécurité. Mais leur conclusion ("donc il faut être dev pour coder") est fausse.

**La bonne conclusion :** Il faut un **framework de contraintes** qui force l'IA à produire du code structuré. Ce framework EST cette couche de contraintes. L'IA n'a pas de jugement — ce document est son jugement.

**Preuve :** Comparez deux sorties d'IA :
- **Sans framework :** L'IA produit un fichier de 800 lignes avec UI + logique + fetch mélangés, pas de tests, `console.log` partout, pas d'auth, `any` TypeScript
- **Avec ce framework :** L'IA est forcée de séparer les responsabilités (< 300 lignes), écrire des tests, typer tout, valider avec Zod, ajouter l'auth, logger correctement

La différence n'est pas l'IA — c'est **les règles qu'on lui donne**.

---
---

# ANNEXE B — Comment Faire Appliquer ce Framework par l'IA

> Cette annexe explique la méthode optimale pour que l'IA (Claude, GPT, Gemini, n'importe quel LLM) respecte ce framework à chaque session de code.

---

## Le Problème

Les LLMs n'ont pas de mémoire persistante entre les sessions. Si tu ne réinjectes pas le contexte, l'IA repart de zéro et code comme un junior.

## La Solution : 3 Couches d'Injection

### Couche 1 — Rules / Custom Instructions (Permanent)

Fichier `.agent/rules/dev.md` (ou Custom Instructions dans ChatGPT, System Prompt dans l'API) :

```markdown
# Règles Dev PRAGMA

Tu es un senior dev. Tu appliques le PRAGMA Senior Dev Framework.

## LIRE AVANT DE CODER
Avant chaque session de code, lis le fichier METHODE/senior-dev-framework.md.

## INTERDICTIONS ABSOLUES
- Pas de fichier > 300 lignes
- Pas de `any` en TypeScript
- Pas de `console.log` en production
- Pas de route API sans auth check
- Pas de code sans test associé
- Pas de dépendance sans justification

## OBLIGATIONS
- Tests en même temps que le code
- Validation Zod sur tous les inputs API
- RLS sur toutes les tables Supabase
- Naming conventions : PascalCase composants, camelCase fonctions
- Commit conventionnel : type(scope): description
```

**Pourquoi ça marche :** Les rules/custom instructions sont injectées à CHAQUE message. L'IA ne peut pas les ignorer. C'est la couche de base.

### Couche 2 — Le Framework comme Fichier Référence (Par Projet)

Le fichier `METHODE/senior-dev-framework.md` est dans le repo. L'IA le lit quand elle a besoin de détails spécifiques.

**Pattern optimal :**
```
"Avant de créer cette feature, lis la section Sécurité du framework
(METHODE/senior-dev-framework.md §6) et applique les règles RLS."
```

**Pourquoi ça marche :** Le framework est trop long pour être dans les rules (il dépasserait le context window utile). Mais il est toujours accessible comme fichier de référence. L'IA le consulte quand on lui demande.

### Couche 3 — Les Checklists comme Steps Obligatoires (Par Action)

Avant chaque action critique, demander explicitement à l'IA de passer la checklist :

```
"Avant de deploy :
1. Passe la checklist pré-deploy (§22)
2. Confirme que chaque point est OK
3. Si un point n'est pas OK, fixe-le d'abord"
```

**Pourquoi ça marche :** La checklist force l'IA à vérifier point par point. Sans checklist, elle "assume" que tout est OK.

## Résumé : La Hiérarchie d'Injection

```
┌──────────────────────────────────────────────┐
│  Rules (.agent/rules/dev.md)                 │  ← Toujours actif
│  = Interdictions + obligations minimales     │
├──────────────────────────────────────────────┤
│  Framework (METHODE/senior-dev-framework.md) │  ← Consulté par l'IA
│  = Détails complets de chaque section        │
├──────────────────────────────────────────────┤
│  Checklists (demandées ponctuellement)       │  ← Avant actions critiques
│  = Validation point par point               │
└──────────────────────────────────────────────┘
```

## Les Patterns de Prompt

### Début de Feature

```
"Je veux ajouter [feature]. Avant de coder :
1. Lis l'architecture (docs/architecture.md)
2. Propose la structure de fichiers
3. Identifie les routes API nécessaires
4. Précise les policies RLS à créer
5. Liste les tests à écrire"
```

### Après un Bug

```
"Bug : [description]. Applique la méthodologie de debug §8 :
1. Reproduis
2. Isole (front / API / DB / infra)
3. Diagnostique (logs, codes HTTP)
4. Fixe
5. Ajoute à troubleshooting.md"
```

### Avant Deploy

```
"On va deploy. Passe la checklist pré-deploy §22 point par point.
Pour chaque point : ✅ OK ou ❌ ce qu'il faut fixer."
```

### Revue de Code

```
"Review ce code contre le framework PRAGMA :
- Structure (§2) : fichiers < 300 lignes ?
- Sécurité (§6) : auth check ? RLS ? input validation ?
- Tests (§3) : tests écrits ?
- Logging (§11) : pas de console.log ?
- Types (§4) : pas de any ?"
```

## Ce que l'IA ne Fera JAMAIS Seule

Même avec un framework parfait, l'IA ne peut pas :

| Action | Pourquoi | Qui le fait |
|--------|----------|------------|
| Décider du business model | Pas de contexte business | Toi |
| Écrire les vrais tests E2E | Pas d'accès au navigateur | Toi + Agent Web |
| Valider la sécurité en prod | Pas d'accès à l'infra réelle | Toi (+ pentest si critique) |
| Choisir l'architecture initiale | Dépend du contexte projet | Toi avec l'IA comme advisor |
| Vérifier la conformité juridique | Pas juriste | Toi + avocat si nécessaire |
| Tester la restauration de backup | Pas d'accès aux dashboards | Toi manuellement |

**Le framework donne le cadre. L'humain garde le jugement final.**

---

*PRAGMA Senior Dev Framework v2.1 — 15 février 2026*
*28 sections + 2 annexes — Le guide complet pour transformer le vibe coding en production-grade*
*Sources : OWASP Top 10, Google SRE Book, 12-Factor App, Martin Fowler, RFC 8725, RGPD, Next.js docs, Supabase docs, recherche Marwane*
