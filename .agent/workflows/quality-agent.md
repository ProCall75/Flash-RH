---
description: Quality Agent — Vérification de conformité au framework PRAGMA. Appelé à 4 checkpoints critiques du cycle de vie.
---

# Quality Agent — Vérification Conformité PRAGMA

> **Rôle :** Agent de vérification automatisée de la conformité au Senior Dev Framework v2.1.
> Appelé à 4 checkpoints critiques du cycle de vie du projet.
> **Note :** Pour les vérifications inter-phase pendant le dev, utiliser `/quality-gate`.

---

## Utilisation

```bash
/quality-agent checkpoint=after-prd
/quality-agent checkpoint=after-architecture
/quality-agent checkpoint=before-deploy
/quality-agent checkpoint=after-deploy
```

---

## Checkpoints

### 1. Après PRD (`after-prd`)

Vérifier que le PRD couvre les exigences framework :

```
☐ §6  Sécurité : Stratégie auth identifiée ? Données sensibles listées ?
☐ §3  Tests : Scénarios E2E définis pour les parcours critiques ?
☐ §7  Maintenance : Plan de monitoring inclus dans le budget ?
☐ §21 RGPD : Données personnelles identifiées ? Consentement planifié ?
☐ §18 Accessibilité : Contraintes a11y identifiées ?
```

### 2. Après Architecture (`after-architecture`)

```
☐ §1  Architecture : Template choisi et documenté ?
☐ §2  Structure : Fichiers < 300 lignes ? Naming conventions ?
☐ §6  Sécurité : RLS planifié pour toutes les tables ?
☐ §10 Edge Cases : Contraintes DB en place (CHECK, NOT NULL, FK, UNIQUE) ?
☐ §12 Caching : Stratégie de cache définie ?
☐ §13 API Design : Conventions REST respectées ? Format réponse standardisé ?
```

### 3. Avant Deploy (`before-deploy`)

```
☐ §3  Tests : Coverage > 80% (lib) ? Tests E2E passent ?
☐ §4  Linter : ESLint + Prettier configurés ? Pre-commit hooks ?
☐ §5  CI/CD : Pipeline bloque sans tests ?
☐ §6  Sécurité : 12 points checklist passés ? RLS toutes tables ?
☐ §9  Rollback : Plan documenté ? Migrations réversibles ?
☐ §11 Logging : Pas de console.log ? Logger structuré ?
☐ §16 Dépendances : npm audit clean ? Lock file committé ?
☐ §17 Performance : Lighthouse > 90 ? Core Web Vitals OK ?
☐ §22 Checklists : Pré-deploy passée point par point ?
```

### 4. Après Deploy (`after-deploy`)

```
☐ §7  Maintenance : Sentry actif ? Uptime Robot configuré ?
☐ §8  Debug : troubleshooting.md existe et rempli ?
☐ §19 Documentation : README complet ? Architecture à jour ?
☐ §21 RGPD : Docs légaux publiés ? Export/delete fonctionnels ?
```

---

## Lien avec le Quality Gate inter-phase

Le **Quality Gate** (`/quality-gate`) est utilisé **pendant le développement** entre chaque phase.
Le **Quality Agent** (`/quality-agent`) est utilisé aux **milestones projet** (PRD, archi, deploy).

Les deux sont complémentaires :
- `/quality-gate phase=N` → vérifie la phase de dev terminée
- `/quality-agent checkpoint=X` → vérifie le milestone projet

---

## Format de sortie

```markdown
# Quality Check — [Checkpoint Name]

**Projet :** [Nom du projet]
**Date :** YYYY-MM-DD HH:MM
**Checkpoint :** [after-prd | after-architecture | before-deploy | after-deploy]

## ✅ Conforme
- [Liste des sections OK]

## ⚠️ À corriger
- [Section] : [Problème] → [Action]

## 🔴 Bloquant
- [Section] : [Problème critique] → [Action immédiate]

## Verdict
- [ ] ✅ Peut procéder
- [ ] ⚠️ Peut procéder avec réserves
- [ ] 🔴 BLOQUÉ
```

---

## Certification

Rapports stockés dans : `quality/certifications/YYYY-MM-DD_checkpoint-name.md`
