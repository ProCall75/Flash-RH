# Politique de Confidentialité — [Nom du Projet]

> **Template à adapter avec les informations du client.**
> Référence : Framework §21 (RGPD & Legal)

**Dernière mise à jour :** [Date]

---

## 1. Identité du Responsable de Traitement

| | |
|---|---|
| **Société** | [Nom de la société cliente] |
| **Forme juridique** | [SAS / SARL / ...] |
| **Siège social** | [Adresse] |
| **SIRET** | [Numéro] |
| **Représentant légal** | [Nom] |
| **Email de contact** | [email DPO ou contact] |

---

## 2. Données Collectées

### Données fournies directement

| Donnée | Finalité | Base légale |
|--------|----------|-------------|
| Nom, prénom | Identification | Exécution du contrat |
| Adresse email | Connexion, communication | Exécution du contrat |
| Mot de passe (hashé) | Authentification | Exécution du contrat |
| [Autres données] | [Finalité] | [Base légale] |

### Données collectées automatiquement

| Donnée | Finalité | Base légale |
|--------|----------|-------------|
| Adresse IP | Sécurité, logs | Intérêt légitime |
| Données de navigation | Amélioration du service | Consentement |
| Cookies fonctionnels | Fonctionnement de l'app | Intérêt légitime |
| Cookies analytics | Mesure d'audience | Consentement |

---

## 3. Finalités du Traitement

Les données sont collectées pour :

1. **Fourniture du service** — Permettre l'utilisation de l'application
2. **Gestion du compte** — Création, authentification, gestion du profil
3. **Communication** — Notifications relatives au service
4. **Amélioration** — Analyse d'usage anonymisée pour améliorer le produit
5. **Sécurité** — Détection et prévention des activités malveillantes

---

## 4. Durée de Conservation

| Donnée | Durée de conservation |
|--------|----------------------|
| Données de compte | Durée du contrat + 3 ans |
| Logs de connexion | 12 mois |
| Cookies analytics | 13 mois |
| Données supprimées | Effacées sous 30 jours |

---

## 5. Sous-traitants

| Sous-traitant | Service | Localisation | DPA |
|--------------|---------|-------------|-----|
| Supabase | Base de données, Auth | EU (Frankfurt) | ✅ |
| Vercel | Hébergement | EU / US | ✅ |
| Sentry | Monitoring erreurs | EU | ✅ |
| [Autres] | [Service] | [Localisation] | [Oui/Non] |

---

## 6. Vos Droits (RGPD)

Conformément au RGPD, vous disposez des droits suivants :

| Droit | Description | Comment l'exercer |
|-------|-------------|------------------|
| **Accès** | Obtenir une copie de vos données | Paramètres > Exporter mes données |
| **Rectification** | Modifier vos informations | Paramètres > Profil |
| **Suppression** | Supprimer votre compte et toutes vos données | Paramètres > Supprimer mon compte |
| **Portabilité** | Exporter vos données en format standard (JSON) | Paramètres > Exporter mes données |
| **Opposition** | Vous opposer au traitement de vos données | Contacter [email] |
| **Limitation** | Limiter le traitement de vos données | Contacter [email] |

**Délai de réponse :** 30 jours maximum.

**Contact :** [email DPO ou contact]

---

## 7. Sécurité des Données

Nous mettons en œuvre les mesures suivantes :

- ✅ Chiffrement des données en transit (HTTPS/TLS)
- ✅ Chiffrement des mots de passe (bcrypt/argon2)
- ✅ Accès aux données restreint (Row Level Security)
- ✅ Backups quotidiens chiffrés
- ✅ Monitoring des accès et alerting
- ✅ Audit de sécurité régulier des dépendances

---

## 8. Cookies

| Type | Nom | Finalité | Durée | Consentement |
|------|-----|----------|-------|:------------:|
| Nécessaire | `sb-access-token` | Authentification | Session | Non requis |
| Nécessaire | `sb-refresh-token` | Renouvellement auth | 30 jours | Non requis |
| Analytics | `_ga` | Mesure d'audience | 13 mois | ✅ Requis |
| [Autres] | [Nom] | [Finalité] | [Durée] | [Oui/Non] |

Vous pouvez gérer vos préférences de cookies à tout moment via [le bandeau cookies / les paramètres].

---

## 9. Transferts Hors UE

[Si applicable : décrire les transferts hors UE et les garanties (clauses contractuelles types, décision d'adéquation, etc.)]

---

## 10. Notification de Violation

En cas de violation de données personnelles, nous nous engageons à :

1. Notifier la CNIL dans les **72 heures**
2. Informer les personnes concernées si le risque est élevé
3. Documenter l'incident et les mesures prises

---

## 11. Contact

Pour toute question relative à cette politique de confidentialité :

**Email :** [email]
**Adresse :** [adresse]

Vous pouvez également introduire une réclamation auprès de la **CNIL** : [www.cnil.fr](https://www.cnil.fr)

---

*Politique de confidentialité rédigée conformément au Règlement (UE) 2016/679 (RGPD).*
