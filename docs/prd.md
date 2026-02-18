# PRD — Portail RH Flash Transports

> **Client :** Flash Transports — Brice GERARD (Dirigeant)
> **Projet :** Portail RH (SaaS)
> **Auteur :** Marwane — PRAGMA Studio
> **Version :** 1.0
> **Date :** 18 février 2026
> **Statut :** Draft

---

## 1. Résumé exécutif

Flash Transports compte **~35 conducteurs** (VL et PL) ainsi qu'une **équipe bureau** (direction, comptabilité). Aujourd'hui, toute la gestion administrative RH — demandes d'absence, relevés de frais, notes de service — repose sur du **papier**, avec des formulaires manuscrits, des corrections à la main, et aucun système de notification.

Le Portail RH a pour objectif de **dématérialiser l'intégralité des processus RH** en un outil SaaS mobile-first qui permet de :
- Soumettre et valider les demandes d'absence en ligne
- Saisir et corriger les relevés de frais avec les montants conventions collectives pré-remplis
- Notifier automatiquement conducteurs et direction à chaque étape
- Communiquer via une messagerie interne (notes de service, messages compta)
- Exporter les données mensuelles en PDF pour la comptabilité

**Valeur business estimée :** 1 100 – 1 450 €/mois (temps gagné + erreurs évitées).

---

## 2. Contexte et problème

### 2.1 Situation actuelle

| Aspect | État actuel |
|--------|-------------|
| **Demandes d'absence** | Formulaire papier — Nom, Type (CP/sans solde), 3 choix de dates, signature |
| **Relevés de frais** | Grille papier mensuelle jour par jour (1-31) avec catégories et montants |
| **Corrections** | Brice corrige à la main sur la feuille papier, pas de traçabilité |
| **Notifications** | Aucune — le conducteur doit venir demander si sa demande est validée |
| **Communication interne** | Orale ou papier — Brice refuse WhatsApp |
| **Export comptable** | Recopie manuelle des totaux |
| **Accès mobile** | Aucun — tout est papier |

### 2.2 Problèmes identifiés

1. **Perte de temps massive** — Brice passe 4-5h/semaine sur la gestion papier (corrections, validations, exports)
2. **Erreurs de saisie** — Les conducteurs remplissent les montants à la main, erreurs récurrentes
3. **Pas de notification** — Le conducteur ne sait pas si son absence est validée ou ses frais corrigés
4. **Pas de traçabilité** — Aucun historique des corrections apportées aux frais
5. **Pas de canal de communication** — Pas de moyen structuré pour envoyer des notes de service
6. **35 feuilles × 2 formulaires/mois** — Volume papier significatif

### 2.3 Contexte concurrentiel

Un **concurrent** a déjà présenté un portail RH à Brice, mais il **n'a pas encore validé** cette solution. Notre fenêtre est encore ouverte. Le levier PRAGMA : **vitesse d'exécution, sur-mesure, montants conventions collectives pré-remplis**.

Les solutions du marché (Lucca, PayFit, Factorial) coûtent 150–1 000€/mois pour 35 employés mais **aucune** ne gère les montants spécifiques au transport, les primes WE/jours fériés, ni le workflow correction-contestation sur-mesure.

---

## 3. Personas

### 3.1 Brice GERARD — Dirigeant / Validateur

| Attribut | Détail |
|----------|--------|
| **Rôle** | Président de Flash Transports — Décideur final — Validateur |
| **Contact** | brice.gerard@flashtransports.fr — 06 08 28 74 19 |
| **Plateforme** | Desktop + Mobile |
| **Fréquence** | Quotidienne (validation absences, correction frais) |
| **Tâches** | Valider/refuser les demandes d'absence, corriger les relevés de frais, envoyer des notes de service, consulter le dashboard RH, exporter pour la comptabilité |
| **Pain points** | 4-5h/semaine de paperasse, aucun outil de notification, corrections non traçables |

### 3.2 Delphine — Co-dirigeante / Validatrice

