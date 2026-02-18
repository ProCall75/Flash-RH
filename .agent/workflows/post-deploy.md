---
description: Phase 4 — Après le go-live. Maintenance, monitoring et protocoles d'incident post-déploiement.
---

# Phase 4 : Après le Go-Live

> **Référence :** Framework §7 (Maintenance), §8 (Debug), §9 (Rollback), §23 (Observabilité), §24 (DR Plan)
>
> **Principe :** "Le build c'est 10%. La maintenance c'est 90%." Le vrai travail commence APRÈS le déploiement.

---

## Monitoring — Savoir AVANT les utilisateurs (§7.2)

### Outils à configurer dès le go-live

| Besoin | Outil | Priorité |
|--------|-------|----------|
| Erreurs & crashes | **Sentry** | 🔴 Immédiat |
| Uptime | **Uptime Robot** | 🔴 Immédiat |
| Métriques app | **Vercel Analytics** | 🔴 Immédiat |
| DB queries | **Supabase Dashboard** | 🔴 Immédiat |
| Analytics produit | **PostHog** | 🟠 Après 1er client |

### Seuils d'alerte (§7.3)

| Quoi | Seuil | Action |
|------|-------|--------|
| API down | 2 checks failed | Rollback ou fix immédiat |
| Error rate > 5% | 5 min soutenu | Investiguer immédiatement |
| Latence P95 > 2s | 5 min soutenu | Optimiser requête |
| CPU > 80% | 5 min soutenu | Upgrade ou optimiser |
| DB connections > 80% | Du pool max | Connection pooling |
| Storage > 80% | Du max | Prévenir client |
| Certificat SSL < 14j | Expiration | Renouveler |

---

## Protocole d'incident (§7.4)

```
1. ALERTE reçue (Sentry / Uptime Robot / signalement client)
2. ACKNOWLEDGE < 15 min (on a vu, on prend en charge)
3. SÉVÉRITÉ (P0 / P1 / P2 / P3)
4. COMMUNIQUER (status page si P0/P1, email client)
5. DIAGNOSTIQUER (logs + métriques + reproduction)
6. DÉCIDER : Fix rapide OU Rollback
7. APPLIQUER + VÉRIFIER
8. POST-MORTEM dans les 48h (P0/P1 obligatoire)
```

### Sévérités

| Sévérité | Définition | Réponse | Résolution |
|----------|-----------|---------|------------|
| **P0** | App totalement down | < 15 min | < 1h |
| **P1** | Feature critique cassée | < 30 min | < 4h |
| **P2** | Bug important, contournable | < 2h | < 24h |
| **P3** | Bug mineur / cosmétique | < 24h | Prochain sprint |

### Communication incidents (§7.6)

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

---

## Maintenance mensuelle (§7.7)

```
☐ Revue crashs/erreurs Sentry
☐ npm audit → pas de vulnérabilités critiques
☐ Test restauration backup (LE FAIRE, pas juste "on a des backups")
☐ Mise à jour dépendances (security patches)
☐ npx knip → vérification code mort
☐ Revue performances (Core Web Vitals)
☐ Feature flags morts (> 30j) → supprimer
☐ Rapport d'activité au client
```

---

## SLA Standard PRAGMA (§7.5)

| Métrique | Engagement |
|----------|-----------|
| Disponibilité | 99.5% (max ~43h downtime/an) |
| Latence API P95 | < 500ms |
| Résolution P0 | < 4h |
| Résolution P1 | < 24h |
| Maintenance planifiée | < 4h/mois, annoncée 48h avant |
| Backup restaurable | < 1h |

---

## Post-mortem template (§8.3)

Après chaque P0/P1, dans les 48h, créer `templates/post-mortem.md` :

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

---

## Disaster Recovery (§24)

### Scénarios critiques

| Scénario | Action immédiate |
|----------|-----------------|
| Supabase down | Vérifier status.supabase.com → Communiquer au client → Attendre |
| Vercel down | Vérifier vercel.com/status → Activer page maintenance |
| Compte compromis | Révoquer tokens → Changer mots de passe → Auditer |
| DB supprimée | NE RIEN TOUCHER → PITR immédiat |
| npm supply chain | Identifier la dep → Rollback → Supprimer |

### Test DR (Trimestriel)

```
☐ Simuler restore PITR sur un projet test
☐ Vérifier que les backups sont restaurables
☐ Vérifier les contacts d'urgence
☐ Vérifier les accès (qui a accès à quoi ?)
☐ Temps de restore effectif vs objectif (< 1h ?)
```

---

## Quality Check

```
Lancer le Quality Agent :
  /quality-agent checkpoint=after-deploy
```
