# 🚛 Flash RH — Comprendre l'app en 10 minutes

> **Client :** Flash Transports — Brice GERARD (Dirigeant)
> **Adresse :** 11 rue des Entrepreneurs, ZA des Châtaigniers, 95150 Taverny
> **Ce que fait l'app :** Dématérialiser la gestion RH (absences, frais, communication) d'une boîte de transport

---

## 1. Le problème qu'on résout

Flash Transports = **~35 conducteurs** (PL = Poids Lourds + VL = Véhicules Légers) + une équipe bureau (direction + compta).

**Aujourd'hui tout est sur papier :**
- Demandes d'absence → formulaire papier signé à la main
- Relevés de frais → grille papier jour par jour, Brice corrige à la main
- Communication → zéro outil (Brice **refuse WhatsApp**)
- Notifications → aucune (le conducteur doit appeler pour savoir si ses congés sont validés)

**Résultat :** Brice perd **4-5h/semaine** en paperasse, 35 feuilles × 2 formulaires/mois à traiter.

**Notre portail :** Tout passe en ligne, depuis le téléphone du conducteur.

---

## 2. Les 3 rôles dans l'app

| Rôle | Qui ? | Ce qu'il peut faire |
|------|-------|---------------------|
| **Admin** | Brice, Delphine (les patrons) | **TOUT** : valider absences, corriger frais, envoyer messages, exporter PDF, gérer les users, paramétrer les montants |
| **Bureau** | Compta (Tommy) | Même accès qu'admin en lecture + envoi de messages + export |
| **Conducteur** | Les ~35 chauffeurs | Saisir ses frais, demander une absence, lire les messages, voir ses notifs — **ne voit que SES données** |

### Profils véhicule (important)

Chaque conducteur est soit **PL** (Poids Lourd) soit **VL** (Véhicule Léger).
→ Ça change les montants de frais affichés (ex : découché PL ≠ VL).

---

## 3. Module par module

### 🏠 Dashboard (page d'accueil)

**Admin voit :**
- 4 KPIs : Demandes en attente / Frais à valider / Effectif actif / Notifications
- Calendrier des absences (qui est absent quand)
- Alertes urgentes (absences dernière minute, contestations, relevés à valider)
- Feed des dernières demandes

**Conducteur voit :**
- Ses propres stats : Mes absences / Mes frais / Messages / Solde CP (—)

---

### 📋 Absences

**La règle métier clé :** Le **solde de congés n'est PAS dans l'app** — c'est le cabinet de paie qui le gère (fiche de paie).

**Types d'absence :**

| Type | Code DB |
|------|---------|
| Congés payés | `cp` |
| CP par anticipation | `cp_anticipation` |
| Congés sans solde | `sans_solde` |
| Maladie | `maladie` |
| Accident de travail | `accident_travail` |
| Exceptionnelle (hors standard) | `exceptionnelle` |

**Workflow :**
```
Conducteur soumet → Admin notifié → Valide ✅ ou Refuse ❌ (motif obligatoire) → Conducteur notifié
```

**Spécificité :** Absences **dernière minute** = un conducteur malade au dernier moment → tout le monde voit l'info immédiatement.