| Attribut | Détail |
|----------|--------|
| **Rôle** | Co-dirigeante — Validatrice absences/frais |
| **Plateforme** | Desktop |
| **Fréquence** | Quotidienne |
| **Tâches** | Même rôle de validation que Brice |
| **Note** | Contact à obtenir |

### 3.3 Conducteur PL — Poids Lourds

| Attribut | Détail |
|----------|--------|
| **Rôle** | Conducteur poids lourds — routes longue distance |
| **Plateforme** | Mobile (smartphone Android/iOS) |
| **Fréquence** | Hebdomadaire (frais), ponctuelle (absences, messages) |
| **Tâches** | Saisir ses frais, soumettre des demandes d'absence, consulter les messages, voir le statut de ses demandes |
| **Pain points** | Formulaires papier peu pratiques en déplacement, pas de retour sur ses demandes |
| **Spécificité** | Accès aux frais PL (découché PL = 65€, nuit province PL = 65€) |

### 3.4 Conducteur VL — Véhicules Légers

| Attribut | Détail |
|----------|--------|
| **Rôle** | Conducteur véhicule léger — courses courtes/moyennes |
| **Plateforme** | Mobile (smartphone) |
| **Fréquence** | Hebdomadaire (frais), ponctuelle (absences) |
| **Tâches** | Même que PL mais frais différents |
| **Spécificité** | Accès aux frais VL (nuit province VL = 16€) |

### 3.5 Comptabilité

| Attribut | Détail |
|----------|--------|
| **Rôle** | Service comptabilité — destinataire des exports, émetteur de messages |
| **Plateforme** | Desktop |
| **Fréquence** | Mensuelle (exports), ponctuelle (messages) |
| **Tâches** | Récupérer les exports PDF, envoyer des messages aux conducteurs (documents disponibles, rappels) |

---

## 4. Objectifs et métriques de succès

### 4.1 Objectifs

| # | Objectif | Mesure |
|---|----------|--------|
| O1 | Éliminer le papier pour les absences | 0 formulaire papier utilisé après 1 mois d'adoption |
| O2 | Éliminer le papier pour les frais | 100% des conducteurs saisissent en ligne |
| O3 | Réduire le temps admin de Brice | De ~4-5h/semaine à <1h/semaine |
| O4 | Notifier automatiquement à chaque étape | 100% des validations/corrections déclenchent une notification |
| O5 | Permettre la communication interne sans WhatsApp | 100% des notes de service passent par le portail |
| O6 | Exporter proprement pour la comptabilité | Export PDF en 1 clic en fin de période |

### 4.2 KPIs de succès

| KPI | Cible V1 |
|-----|----------|
| Taux d'adoption (conducteurs actifs/mois) | >90% des 35 conducteurs |
| Temps moyen de soumission d'une absence | < 2 minutes |
| Temps moyen de saisie des frais hebdo | < 5 minutes |
| Taux de contestation post-correction | < 10% (signe que les corrections sont claires) |
| Temps de génération d'un export PDF | < 5 secondes |

---

## 5. Périmètre fonctionnel

### 5.1 V1 — MVP (ce qu'on livre)

#### Module 1 — Dashboard Admin

Le tableau de bord est la première page après connexion pour Brice et Delphine. Il donne une **vue d'ensemble instantanée** de l'état RH.

**Composants :**
- **4 KPIs principaux :**
  - Demandes d'absence en attente
  - Frais du mois en cours (total €)
  - Congés en cours (nombre de personnes absentes)
  - Effectif présent aujourd'hui
- **Dernières demandes** — Feed des demandes récentes (absence + frais) avec statut (En attente / Validé / Refusé / Corrigé)
- **Calendrier d'absences** — Vue synthétique des absences sur le mois (qui est absent quand)
- **Alertes** — Frais non saisis J17, contestations en attente

---

#### Module 2 — Gestion des absences

Le cœur du module RH côté congés.

