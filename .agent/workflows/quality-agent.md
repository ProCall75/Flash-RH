---
description: Quality Agent — Vérification de conformité au framework PRAGMA. Appelé à 4 checkpoints critiques.
---

# Quality Agent — Vérification Conformité PRAGMA

> **Rôle :** Agent de vérification automatisée de la conformité au Senior Dev Framework v2.1.
> Appelé à 4 checkpoints critiques du cycle de vie du projet.

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
☐ §27 Coûts : Budget infra estimé ? Marge 30% incluse ?
☐ §18 Accessibilité : Contraintes a11y identifiées ?
```

### 2. Après Architecture (`after-architecture`)

Vérifier que l'architecture respecte le framework :

```
☐ §1  Architecture : Template choisi et documenté ?
☐ §2  Structure : Fichiers < 300 lignes ? Naming conventions ?
☐ §6  Sécurité : RLS planifié pour toutes les tables ?
☐ §10 Edge Cases : Contraintes DB en place (CHECK, NOT NULL, FK, UNIQUE) ?
☐ §12 Caching : Stratégie de cache définie ?
☐ §13 API Design : Conventions REST respectées ? Format réponse standardisé ?
☐ §24 DR Plan : Scénarios catastrophe documentés ?
☐ §25 API Versioning : Stratégie de compatibilité définie ?
```

### 3. Avant Deploy (`before-deploy`)

Passer la checklist complète pré-deploy :

```
☐ §3  Tests : Coverage > 80% (lib) ? Tests E2E passent ?
☐ §4  Linter : ESLint + Prettier configurés ? Pre-commit hooks ?
☐ §5  CI/CD : Pipeline bloque sans tests ?
☐ §6  Sécurité : 12 points checklist passés ? RLS toutes tables ?
☐ §9  Rollback : Plan documenté ? Migrations réversibles ?
☐ §11 Logging : Pas de console.log ? Logger structuré ?
☐ §14 Feature Flags : Flags configurés pour features risquées ?
☐ §16 Dépendances : npm audit clean ? Lock file committé ?
☐ §17 Performance : Lighthouse > 90 ? Core Web Vitals OK ?
☐ §18 Accessibilité : WCAG AA respecté ? Touch targets 44px ?
☐ §22 Checklists : Pré-deploy passée point par point ?
```

### 4. Après Deploy (`after-deploy`)

Vérifier la conformité post-go-live :

```
☐ §7  Maintenance : Sentry actif ? Uptime Robot configuré ?
☐ §8  Debug : troubleshooting.md existe et rempli ?
☐ §19 Documentation : README complet ? Architecture à jour ?
☐ §21 RGPD : Docs légaux publiés ? Export/delete fonctionnels ?
☐ §23 Observabilité : RequestId propagé ? Dashboard santé ?
☐ §26 Onboarding : CONTRIBUTING.md ? First commit < 30min ?
☐ §27 Cost Management : Alertes budget configurées ?
☐ §28 Compliance : Export/delete automatisés ? Audit trail ?
```

---

## Matrice complète (28 sections)

| Section | Checkpoint | Critères clés |
|---------|-----------|---------------|
| §1 Architecture | Après Archi | Template choisi ? Structure respectée ? |
| §2 Structure | Après Archi | Fichiers < 300 lignes ? Naming OK ? |
| §3 Tests | Avant Deploy | Coverage > 80% ? Pyramide respectée ? |
| §4 Linter | Avant Deploy | ESLint + Prettier configurés ? |
| §5 CI/CD | Avant Deploy | Pipeline bloque sans tests ? |
| §6 Sécurité | Après PRD + Archi | 12 points passés ? RLS toutes tables ? |
| §7 Maintenance | Après Deploy | Sentry actif ? Uptime Robot ? |
| §8 Debug | Après Deploy | troubleshooting.md existe ? |
| §9 Rollback | Avant Deploy | Plan documenté ? Migrations réversibles ? |
| §10 Edge Cases | Après Archi | Contraintes DB ? Validation double couche ? |
| §11 Logging | Avant Deploy | Pas de console.log ? Logger structuré ? |
| §12 Caching | Après Archi | Stratégie définie ? TanStack Query ? |
| §13 API Design | Après Archi | REST conventions ? Format standardisé ? |
| §14 Feature Flags | Avant Deploy | Flags configurés si features risquées ? |
| §15 Git Hygiene | Pendant Dev | Commits conventionnels ? .gitignore ? |
| §16 Dépendances | Avant Deploy | npm audit clean ? Lock file committé ? |
| §17 Performance | Avant Deploy | Lighthouse > 90 ? Core Web Vitals OK ? |
| §18 Accessibilité | Avant Deploy | WCAG AA ? Touch targets 44px ? |
| §19 Documentation | Après Deploy | README complet ? Architecture à jour ? |
| §20 Boundaries IA | Pendant Dev | Rules appliquées ? |
| §21 RGPD | Après PRD | Docs légaux ? Consentement ? Export/delete ? |
| §22 Checklists | Avant Deploy | Pré-deploy passée point par point ? |
| §23 Observabilité | Après Deploy | RequestId propagé ? Dashboard santé ? |
| §24 DR Plan | Après Archi | Scénarios catastrophe documentés ? |
| §25 API Versioning | Après Archi | Stratégie de compatibilité définie ? |
| §26 Onboarding | Après Deploy | CONTRIBUTING.md ? First commit < 30min ? |
| §27 Cost Management | Après PRD | Budget infra estimé ? Alertes ? |
| §28 Compliance Auto | Après Deploy | Export/delete automatisés ? Audit trail ? |

---

## Format de sortie

```markdown
# Quality Check — [Checkpoint Name]

**Projet :** [Nom du projet]
**Date :** YYYY-MM-DD HH:MM
**Checkpoint :** [after-prd | after-architecture | before-deploy | after-deploy]

## ✅ Conforme (X/28)
- [Liste des sections OK]

## ⚠️ À corriger (Y/28)
- [Section] : [Problème identifié] → [Action requise]

## 🔴 Bloquant (Z/28)
- [Section] : [Problème critique] → [Action immédiate]

## Verdict
- [ ] ✅ Peut procéder à la phase suivante
- [ ] ⚠️ Peut procéder avec réserves (corriger dans les 48h)
- [ ] 🔴 BLOQUÉ — Corriger avant de continuer
```

---

## Certification

Chaque check génère un rapport de certification horodaté.

**Stockage :** `docs/certifications/YYYY-MM-DD_checkpoint-name.md`

**Template :** `docs/certifications/certification-template.md`

**Badge README :**
```markdown
![PRAGMA Certified](https://img.shields.io/badge/PRAGMA-Certified%20✓-7748F6?style=for-the-badge)
**Dernière certification :** YYYY-MM-DD — [Checkpoint] (✅ X/28)
```
