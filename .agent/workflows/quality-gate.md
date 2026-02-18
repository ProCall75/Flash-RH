---
description: Quality Gate — Vérification inter-phase automatique. Exécuté ENTRE chaque phase du plan d'implémentation pour guarantir la conformité.
---

# Quality Gate — Vérification Inter-Phase

> **Rôle :** Gate obligatoire entre chaque phase d'implémentation.
> Vérifie que les règles dev, l'architecture, et l'intégrité du code sont respectées.
> **Aucune phase suivante ne démarre sans un gate PASS.**

---

## Utilisation

```bash
# Après chaque phase terminée :
/quality-gate phase=1   # Après Project Init
/quality-gate phase=2   # Après Schema + Auth
/quality-gate phase=3   # Après Layout + RBAC
/quality-gate phase=4   # Après Dashboard
/quality-gate phase=5   # Après Module Absences
/quality-gate phase=6   # Après Module Frais
/quality-gate phase=7   # Après Messagerie
/quality-gate phase=8   # Après Export + Deploy (= quality-agent final)
```

---

## Checks communs (TOUS les gates)

### A — Build & Compilation
```
☐ `npm run build` passe sans erreur
☐ Pas de warning TypeScript (strict mode)
☐ Pas d'erreur ESLint bloquante
```

### B — Rules dev.md
```
☐ Aucun fichier > 300 lignes
☐ Naming conventions respectées (PascalCase components, camelCase hooks/utils)
☐ Pas de `any` TypeScript
☐ Pas de `console.log` (sauf dev)
☐ Séparation des responsabilités (page < 100 lignes, logique dans lib/)
☐ Validation Zod sur toutes les API routes
☐ Auth check sur toutes les routes protégées
```

### C — Architecture
```
☐ Structure app/ respecte le template A (§1)
☐ Pas de logique métier dans les composants UI
☐ Supabase clients utilisés correctement (server.ts pour RSC, client.ts pour client)
☐ Types database.ts à jour avec le schema
```

### D — Intégrité (rien n'a été cassé)
```
☐ Toutes les pages des phases précédentes sont accessibles
☐ Les imports ne sont pas cassés
☐ .env.example à jour si nouvelles variables
☐ Le middleware.ts fonctionne (pas de boucle de redirect)
```

### E — Git Hygiene
```
☐ Commits conventionnels (feat/fix/docs/chore)
☐ .gitignore correct (pas de node_modules, .env, .next)
☐ package-lock.json committé
```

---

## Checks spécifiques par phase

### Phase 1 — Project Init
```
☐ Next.js build passe
☐ Supabase clients créés (client.ts, server.ts, middleware.ts)
☐ Types database.ts couvre toutes les tables du PRD
☐ middleware.ts protège les routes
☐ .env.example a toutes les variables
☐ .gitignore complet
```

### Phase 2 — Schema + Auth
```
☐ Toutes les migrations SQL sont syntaxiquement correctes
☐ RLS activé sur CHAQUE table (§6.3)
☐ Contraintes DB en place : CHECK, NOT NULL, FK, UNIQUE (§10)
☐ Login page fonctionne
☐ Trigger auto-create profile existe
☐ Seed data cohérent avec les montants conventions collectives
```

### Phase 3 — Layout + RBAC
```
☐ Sidebar affiche les bons liens selon le rôle
☐ Mobile nav (bottom tabs) pour conducteurs
☐ useUser hook retourne le profil + rôle
☐ Routes admin inaccessibles pour conducteur
☐ Routes conducteur visibles pour admin
```

### Phase 4 — Dashboard
```
☐ 4 KPIs affichés (absences en attente, frais du mois, effectif, congés)
☐ Données mockées si pas de Supabase
☐ Feed d'activité récente
☐ Design conforme (pas de freestyle CSS)
```

### Phase 5 — Module Absences
```
☐ Formulaire reproduit le formulaire papier (nom, type, 3 choix dates)
☐ Tous les types d'absence du PRD sont dans le select
☐ Workflow complet : soumettre → valider/refuser → notifier
☐ Motif obligatoire si refus
☐ Absences dernière minute flaggées
```

### Phase 6 — Module Frais
```
☐ Cycle 20-20 implémenté (pas 1er-31)
☐ Grille jour par jour avec catégories pré-remplies
☐ Montants conventions collectives exacts (10€ repas midi RP, etc.)
☐ Différenciation VL/PL (nuit province PL = 65€, VL = 16€)
☐ Total auto-calculé (frais + primes)
☐ Workflow correction → contestation fonctionnel
☐ Alerte J17 pour saisie incomplète
```

### Phase 7 — Messagerie
```
☐ Compose avec sélecteur de destinataires (tous, PL, VL, bureau)
☐ Types de messages (note_service, info, rappel, urgent)
☐ Lecture marquée (lu_par array)
☐ Pièce jointe support
```

### Phase 8 — Export + Deploy (Quality Agent Final)
```
☐ Export PDF par période (du 20 au 20)
☐ Gestion utilisateurs CRUD (admin only)
☐ Paramètres : catégories frais modifiables
☐ PWA manifest configuré
☐ Notifications in-app (bell icon + liste)
☐ Seed data complet pour démo
☐ Vercel deploy sans erreur
☐ TOUS les checks des phases précédentes passent encore
```

---

## Format de sortie

```markdown
# 🔒 Quality Gate — Phase [N]

**Projet :** Flash-RH
**Date :** YYYY-MM-DD HH:MM
**Phase :** [N] — [Nom de la phase]

## Checks communs
- [x] Build OK
- [x] Rules dev.md OK
- [ ] Architecture — [problème spécifique]
...

## Checks spécifiques Phase [N]
- [x] ...
- [ ] ...

## Intégrité phases précédentes
- [x] Phase 1 — Project Init ✅
- [x] Phase 2 — Schema + Auth ✅
...

## Verdict
- [x] ✅ PASS → Phase suivante autorisée
- [ ] ⚠️ PASS WITH WARNINGS → Corriger dans les prochaines heures
- [ ] 🔴 FAIL → Corriger avant de continuer
```

---

## Stockage

Chaque gate génère un rapport dans :
`quality/gates/YYYY-MM-DD_phase-N.md`

---

## Règle absolue

> **Si un gate échoue sur un check bloquant, la phase suivante NE DÉMARRE PAS.**
> Corriger d'abord, relancer le gate, puis continuer.
