# CONTEXTE — Portail RH Flash Transports

> **Client :** Flash Transports — Brice GERARD (Dirigeant)
> **Adresse :** 11 rue des Entrepreneurs, ZA des Châtaigniers, 95150 Taverny
> **Prestataire :** PRAGMA Studio (Antonin RIMAUD, Marwane EL MOUTRIBI)
> **Date de collecte :** 10–11 février 2026
> **Sources :** RDV physique (10/02), mails (11/02), questionnaire Tommy (11/02)

---

## 1. Contexte métier

Flash Transports est une entreprise de transport routier basée à Taverny (95). L'entreprise compte **~35 conducteurs** (VL et PL) et une **équipe bureau** (direction, comptabilité, RH).

### Situation actuelle (100% papier)

Toute la gestion administrative RH est réalisée **sur papier** :

- **Demandes d'absence** : formulaire papier rempli par le conducteur, signé par Brice GERARD et le salarié
- **Relevés de frais** : grille mensuelle papier jour par jour, remplie à la main → corrigée à la main par Brice
- **Communication interne** : aucun outil formel — Brice **refuse WhatsApp** et veut un canal professionnel

### Problèmes identifiés

| Problème | Impact |
|----------|--------|
| Tout est papier → perte de temps, erreurs de saisie | ~4-5h/semaine pour Brice sur la paperasse |
| Pas de notification automatique | Le conducteur ne sait pas quand son absence est validée ou ses frais corrigés |
| Corrections non traçables | Brice corrige les frais à la main, pas d'historique |
| Pas de canal de communication structuré | Brice refuse WhatsApp, les notes de service passent par oral ou papier |
| ~35 feuilles × 2 formulaires à traiter chaque mois | Volume significatif de traitement manuel |

### Valeur estimée du portail RH

| Gain | Estimation |
|------|-----------|
| Temps de Brice sur papier (4-5h/semaine) | 500-750€/mois |
| Temps conducteurs (15min/semaine × 35) | ~500€/mois (35h cumulées) |
| Réduction erreurs de saisie frais | 100-200€/mois |
| **Total valeur estimée** | **1 100-1 450€/mois** |

---

## 2. Interlocuteurs clés

| Personne | Rôle | Contact |
|----------|------|---------|
| **Brice GERARD** | Dirigeant — Décideur final — Validateur absences/frais | brice.gerard@flashtransports.fr — 06 08 28 74 19 |
| **Delphine** | Co-dirigeante — Validatrice absences/frais | (contact à obtenir) |
| **Tommy DRON** | Équipe bureau — A répondu au questionnaire | tommy.dron@flashtransports.fr — 06 80 53 45 67 |
| **Conducteurs (~35)** | Utilisateurs principaux du portail (VL et PL) | — |
| **Comptabilité** | Destinataire des exports mensuels + source de messages internes | — |

---

## 3. Fonctionnalités identifiées

### 3.1 Demandes d'absence

**Source :** Formulaire papier de Brice + réponses questionnaire Tommy

| Élément | Détail |
|---------|--------|
| **Types d'absence** | CP, Maladie, Accident de travail, Congé sans solde, **Case "exceptionnelle"** pour hors standard |
| **Absences dernière minute** | Section dédiée quand un conducteur est malade → tout le monde a l'info |
| **Validateurs** | Brice GERARD et Delphine (les patrons) |
| **Absences longues** | Même circuit de validation que les absences courtes |
| **Solde congés** | **PAS dans l'app** → géré par le cabinet de paie, inscrit sur la fiche de paie |

**Formulaire papier actuel (à reproduire en digital) :**
- Nom, Prénom, Service
- Type de congé (CP / CP par anticipation / Congés sans solde)
- 3 choix de dates possibles (dernier jour travaillé + date de reprise)
- Signatures (B. GERARD + Salarié)

### 3.2 Relevés de frais

**Source :** Grille mensuelle papier transmise par Brice + réponses Tommy

| Élément | Détail |
|---------|--------|
| **Cycle** | Du 20 au 20 (pas du 1er au 31) |
| **Saisie** | À tout moment par le conducteur |
| **Alerte** | Si le 17 il manque des saisies → notification automatique |
| **Profils** | Certains frais spécifiques aux PL (ex : découché) |
| **Corrections** | Validation par Brice avec possibilité de **contestation** par le conducteur |
| **Export** | PDF en fin de période |

#### Grille de frais (montants réels — conventions collectives)

| Catégorie | Montant |
|-----------|---------|
| Repas midi RP | 10 € |
| Repas soir RP | 10 € |
| Repas midi province | 9 € |
| Casse-croûte | 19 € |
| Repas soir province | 16 € |
| Nuit province VL | 16 € |
| Nuit province PL | 65 € |
| Repas soir étranger | 34 € |
| Repas midi étranger | 19 € |
| Hôtel | 19 € |

#### Primes

