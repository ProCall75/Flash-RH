# Architecture technique — Portail RH Flash Transports

> **Projet :** Flash-RH
> **Version :** 1.0
> **Date :** 18 février 2026

---

## Stack technique

| Couche | Technologie | Justification |
|--------|-------------|---------------|
| **Frontend** | Next.js 14 (App Router) + TypeScript | SSR, routing, API routes intégrées |
| **Styling** | Tailwind CSS | Rapidité de développement, responsive natif |
| **Backend** | Supabase (PostgreSQL) | Auth, RLS, Realtime, Edge Functions |
| **Hébergement** | Vercel | CI/CD automatique, preview deploys |
| **Auth** | Supabase Auth (email/password) | JWT natif, intégré à RLS |
| **Emails** | Resend | Notifications transactionnelles |
| **Export PDF** | react-pdf ou jsPDF | Génération côté client/serveur |
| **Mobile** | PWA (responsive) | Pas de store, installation directe |
| **Fichiers** | Supabase Storage | Pièces jointes messagerie |

---

## Architecture

```
┌─────────────────────────────────────────────┐
│                  VERCEL                       │
│  ┌─────────────────────────────────────────┐ │
│  │         Next.js App Router              │ │
│  │  ┌──────────┬──────────┬──────────────┐ │ │
│  │  │ Pages    │ API      │ Server       │ │ │
│  │  │ (React)  │ Routes   │ Components   │ │ │
│  │  └──────────┴──────────┴──────────────┘ │ │
│  └─────────────────────────────────────────┘ │
└──────────────────┬──────────────────────────┘
                   │ HTTPS
                   ▼
┌─────────────────────────────────────────────┐
│                SUPABASE                      │
│  ┌──────────┬─────────┬─────────┬─────────┐ │
│  │ Auth     │ DB      │ Storage │ Realtime│ │
│  │ (JWT)    │ (PG)    │ (S3)    │ (WS)   │ │
│  └──────────┴─────────┴─────────┴─────────┘ │
│  ┌──────────────────────────────────────────┐│
│  │ Edge Functions (notifications, exports)  ││
│  └──────────────────────────────────────────┘│
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│              RESEND (emails)                 │
└─────────────────────────────────────────────┘
```

---

## Structure du repo

```
Flash-RH/
├── app/                    # Pages Next.js (App Router)
│   ├── (auth)/             # Routes auth (login, reset password)
│   ├── (dashboard)/        # Dashboard admin
│   ├── absences/           # Module absences
│   ├── frais/              # Module frais
│   ├── messages/           # Messagerie interne
│   ├── export/             # Export PDF
│   ├── utilisateurs/       # Gestion users (admin)
│   ├── parametres/         # Paramètres
│   └── api/                # API routes
├── components/             # Composants React réutilisables
│   ├── ui/                 # Composants UI de base
│   ├── forms/              # Formulaires (absence, frais)
│   ├── tables/             # Tables (liste absences, frais)
│   └── layout/             # Layout (sidebar, header, mobile nav)
├── lib/                    # Utilitaires
│   ├── supabase/           # Client Supabase, types
│   ├── hooks/              # Custom hooks
│   └── utils/              # Helpers (formatage, calculs)
├── types/                  # Types TypeScript
├── public/                 # Assets statiques
├── docs/                   # Documentation projet
├── client-context/         # Contexte client
└── .agent/                 # Config IA PRAGMA
```

---

## Environnements

| Env | URL | Usage |
|-----|-----|-------|
| **Dev** | localhost:3000 | Développement local |
| **Preview** | flash-rh-[branch].vercel.app | PR previews |
| **Prod** | flash-portail-rh.vercel.app | Production |

---

## Variables d'environnement

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
NEXT_PUBLIC_APP_URL=
```

---

*Mis à jour le 18 février 2026 — PRAGMA Studio*
