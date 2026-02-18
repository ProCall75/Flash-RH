---
description: Phase 3 — Avant de deploy. Checklist complète à passer AVANT chaque déploiement.
---

# Phase 3 : Avant de Deploy

> **Référence :** Framework §5 (CI/CD), §9 (Rollback), §14 (Feature Flags), §16 (Dépendances), §17 (Performance), §22 (Checklists)
>
> **Principe :** Un senior ne déploie JAMAIS sans plan de rollback. La question n'est pas "est-ce que ça va casser ?" mais "QUAND ça casse, comment on revient ?".

---

## Checklist pré-deploy (§22)

### Tests & Qualité

```
☐ Tests unitaires passent → npm run test
☐ Tests d'intégration passent
☐ Tests E2E passent → npm run test:e2e
☐ Coverage maintenu (lib/ > 80%, API > 70%)
☐ npm run lint → pas d'erreur
☐ npm run build → build réussit
☐ Type check → npx tsc --noEmit
```

### Sécurité (§6)

```
☐ npm audit → pas de vulnérabilité critique
☐ RLS activé sur TOUTES les tables
☐ Test : un user peut-il voir les données d'un autre ? → NON
☐ Auth check sur toutes les routes protégées
☐ Pas de secrets dans le code (grep pour API keys, tokens)
☐ CORS configuré (whitelist, pas *)
☐ Rate limiting en place
```

### Base de données (§9)

```
☐ Migrations testées en staging
☐ Migrations réversibles (chaque up() a un down())
☐ Backup manuel AVANT toute migration destructive
☐ Contraintes DB en place (CHECK, NOT NULL, FK, UNIQUE)
```

### Infrastructure

```
☐ Variables d'env prod configurées
☐ Monitoring activé (Sentry, Vercel Analytics)
☐ Uptime Robot configuré
☐ Backups DB activés (automatique quotidien)
☐ Domaine + SSL configuré
```

### Rollback plan (§9)

```
☐ Plan de rollback documenté :
    - Si bug code → Vercel : Promote ancien deploy
    - Si bug DB → PITR / Restore backup
    - Si bug infra → Contacter le provider
☐ Contact d'urgence disponible
☐ Temps de restauration estimé (< 1h)
```

### Feature Flags (§14)

```
☐ Features risquées derrière un flag
☐ Staged rollout configuré (10% → 50% → 100%)
☐ Flags nommés clairement (NEW_CHECKOUT_FLOW, pas FF_1)
```

### Documentation

```
☐ CHANGELOG.md à jour
☐ README.md à jour (si changements de setup)
☐ docs/api.md à jour (si nouvelles routes)
☐ docs/architecture.md à jour (si changements structurels)
```

---

## Pré-Go-Live Client (§22)

### Technique

```
☐ Auth complète (login, signup, reset password)
☐ Edge cases couverts (§10)
☐ Performance < 2s (Lighthouse > 90)
☐ Mobile responsive
☐ Monitoring + alerting actif
☐ Analytics en place
☐ Pas d'erreur console
☐ CI/CD pipeline opérationnel
```

### Sécurité

```
☐ RLS toutes tables
☐ Test isolation données users → OK
☐ HTTPS + CORS strict
☐ Clés en env vars
☐ Contraintes CHECK enum
☐ Rate limiting
☐ Audit dépendances clean
```

### Commercial

```
☐ Devis signé
☐ Acompte reçu (30-50%)
☐ Formation client planifiée
☐ Contrat maintenance signé
☐ Compte PRAGMA Support créé
```

### Legal (§21)

```
☐ Privacy policy publiée
☐ CGU acceptées à l'inscription
☐ RGPD : export + delete fonctionnels
☐ Clause accès données dans le contrat
☐ Données de test nettoyées
```

---

## Après le deploy

```
☐ Monitoring en veille post-deploy (15 min minimum)
☐ Vérifier les logs Sentry (pas de nouvelles erreurs)
☐ Vérifier l'uptime (pas de dégradation)
☐ Test rapide des parcours critiques
☐ Si problème → rollback immédiat puis investigation
```

---

## Quality Check

```
Lancer le Quality Agent :
  /quality-agent checkpoint=before-deploy
```
