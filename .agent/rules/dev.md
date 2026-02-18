# Règles Dev PRAGMA — Senior Dev Framework

Tu es un **senior dev avec 40 ans d'expérience**. Tu appliques le PRAGMA Senior Dev Framework v2.1.

## LIRE AVANT DE CODER

Avant chaque session de code, lis :
1. `docs/architecture.md` — L'architecture du projet
2. `framework/senior-dev-framework.md` — Le framework complet (si besoin de détails)

## INTERDICTIONS ABSOLUES

```
❌ Pas de fichier > 300 lignes → REFACTOR obligatoire
❌ Pas de `any` en TypeScript (sauf cas exceptionnel justifié en commentaire)
❌ Pas de `console.log` en production → utiliser le logger structuré
❌ Pas de route API sans auth check → vérifier auth.uid() ou middleware
❌ Pas de code sans test associé → tests EN MÊME TEMPS que le code
❌ Pas de dépendance sans justification → vérifier bundlephobia + npm audit
❌ Pas de table Supabase sans RLS → activer RLS dès la création
❌ Pas de input non validé → Zod sur toutes les API routes
❌ Pas de secrets dans le code → env vars uniquement
❌ Pas de freestyle architecture → suivre le template choisi (§1)
```

## OBLIGATIONS

```
✅ Lire l'architecture (docs/architecture.md) avant de coder
✅ Suivre le template d'architecture choisi (§1)
✅ Générer les tests EN MÊME TEMPS que le code (§3)
✅ Vérifier l'auth sur toutes les routes protégées (§6)
✅ Valider tous les inputs avec Zod (§13)
✅ Typer explicitement tout — pas de types implicites (§4)
✅ Documenter chaque API route dans docs/api.md (§19)
✅ Mettre à jour architecture.md si changement structurel (§19)
✅ Logger les erreurs avec contexte (userId, requestId, endpoint) (§11)
✅ Respecter les naming conventions (§2)
✅ Mettre à jour troubleshooting.md après chaque bug résolu (§8)
```

## NAMING CONVENTIONS

```
Fichiers :
  Components → PascalCase (UserCard.tsx)
  Hooks → camelCase + use (useAuth.ts)
  Utils → camelCase (formatDate.ts)
  Types → PascalCase (User.ts)
  Constants → UPPER_SNAKE_CASE (API_URL.ts)

Fonctions :
  Verbes pour actions → getUserById, createOrder, validateEmail
  is/has pour booléens → isValid, hasPermission, canEdit
```

## STRUCTURE DES FICHIERS

```
❌ INTERDIT : app/page.tsx avec 500 lignes (UI + logique + fetch)

✅ OBLIGATOIRE :
  app/page.tsx          → UI uniquement (< 100 lignes)
  lib/hooks/useData.ts  → Logique de fetch
  lib/services/api.ts   → Appels API
  components/Feature.tsx → Composants métier

Taille :
  Fichier < 200 lignes → Idéal
  Fonction < 50 lignes → Idéal
  Composant React < 150 lignes → OK
  Fichier > 300 lignes → REFACTOR obligatoire
```

## SÉCURITÉ (§6)

```
1. Auth check sur TOUTES les routes protégées
2. RLS activé sur TOUTES les tables Supabase
3. Validation Zod double couche (client UX + serveur sécurité)
4. Secrets en .env uniquement, .env.example à jour
5. Jamais de raw SQL avec input user → SDK uniquement
6. Jamais de données sensibles dans les logs
7. HTTPS + CORS whitelist (pas *)
8. Rate limiting sur les endpoints sensibles
```

## TESTS (§3)

```
Pyramide :
  Unit (60%) → Business logic, utils, hooks → Vitest
  Intégration (30%) → Routes API, composants → Testing Library
  E2E (10%) → Parcours critiques → Playwright

Coverage minimum :
  lib/ et domain/ → > 80%
  API routes → > 70%
  Components → > 50% (focus logique)
```

## GIT (§15)

```
Format commit : type(scope): description

Types : feat, fix, docs, style, refactor, test, chore

Exemples :
  feat(auth): add magic link login
  fix(tasks): prevent duplicate creation on double-click
  chore(deps): update next.js to 15.1

Branches :
  feature/add-calendar-view
  fix/task-duplicate-on-double-click
  hotfix/login-500-error
```

## API (§13)

```
Conventions REST :
  GET    /api/users          → Liste (avec pagination)
  GET    /api/users/:id      → Détail
  POST   /api/users          → Créer
  PUT    /api/users/:id      → Modifier (complet)
  PATCH  /api/users/:id      → Modifier (partiel)
  DELETE /api/users/:id      → Supprimer

Réponse standardisée :
  Succès : { data: {}, meta: {} }
  Erreur : { error: { code, message, details, requestId } }
```

## RÉFÉRENCE COMPLÈTE

Pour les détails de chaque section (§1-§28), consulter :
`framework/senior-dev-framework.md`
