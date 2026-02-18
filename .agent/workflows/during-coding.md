---
description: Phase 2 — Pendant le dev. Standards et pratiques à respecter pendant le développement.
---

# Phase 2 : Pendant le Dev

> **Référence :** Framework §2 (Structure), §3 (Tests), §4 (Linter), §6 (Sécurité), §8 (Debug), §11 (Logging), §13 (API), §15 (Git)
>
> **Principe :** Chaque changement est testé immédiatement, chaque bug est documenté.

---

## Règles permanentes

### Structure des fichiers (§2)

```
☐ Fichier < 300 lignes → sinon REFACTOR
☐ Séparation UI / logique / fetch
☐ Naming conventions respectées
☐ Pas de logique métier dans les composants UI
```

### Tests (§3)

```
☐ Écrire les tests EN MÊME TEMPS que le code
☐ Unit tests pour la logique métier (Vitest)
☐ Integration tests pour les composants (Testing Library)
☐ Si tu changes quelque chose, teste immédiatement

Règle d'or : pas de code sans test. Pas de test après — test pendant.
```

### Sécurité (§6)

```
☐ Auth check sur chaque nouvelle route protégée
☐ RLS policy pour chaque nouvelle table
☐ Validation Zod sur chaque endpoint API
☐ Jamais de données sensibles dans les logs
```

### API Design (§13)

```
☐ Conventions REST respectées
☐ Format de réponse standardisé : { data, meta } ou { error }
☐ Pagination cursor-based pour les listes
☐ Rate limiting sur les endpoints sensibles
☐ Documenter dans docs/api.md
```

### Logging (§11)

```
☐ Pas de console.log → utiliser le logger structuré
☐ Niveaux : ERROR, WARN, INFO, DEBUG
☐ Toujours inclure : userId, requestId, endpoint
☐ Jamais de mots de passe, tokens, PII dans les logs
```

### Git Hygiene (§15)

```
☐ Commits conventionnels : type(scope): description
☐ UN commit = UN changement logique
☐ Branches nommées : feature/xxx, fix/xxx
☐ git pull --rebase avant push
```

---

## Workflow par feature

### 1. Comprendre

```
☐ Lire ce qui existe (docs/architecture.md, code en place)
☐ Identifier les fichiers à créer/modifier
☐ Vérifier si ça impacte l'architecture
```

### 2. Coder

```
☐ Créer les fichiers dans la bonne structure
☐ Séparer UI / logique / data
☐ Typer explicitement tout (pas de any)
☐ Valider les inputs avec Zod
```

### 3. Tester

```
☐ Tests unitaires pour les utils et hooks
☐ Tests d'intégration pour les composants
☐ Vérifier que les tests existants passent toujours
```

### 4. Committer

```
☐ npm run lint → pas d'erreur
☐ npm run test → tout passe
☐ Pas de console.log oubliés
☐ Pas de TODO sans issue GitHub liée
☐ .env.example à jour si nouvelles vars
☐ Commit conventionnel : type(scope): description
```

---

## Quand un bug survient (§8)

```
Appliquer la méthodologie en 5 étapes :

1. REPRODUIRE → Quelles étapes ? Quel environnement ? Quelles données ?
2. ISOLER → Front / API / DB / Infra ?
3. DIAGNOSTIQUER → Logs, console, Sentry, Network tab
4. FIXER → Fix minimal et ciblé. PAS de refactor opportuniste.
5. DOCUMENTER → Ajouter à docs/troubleshooting.md

Un fix = un commit = un problème résolu.
```

---

## Checklist pré-commit (§22)

```
☐ Le code compile sans erreur
☐ Le linter passe (npm run lint)
☐ Les tests passent (npm run test)
☐ Le coverage est maintenu ou amélioré
☐ Pas de console.log oubliés
☐ Pas de TODO sans issue liée
☐ Types TypeScript explicites
☐ Documentation à jour
☐ Secrets non committés
☐ .env.example à jour
☐ Commit message conventionnel
```