**Côté conducteur (soumission) :**
- Formulaire digital reproduisant le formulaire papier :
  - Nom, Prénom (pré-rempli via le profil connecté)
  - Type d'absence : `CP` | `CP par anticipation` | `Congés sans solde` | `Maladie` | `Accident de travail` | `Exceptionnelle`
  - Dates souhaitées (dernier jour travaillé + date de reprise)
  - Possibilité de proposer jusqu'à 3 choix de dates
  - Commentaire optionnel
- Historique de ses demandes avec statut en temps réel
- Notification push/email à chaque changement de statut

**Côté admin (validation) :**
- Liste de toutes les demandes avec filtres (par statut, par période, par conducteur)
- Actions : **Valider** / **Refuser** (avec motif obligatoire si refus)
- Notification automatique au conducteur après validation/refus
- Bouton d'export liste des absences (PDF)

**Absences dernière minute :**
- Section dédiée pour signaler qu'un conducteur est malade/absent au dernier moment
- Tout le monde (admin) voit immédiatement l'info
- Notification à l'équipe concernée

> **Note :** Le solde de congés restant n'est **PAS** dans l'app — il est géré par le cabinet de paie et figure sur la fiche de paie.

---

#### Module 3 — Relevés de frais

Le module le plus complexe — reproduit la grille papier en version digitale.

**Cycle de frais : du 20 au 20**
- La période de saisie va du 20 du mois M au 20 du mois M+1
- Ce n'est PAS un mois calendaire classique

**Côté conducteur (saisie) :**
- Grille mensuelle jour par jour (du 20 au 20)
- Catégories de frais pré-remplies avec montants conventions collectives
- Le conducteur **coche les jours** correspondants — les montants sont calculés automatiquement
- Section primes en dessous avec les mêmes principes
- Total auto-calculé (frais + primes)
- Profil VL / PL détermine quels montants sont affichés (ex : Nuit province PL = 65€ vs VL = 16€)
- Saisie à tout moment pendant la période

**Grille de frais (montants pré-remplis) :**

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

**Primes :**

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

**Côté admin (correction) :**
- Même grille mais avec possibilité de modifier les valeurs
- Historique des corrections (qui a corrigé quoi, quand)
- Bouton "Notifier le conducteur" après correction
- Le conducteur peut **contester** la correction (retour en validation)

**Alerte automatique J17 :**
- Si au J17 de la période un conducteur n'a pas complété ses frais → notification automatique

---

#### Module 4 — Messagerie interne

Demandée explicitement par Brice pour remplacer WhatsApp.

**Fonctionnalités :**
- Envoi de messages à tous les conducteurs (broadcast)
- Envoi de messages à un groupe (ex : conducteurs PL uniquement)
- Envoi de messages individuels
- Types de messages : notes de service, rappels compta, documents à disposition
- Notifications push/email pour chaque nouveau message
- Possibilité de joindre un fichier (PDF, image)
- Historique des messages consultable

**Émetteurs :** Admin (Brice, Delphine, Comptabilité)
**Destinataires :** Conducteurs (et bureau)

---

#### Module 5 — Export comptable

En fin de période, la comptabilité a besoin d'un récap exportable.

**Fonctionnalités :**
- Sélecteur de période (du 20 au 20)
- Tableau récapitulatif par conducteur : total frais, total primes, grand total
- Détail par conducteur si besoin
- **Export PDF** — 1 clic
- Statut de chaque relevé : Validé / En attente / Contesté

---

#### Module 6 — Vue mobile conducteur

Interface mobile-first pour les conducteurs.

**Caractéristiques :**
- Navigation simplifiée (bottom tabs) : Accueil / Frais / Absences / Messages / Profil
- Gros boutons tactiles adaptés à l'usage en déplacement
- Saisie rapide des frais (grille simplifiée pour mobile)
- Soumission d'absence en 3 étapes
- Consultation des messages et notifications
- Vue "Mon statut" : absences en cours, frais de la période
- PWA — pas de téléchargement sur store

---

#### Module 7 — Gestion des utilisateurs (RBAC)

**3 niveaux de droits :**

