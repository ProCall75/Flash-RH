---
description: Phase 1 — Avant de coder. Toutes les étapes à compléter AVANT d'écrire la première ligne de code.
---

# Phase 1 : Avant de Coder

> **Référence :** Framework §1 (Architecture), §2 (Structure), §6 (Sécurité), §10 (Edge Cases), §19 (Documentation), §26 (Onboarding)
>
> **Principe :** Un senior passe 40% du temps à comprendre et planifier, 60% à coder. Un junior fait l'inverse.

---

## Étape 1 — Lire le contexte client

```
1. Lire le PRD client → docs/prd.md
2. Identifier les contraintes métier, les users, les parcours critiques
3. Remplir docs/glossary.md avec les termes métier du client
```

## Étape 2 — Choisir le template d'architecture

```
Lire framework/senior-dev-framework.md §1

Choisir UN template :
  A — Monolith Moderne (Next.js + Supabase) → SaaS, dashboards
  B — Microservices (Docker + API Gateway) → Apps complexes multi-domaines
  C — Serverless (Edge Functions) → APIs légères, webhooks
  D — JAMstack (Static + API) → Sites vitrine, landing pages
  E — Domain-Driven Design (DDD) → Logique métier riche

Documenter le choix dans docs/architecture.md
```

## Étape 3 — Remplir le template architecture

```
Compléter docs/architecture.md avec :
  ☐ Template choisi + justification
  ☐ Stack technique (versions)
  ☐ Schéma base de données (tables + colonnes + contraintes)
  ☐ RLS policies pour CHAQUE table
  ☐ Structure de fichiers
  ☐ Routes API principales
  ☐ Flows critiques (parcours utilisateur)
```

## Étape 4 — Schéma DB + RLS

```
Créer les migrations SQL :
  ☐ Tables avec contraintes (NOT NULL, CHECK, UNIQUE, FK)
  ☐ ALTER TABLE ... ENABLE ROW LEVEL SECURITY sur CHAQUE table
  ☐ Policies RLS : users_own_data, admin_all, users_insert_own
  ☐ Tester : un user peut-il voir les données d'un autre ? → NON

Référence : framework §6.3 (RLS), §10 (Contraintes DB)
```

## Étape 5 — Créer les ADRs

```
Pour chaque choix structurant, créer un ADR dans docs/adr/ :
  ☐ ADR-001 : Choix du template d'architecture
  ☐ ADR-002 : Choix de la stratégie d'auth
  ☐ ADR-003 : [Autre choix structurant]

Utiliser le template : docs/adr/000-template.md
```

## Étape 6 — Setup le repo

```
Configuration :
  ☐ Copier templates/.env.example → .env.example à la racine
  ☐ Copier templates/.gitignore → .gitignore à la racine
  ☐ Remplir .env.local avec les clés Supabase
  ☐ npm install
  ☐ Configurer ESLint (§4) : no-console, no-any, no-unused-vars
  ☐ Configurer Prettier (§4) : semi, singleQuote, tabWidth 2
  ☐ Configurer Husky + lint-staged (pre-commit hook)
  ☐ npm run dev → vérifier que ça tourne
```

## Étape 7 — Quality Check

```
Lancer le Quality Agent :
  /quality-agent checkpoint=after-prd

Puis après l'architecture :
  /quality-agent checkpoint=after-architecture
```

---

## Checklist récapitulative

```
☐ PRD lu et compris
☐ Glossaire métier rempli
☐ Template d'architecture choisi
☐ docs/architecture.md rempli
☐ Schéma DB créé avec RLS
☐ ADRs créés pour les choix structurants
☐ Repo configuré (.env, linter, formatter)
☐ Quality check passé
☐ Prêt à coder ✅
```
