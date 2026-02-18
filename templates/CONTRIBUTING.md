# Contributing to [Projet]

> **Guide pour contribuer au projet.**

Référence : Framework §26 (Onboarding)

---

## Prérequis

- Node.js 20+
- npm 10+
- Accès au projet Supabase (demander à @antonin)

---

## Setup

Voir [README.md](README.md)

---

## Conventions

### Commits (Framework §15)

Format : `type(scope): description`

**Types :**
- `feat` → Nouvelle feature
- `fix` → Bugfix
- `docs` → Documentation
- `style` → Formatting
- `refactor` → Restructuration
- `test` → Tests
- `chore` → Maintenance

**Exemples :**
```
feat(tasks): add task filtering
fix(auth): prevent double-click on login
docs(api): document POST /api/tasks
```

### Branches

```
feature/add-task-filters
fix/login-500-error
hotfix/security-patch
chore/update-deps
```

### Tests

Tests obligatoires pour tout nouveau code (Framework §3).

---

## Workflow

1. Créer une branche depuis `develop`
2. Faire le changement
3. Vérifier que les tests passent
4. PR vers `develop`
5. Review + merge

---

## Pre-Commit Checklist (Framework §22)

```
☐ Code compile
☐ npm run lint passe
☐ Tests passent
☐ Coverage maintenu
☐ Pas de console.log
☐ Types explicites
☐ Docs à  jour
☐ Secrets non committés
☐ .env.example à jour
☐ Message conventionnel
```

---

## Architecture

Voir [docs/architecture.md](docs/architecture.md)

---

## Questions

Demander à @antonin ou ouvrir une issue.