| Rôle | Droits | Utilisateurs types |
|------|--------|-------------------|
| **Admin** | Tout : validation, correction, messagerie, export, gestion users, paramètres | Brice, Delphine |
| **Bureau** | Consultation dashboard, envoi messages, consultation exports | Comptabilité |
| **Conducteur** | Saisie frais, soumission absences, lecture messages, consultation de son propre historique | ~35 conducteurs |

**Fonctionnalités admin :**
- Page de gestion des utilisateurs (CRUD)
- Attribution des rôles et profil (VL / PL)
- Activation/désactivation de comptes

---

#### Module 8 — Authentification

- Connexion par email + mot de passe
- Création de comptes par l'admin uniquement (pas d'inscription publique)
- Récupération de mot de passe par email
- Session persistante (remember me)

---

#### Module 9 — Notifications

Système de notifications multi-canal.

| Événement | Notification à | Canal |
|-----------|---------------|-------|
| Nouvelle demande d'absence | Admin (Brice/Delphine) | In-app + Email |
| Absence validée/refusée | Conducteur | In-app + Email |
| Absence dernière minute | Tous les admins | In-app + Email |
| Frais non saisis (J17) | Conducteur | In-app + Email |
| Frais corrigés par admin | Conducteur | In-app + Email |
| Contestation de correction | Admin | In-app + Email |
| Nouveau message interne | Destinataires | In-app + Email |

---

### 5.2 V2 — Évolutions futures (hors scope V1)

| Fonctionnalité | Description | Priorité |
|----------------|-------------|----------|
| **Gestion des plannings** | Tableau des rotations/plannings conducteurs | Moyenne |
| **Intégration cabinet de paie** | Sync automatique des exports avec le cabinet | Basse |
| **Signature électronique** | Signature numérique sur les absences (remplacement de la signature papier) | Basse |
| **Reporting avancé** | Statistiques d'absentéisme, coûts frais par mois/conducteur | Basse |
| **Gestion documentaire** | Upload de documents (arrêts maladie, justificatifs) | Moyenne |
| **Multi-site** | Support de plusieurs structures | Hors scope |

---

## 6. Règles métier

### 6.1 Cycle de frais

- La période de frais va **du 20 au 20** (pas du 1er au 31)
- Le conducteur saisit ses frais à tout moment pendant la période
- Le J17 de chaque période, une alerte automatique est envoyée si des frais manquent
- Le J20 (ou date configurée), la période est clôturée pour saisie

### 6.2 Montants pré-remplis

- Les montants de frais sont issus des **conventions collectives du transport**
- Le conducteur ne saisit PAS les montants — il **coche les jours** où le frais s'applique
- Les montants sont **paramétrables par l'admin** (en cas de changement de convention)
- Certains frais sont spécifiques au profil PL (ex : Nuit province PL = 65€) vs VL (16€)

### 6.3 Workflow de correction en 4 étapes

```
1. Conducteur soumet son relevé de frais
2. Admin (Brice/Delphine) vérifie et corrige si nécessaire
3. Conducteur est notifié de la correction
4. Conducteur accepte ou CONTESTE → retour en étape 2
```

### 6.4 Types d'absence

| Type | Description |
|------|-------------|
| CP | Congés payés |
| CP par anticipation | Congés payés pris par anticipation |
| Congés sans solde | Absence non rémunérée |
| Maladie | Arrêt maladie |
| Accident de travail | AT déclaré |
| Exceptionnelle | Case hors standard pour les situations non prévues |

### 6.5 Validation des absences

- Validateurs : **Brice GERARD** et **Delphine** uniquement
- Même circuit de validation pour les absences courtes et longues
- Refus = motif obligatoire

### 6.6 Solde de congés

- Le solde de congés restant est géré par le **cabinet de paie**
- Il est inscrit sur la **fiche de paie** du conducteur
- L'app ne gère **PAS** le solde de congés

---

## 7. Architecture technique prévisionnelle