**Formulaire :** Reproduit le formulaire papier de Brice :
- Dernier jour travaillé + Date de reprise (jusqu'à 3 choix de dates)
- Commentaire optionnel

---

### 💰 Relevés de frais — LE module le plus complexe

#### Règle n°1 : Le cycle est du 20 au 20

**PAS du 1er au 31.** La période de frais va du **20 du mois M au 20 du mois M+1**. C'est une convention de Flash Transports.

Exemple : la période "Janvier 2026" = du 20/01/2026 au 20/02/2026.

#### Règle n°2 : Le conducteur ne tape PAS les montants

Les montants sont **pré-remplis** (conventions collectives du transport). Le conducteur **coche juste les jours** où le frais s'applique → le total se calcule automatiquement.

#### Règle n°3 : Les montants dépendent du profil VL/PL

Certains frais sont réservés aux PL (ex : découché). D'autres ont des montants différents selon PL ou VL.

#### Grille de frais (montants conventions collectives)

| Catégorie | Montant | Profil |
|-----------|---------|--------|
| Repas midi RP | 10 € | Tous |
| Repas soir RP | 10 € | Tous |
| Repas midi province | 9 € | Tous |
| Casse-croûte | 19 € | Tous |
| Repas soir province | 16 € | Tous |
| Nuit province VL | 16 € | VL |
| Nuit province PL | 65 € | PL |
| Repas soir étranger | 34 € | Tous |
| Repas midi étranger | 19 € | Tous |
| Hôtel | 19 € | Tous |

#### Primes

| Prime | Montant |
|-------|---------|
| Départ dimanche | 45 € |
| ½ samedi travaillé | 10 €/h |
| ½ dimanche travaillé | 50 € |
| Samedi travaillé | 70 € |
| Dimanche travaillé | 80 € |
| 1 week-end bloqué | 120 € |
| 1 dimanche bloqué | 80 € |
| 1 week-end travaillé | 170 € |
| ½ jour férié travaillé | 110 € |
| Jour férié travaillé | 80 € |
| Jour férié bloqué | 120 € |

> ⚠️ **Note :** Dans le seed de test, on a simplifié à 8 catégories (4 frais + 4 primes) pour la démo. La vraie grille de Brice a plus de lignes.

#### Workflow des frais en 4 étapes

```
1. Conducteur saisit ses frais pendant la période (brouillon)
2. Conducteur soumet → statut "soumis"
3. Admin vérifie et corrige si besoin → statut "corrigé"
   └── Historique de chaque correction tracé (table corrections_frais)
4. Conducteur notifié → accepte OU CONTESTE → retour en étape 3
```

**Statuts possibles d'un relevé :** `brouillon` → `soumis` → `valide` | `corrige` → `conteste` (boucle)

#### Alerte J17

Si au **17ème jour** de la période un conducteur n'a pas complété ses frais → notification automatique.

---

### 💬 Messagerie interne

**Pourquoi ?** Brice refuse WhatsApp. Il veut un canal pro intégré à l'app RH.

**Cas d'usage :**
- Notes de service (ex : "Contrôle technique obligatoire avant le 28/02")
- Messages compta → conducteurs ("Vos fiches de paie sont disponibles")
- Rappels

**Types de messages :** `note_service` | `info` | `rappel` | `urgent`

**Destinataires :** `tous` | `conducteurs_pl` | `conducteurs_vl` | `bureau`

**Émetteurs :** Admin et Bureau uniquement (les conducteurs lisent mais n'envoient pas).

---

### 🔔 Notifications

Centre de notifications in-app. Chaque événement déclenche une notif.

| Événement | Notifié à |
|-----------|-----------|
| Nouvelle demande d'absence | Admin |
| Absence validée/refusée | Conducteur |
| Absence dernière minute | Tous les admins |
| Frais non saisis (J17) | Conducteur |
| Frais corrigés par admin | Conducteur |
| Contestation | Admin |
| Nouveau message | Destinataires |

---

### 👥 Gestion des utilisateurs (page Équipe)

Admin only. Permet de :
- Voir tous les collaborateurs (nom, rôle, véhicule, statut actif/inactif)
- Créer un compte (pas d'inscription publique)
- Changer le rôle ou le profil véhicule
- Désactiver un compte

---

### ⚙️ Paramètres

Admin only. Permet de **modifier les montants** de frais et primes.
→ Si la convention collective change, Brice met à jour ici sans toucher au code.

---

### 📊 Export PDF

- Sélection de la période (20-20)
- Tableau récap par conducteur : total frais + primes + grand total
- Export en **PDF** ou **Excel** en 1 clic
- Pour la comptabilité

---

## 4. Architecture technique

| Composant | Techno |
|-----------|--------|
| Frontend | **Next.js** (React) — App Router |
| Backend / API | **Supabase** (PostgreSQL + Auth + RLS) |
| Hébergement | **Vercel** (front) + Supabase Cloud (back) |
| Auth | Supabase Auth (email/password, JWT) |
| Sécurité | **Row Level Security** sur toutes les tables — un conducteur ne voit que SES données |
| Mobile | PWA responsive (pas d'app native, pas de store) |

---

## 5. Tables principales (schéma DB)

```
profiles          → Un user = un profil (nom, rôle, véhicule VL/PL)
absences          → Demandes d'absence (type, dates, statut, validateur)
periodes_frais    → Périodes du 20 au 20 (ouverte/clôturée)
releves_frais     → Un relevé par conducteur par période (brouillon/soumis/validé/corrigé/contesté)
categories_frais  → Liste des catégories avec montants (frais + primes, filtrables par VL/PL)
lignes_frais      → Jour par jour, le conducteur coche → montant auto
lignes_primes     → Idem pour les primes (avec quantité)
corrections_frais → Historique de chaque correction admin (traçabilité)
contestations     → Quand le conducteur conteste une correction
messages          → Notes de service, rappels, infos
notifications     → Centre de notifs (type, lue/non lue, lien)
```

---

## 6. Ce qui est HORS scope (ne PAS implémenter)

| Élément | Raison |
|---------|--------|
| **Solde de congés restant** | Géré par le cabinet de paie (fiche de paie) |
| **App native iOS/Android** | PWA uniquement — pas de store |
| **Intégration cabinet de paie** | Export PDF récupéré manuellement |
| **Gestion des plannings** | V2 future |
| **Signature électronique** | V2 future |
| **SMS** | Emails suffiront en V1 |

---

## 7. Les interlocuteurs chez le client

| Personne | Rôle | Contact |
|----------|------|---------|
| **Brice GERARD** | Dirigeant — Décideur — Validateur | brice.gerard@flashtransports.fr — 06 08 28 74 19 |
| **Delphine** | Co-dirigeante — Validatrice | (contact à obtenir) |
| **Tommy DRON** | Bureau/Compta | tommy.dron@flashtransports.fr — 06 80 53 45 67 |

---

## 8. Contexte commercial

- **Prix :** 500€/mois (RH seul) ou 800€/mois (pack complet avec stockage)
- **Engagement :** 12 mois, 0€ de setup ("prix premier client")
- **Valeur estimée pour Brice :** 1 100–1 450 €/mois (temps gagné + erreurs évitées)
- **Concurrent :** Un autre prestataire a proposé un portail — Brice n'a pas encore validé
- **Notre levier :** Vitesse d'exécution + sur-mesure + montants conventions collectives pré-remplis

---

*Document compilé le 19 février 2026 — Briefing démo*
