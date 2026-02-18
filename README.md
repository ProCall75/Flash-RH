# Flash-RH — Portail RH Flash Transports

> Portail RH sur mesure pour Flash Transports (Taverny, 95) — Gestion des absences, relevés de frais, messagerie interne.

**Client :** Flash Transports — Brice GERARD
**Prestataire :** PRAGMA Studio
**Stack :** Next.js 14 + Supabase + Vercel + Resend
**Statut :** En développement

---

## 🎯 Le projet

Application web (PWA) pour digitaliser la gestion RH de Flash Transports :
- **~35 conducteurs** (VL/PL) + équipe bureau
- Remplacement complet du papier (formulaires absences + grilles de frais)
- Messagerie interne (notes de service, compta → conducteurs)
- Mobile-first pour les conducteurs

## 📦 Modules

| Module | Description |
|--------|-------------|
| Dashboard | KPIs, demandes en attente, calendrier absences, alertes |
| Absences | Soumission, validation/refus, notifications, absences dernière minute |
| Frais | Grille jour par jour (cycle 20-20), montants conventions collectives, primes |
| Corrections | Workflow correction → notification → contestation |
| Messagerie | Messages internes, notes de service, pièces jointes |
| Export | PDF mensuel pour la comptabilité |
| Admin | Gestion utilisateurs, paramétrage montants, RBAC |

## 🚀 Setup

```bash
npm install
cp .env.example .env.local
# Remplir les clés Supabase + Resend
npm run dev
```

## 📁 Documentation

| Doc | Fichier |
|-----|---------|
| PRD complet | [`docs/prd.md`](docs/prd.md) |
| Architecture | [`docs/architecture.md`](docs/architecture.md) |
| Glossaire métier | [`docs/glossary.md`](docs/glossary.md) |
| Contexte client | [`client-context/CONTEXTE-RH.md`](client-context/CONTEXTE-RH.md) |

---

*Built with the PRAGMA Senior Dev Framework — PRAGMA Studio*