| Composant | Choix |
|-----------|-------|
| **Frontend** | Next.js (React) — App Router |
| **Backend / API** | Supabase (PostgreSQL + Auth + RLS + Realtime) |
| **Hébergement** | Vercel (frontend) + Supabase Cloud (backend) |
| **Authentification** | Supabase Auth (email/password) |
| **Notifications email** | Resend |
| **Notifications push** | Web Push API (PWA) |
| **Export PDF** | Génération côté serveur (Edge Function ou react-pdf) |
| **Mobile** | PWA responsive (pas d'app native) |
| **Stockage fichiers** | Supabase Storage (pièces jointes messagerie) |

---

## 8. Modèle de données (aperçu)

```
profiles (extends Supabase Auth)
├── id (uuid, PK, FK → auth.users)
├── nom (text)
├── prenom (text)
├── email (text)
├── role ('admin' | 'bureau' | 'conducteur')
├── profil_vehicule ('VL' | 'PL' | null)
├── actif (boolean, default true)
└── created_at

absences
├── id (uuid, PK)
├── employe_id (FK → profiles)
├── type ('cp' | 'cp_anticipation' | 'sans_solde' | 'maladie' | 'accident_travail' | 'exceptionnelle')
├── date_dernier_jour_travaille (date)
├── date_reprise (date)
├── choix_dates_2 (jsonb, nullable) — 2ème choix de dates
├── choix_dates_3 (jsonb, nullable) — 3ème choix de dates
├── commentaire (text, nullable)
├── statut ('en_attente' | 'validee' | 'refusee')
├── motif_refus (text, nullable)
├── validee_par (FK → profiles, nullable)
├── date_validation (timestamptz, nullable)
├── derniere_minute (boolean, default false)
├── created_at (timestamptz)
└── updated_at (timestamptz)

periodes_frais
├── id (uuid, PK)
├── date_debut (date) — le 20 du mois M
├── date_fin (date) — le 20 du mois M+1
├── statut ('ouverte' | 'cloturee')
└── created_at

releves_frais
├── id (uuid, PK)
├── employe_id (FK → profiles)
├── periode_id (FK → periodes_frais)
├── statut ('brouillon' | 'soumis' | 'valide' | 'corrige' | 'conteste')
├── total_frais (decimal)
├── total_primes (decimal)
├── total_general (decimal)
├── validee_par (FK → profiles, nullable)
├── date_validation (timestamptz, nullable)
├── created_at (timestamptz)
└── updated_at (timestamptz)

lignes_frais
├── id (uuid, PK)
├── releve_id (FK → releves_frais)
├── date_jour (date)
├── categorie_id (FK → categories_frais)
├── montant (decimal)
├── coche (boolean, default false) — le conducteur coche, le montant est auto
└── corrige_par_admin (boolean, default false)

categories_frais
├── id (uuid, PK)
├── nom (text) — ex: "Repas midi RP"
├── montant_defaut (decimal) — ex: 10.00
├── profil_vehicule ('VL' | 'PL' | 'tous') — filtre par profil
├── type ('frais' | 'prime')
├── ordre_affichage (integer)
└── actif (boolean, default true)

lignes_primes
├── id (uuid, PK)
├── releve_id (FK → releves_frais)
├── date_jour (date)
├── categorie_id (FK → categories_frais)
├── montant (decimal)
├── quantite (decimal, default 1) — pour les primes horaires (½ samedi = nb heures)
└── corrige_par_admin (boolean, default false)

corrections_frais
├── id (uuid, PK)
├── releve_id (FK → releves_frais)
├── admin_id (FK → profiles)
├── champ_modifie (text)
├── ancienne_valeur (text)
├── nouvelle_valeur (text)
├── date_correction (timestamptz)
└── notes (text, nullable)

contestations
├── id (uuid, PK)
├── releve_id (FK → releves_frais)
├── employe_id (FK → profiles)
├── message (text)
├── statut ('ouverte' | 'resolue')
├── created_at (timestamptz)
└── resolue_at (timestamptz, nullable)

messages
├── id (uuid, PK)
├── auteur_id (FK → profiles)
├── titre (text)
├── contenu (text)
├── type ('note_service' | 'info' | 'rappel' | 'urgent')
├── destinataires ('tous' | 'conducteurs_pl' | 'conducteurs_vl' | 'bureau')
├── piece_jointe_url (text, nullable)
├── created_at (timestamptz)
└── lu_par (uuid[]) — array des IDs qui ont lu

notifications
├── id (uuid, PK)
├── destinataire_id (FK → profiles)
├── type (text) — 'absence_validee', 'frais_corrige', 'nouveau_message', etc.
├── titre (text)
├── contenu (text)
├── lue (boolean, default false)
├── lien (text, nullable) — URL vers la ressource concernée
├── created_at (timestamptz)
└── lue_at (timestamptz, nullable)
```

---

## 9. Contraintes et hypothèses

### 9.1 Contraintes

| Contrainte | Détail |
|------------|--------|
| **Solde congés hors scope** | Géré par le cabinet de paie — pas dans l'app |
| **Cycle 20-20** | Les relevés ne sont PAS calés sur le mois calendaire |
| **Montants conventions collectives** | Source de vérité : grille papier de Brice (à paramétrer dans l'admin) |
| **Pas d'app native** | PWA responsive uniquement — pas de store Apple/Google |
| **~35 utilisateurs** | Volume modéré, pas de problème de scalabilité |
| **Pas d'intégration cabinet de paie** | L'export PDF est récupéré manuellement par la compta |

### 9.2 Hypothèses

| Hypothèse | Impact si faux |
|-----------|---------------|
| Les conducteurs ont un smartphone avec accès internet | Si non, certains ne pourront pas utiliser l'app |
| Les montants sont les mêmes pour tous les PL et tous les VL | Si non, ajout d'un niveau de personnalisation par conducteur |
| Brice et Delphine sont les seuls validateurs | Si non, ajouter un système de délégation |
| Le cycle 20-20 est fixe | Si non, rendre la date de début/fin paramétrable |
| Les emails Resend suffisent comme notification | Si non, ajouter SMS via Twilio |

---

## 10. User stories

### Admin (Brice / Delphine)

| US# | En tant que | Je veux | Afin de |
|-----|-------------|---------|---------|
| US1 | Admin | Voir un dashboard avec les demandes en attente et les frais du mois | Piloter la gestion RH en un coup d'œil |
| US2 | Admin | Voir un calendrier des absences | Savoir qui est absent quand |
| US3 | Admin | Valider ou refuser une demande d'absence | Gérer les congés sans papier |
| US4 | Admin | Corriger un relevé de frais ligne par ligne | Rectifier les erreurs de saisie |
| US5 | Admin | Voir l'historique de mes corrections | Garder la traçabilité |
| US6 | Admin | Recevoir une notification quand un conducteur conteste | Traiter rapidement les litiges |
| US7 | Admin | Envoyer une note de service à tous les conducteurs | Communiquer sans WhatsApp |
| US8 | Admin | Envoyer un message à un conducteur spécifique | Communiquer de façon ciblée |
| US9 | Admin | Exporter le récap frais de la période en PDF | Transmettre à la comptabilité |
| US10 | Admin | Gérer les comptes utilisateurs et leurs profils (VL/PL) | Contrôler l'accès et les montants de frais |
| US11 | Admin | Recevoir une alerte quand un conducteur est absent en dernière minute | Réagir rapidement |
| US12 | Admin | Paramétrer les montants de frais et primes | Adapter en cas de changement de convention |

### Conducteur

| US# | En tant que | Je veux | Afin de |
|-----|-------------|---------|---------|
| US13 | Conducteur | Soumettre une demande d'absence depuis mon téléphone | Ne plus remplir de formulaire papier |
| US14 | Conducteur | Saisir mes frais de la semaine en cochant les jours | Gagner du temps (montants pré-remplis) |
| US15 | Conducteur | Être notifié quand ma demande d'absence est validée/refusée | Ne plus avoir à demander |
| US16 | Conducteur | Être notifié quand mes frais sont corrigés | Savoir ce qui a changé |
| US17 | Conducteur | Contester une correction si je ne suis pas d'accord | Faire valoir mon point de vue |
| US18 | Conducteur | Consulter mes messages et notes de service | Rester informé |
| US19 | Conducteur | Voir l'historique de mes absences et de mes frais | Avoir une trace de tout |

### Bureau (Comptabilité)

| US# | En tant que | Je veux | Afin de |
|-----|-------------|---------|---------|
| US20 | Compta | Envoyer un message aux conducteurs | Les informer que des documents sont disponibles |
| US21 | Compta | Télécharger l'export PDF des frais | Préparer la compta mensuelle |

---

## 11. Arborescence de l'application

```
/login
/dashboard                          ← Dashboard admin (KPIs, alertes, calendrier)

# --- Absences ---
/absences                           ← Liste de toutes les demandes (admin)
/absences/nouvelle                  ← Formulaire de demande (conducteur)
/absences/[id]                      ← Détail d'une demande + validation

# --- Frais ---
/frais                              ← Liste des relevés par période (admin)
/frais/saisie                       ← Grille de saisie (conducteur)
/frais/[id]                         ← Détail d'un relevé + correction (admin)
/frais/[id]/contestation            ← Formulaire de contestation

# --- Messagerie ---
/messages                           ← Boîte de réception
/messages/nouveau                   ← Composer un message (admin/bureau)
/messages/[id]                      ← Voir un message

# --- Export ---
/export                             ← Export PDF + sélecteur de période

# --- Admin ---
/utilisateurs                       ← Gestion des users (admin only)
/parametres                         ← Paramètres (montants frais, primes, alertes)
/parametres/categories-frais        ← Gestion des catégories et montants
```

---

## 12. Sécurité et conformité

| Aspect | Implémentation |
|--------|---------------|
| **Authentification** | Supabase Auth (email/password, tokens JWT) |
| **Autorisation** | Row Level Security (RLS) sur toutes les tables |
| **Cloisonnement** | Chaque conducteur ne voit que ses propres données |
| **Chiffrement** | HTTPS (TLS 1.3), données chiffrées au repos (Supabase) |
| **RGPD** | Données stockées en EU (Supabase région eu-west), suppression sur demande |
| **Audit trail** | Table `corrections_frais` + horodatage sur chaque action |
| **Mots de passe** | Hachés via bcrypt (Supabase Auth) |
| **Sessions** | JWT avec expiration, refresh token |
| **Données sensibles** | Les montants de frais et primes sont des données conventions collectives, pas de données de santé |

---

## 13. Livrables

| Livrable | Description |
|----------|-------------|
| Application web | App Next.js déployée sur Vercel |
| Base de données | Projet Supabase configuré avec schéma, RLS, et données initiales |
| PWA mobile | Version mobile responsive avec installation sur l'écran d'accueil |
| Guide utilisateur | Document PDF/Web avec captures d'écran pour admins et conducteurs |
| Formation | Session de 30 min sur site ou en visio pour onboarding |
| Support continu | Maintenance et support inclus dans l'abonnement |

---

## 14. Timeline prévisionnelle

| Phase | Durée | Contenu |
|-------|-------|---------|
| **Semaine 1** | 3 jours | Setup projet, schéma DB, auth, RBAC, profils utilisateurs |
| **Semaine 1** | 2 jours | Dashboard admin, gestion des absences (CRUD + validation) |
| **Semaine 2** | 3 jours | Module frais (grille, saisie, catégories pré-remplies) |
| **Semaine 2** | 2 jours | Correction, contestation, workflow complet frais |
| **Semaine 3** | 2 jours | Messagerie interne, notifications |
| **Semaine 3** | 1 jour | Export PDF, module paramètres |
| **Semaine 3** | 2 jours | Vue mobile (PWA), polish UI, tests |
| **Total** | **~15 jours dev** | |

---

*Document rédigé le 18 février 2026 — PRAGMA Studio*