| Prime | Montant |
|-------|---------|
| Départ dimanche | 45 € |
| ½ samedi travaillé | 10 €/H |
| ½ dimanche travaillé | 50 € |
| Samedi travaillé | 70 € |
| Dimanche travaillé | 80 € |
| 1 week-end bloqué | 120 € |
| 1 dimanche bloqué | 80 € |
| 1 week-end travaillé | 170 € |
| ½ jour férié travaillé | 110 € |
| Jour férié travaillé | 80 € |
| Jour férié bloqué | 120 € |

### 3.3 Messagerie interne (demande Brice — 11/02/2026)

> "Serait une messagerie interne à intégrer dans la solution RH, exemple quand notre compta a un message à faire passer à tous les conducteurs, prévenir que des documents sont à leur disposition, note de service… car je ne veux pas me servir d'appli type WhatsApp."

| Élément | Détail |
|---------|--------|
| **Canal** | Messagerie intégrée à l'app RH |
| **Cas d'usage** | Notes de service, messages compta → conducteurs, documents à disposition |
| **Direction** | Bureau → Conducteurs (principalement), possiblement bidirectionnel |
| **Remplace** | WhatsApp (que Brice refuse d'utiliser) |

### 3.4 App Mobile

> "Pour la solution RH, pour nos conducteurs cela passerait par une application utilisable depuis leur smartphone donc soit Android ou iOS."

| Élément | Détail |
|---------|--------|
| **Approche** | Mobile-first pour les conducteurs |
| **Plateforme** | PWA responsive (pas d'app native — pas de store) |
| **Fonctionnalités mobile** | Soumettre une absence, saisir les frais, voir le statut des demandes, recevoir les messages |

---

## 4. Workflow métier

### Cycle des absences
```
Conducteur soumet une demande
    ↓
Brice / Delphine reçoit notification
    ↓
Validation ou Refus
    ↓
Conducteur notifié automatiquement
```

### Cycle des frais (du 20 au 20)
```
J1-J17 : Conducteur saisit ses frais au fur et à mesure
    ↓
J17 : Alerte si saisie incomplète
    ↓
J20 : Clôture de la période
    ↓
Brice vérifie et corrige si nécessaire
    ↓
Conducteur notifié des corrections
    ↓
Conducteur peut CONTESTER la correction
    ↓
Export PDF pour la comptabilité
```

---

## 5. Contraintes et hypothèses

| Contrainte | Détail |
|------------|--------|
| **Solde congés = hors scope** | Géré par le cabinet de paie, pas dans l'app |
| **Cycle 20-20** | Les relevés de frais ne sont PAS sur le mois calendaire |
| **Montants conventions collectives** | Les montants de frais sont pré-remplis, le conducteur coche juste les jours |
| **Profils VL / PL** | Certains frais diffèrent (ex : découché PL = 65€, VL = 16€) |
| **~35 utilisateurs** | Volume modéré, pas de scalabilité massive nécessaire |
| **Concurrent en discussion** | Un autre prestataire a proposé un portail RH — Brice n'a pas encore validé |
| **Pas de SaaS RH existant** | Brice n'utilise aucun outil digital actuellement |

---

## 6. Pricing

| | RH seul | Pack complet (Stockage + RH) |
|---|---------|-------------|
| **Prix "premier client"** | 500€/mois | 800€/mois |
| **Engagement** | 12 mois | 12 mois |
| **Setup** | 0€ | 0€ |
| **Valeur annuelle** | 6 000€ | 9 600€ |

### CAPEX (développement RH)

| Composant | Jours dev | Coût (500€/jour) |
|-----------|----------|-------------------|
| Back-end (DB, API, auth, notifications) | 5 | 2 500€ |
| Front-end (dashboard, grille frais, formulaires, mobile) | 6 | 3 000€ |
| **Total** | **11 jours** | **5 500€** |

---

## 7. Documents de référence

| Document | Chemin (dans Daily) |
|----------|---------------------|
| Synthèse post-RDV (10/02) | `CLIENTS/FLASH TRANSPORTS/reunions/2026-02-10_synthese-post-rdv.md` |
| Mail retour Brice (11/02) | `CLIENTS/FLASH TRANSPORTS/reunions/2026-02-11_mail-retour-brice.md` |
| Réponses questionnaire Tommy | `CLIENTS/FLASH TRANSPORTS/commercial/2026-02-11_reponse-questionnaire-tommy.md` |
| TODO Portail RH (écrans) | `CLIENTS/FLASH TRANSPORTS/visuels/TODO-portail-rh.md` |
| Pricing report | `CLIENTS/FLASH TRANSPORTS/commercial/2026-02-11_pricing-flash-transports.md` |
| Roadmap documentaire | `CLIENTS/FLASH TRANSPORTS/docs-roadmap.md` |
| Mail synthèse envoyé à Brice | `CLIENTS/FLASH TRANSPORTS/reunions/2026-02-10_mail-synthese-brice.md` |
| Mail démos + questionnaires | `CLIENTS/FLASH TRANSPORTS/commercial/2026-02-11_mail-demos-questionnaires.md` |

---

*Document compilé le 18 février 2026 — PRAGMA Studio*
