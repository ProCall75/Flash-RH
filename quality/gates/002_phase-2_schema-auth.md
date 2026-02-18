# 🔒 Quality Gate — Phase 2 — Schema & Auth

**Projet :** Flash RH
**Date :** 2026-02-18 11:15
**Phase :** 2 — Schema Supabase & Authentification

---

## Scope

| Livrable | Fichier(s) | Lignes |
|----------|-----------|--------|
| Migration profiles | `supabase/migrations/001_profiles.sql` | 47 |
| Migration absences | `supabase/migrations/002_absences.sql` | 62 |
| Migration frais | `supabase/migrations/003_frais.sql` | 123 |
| Migration corrections | `supabase/migrations/004_corrections.sql` | 49 |
| Migration messages | `supabase/migrations/005_messages.sql` | 56 |
| Seed data | `supabase/seed.sql` | 15 |
| Login page | `app/login/page.tsx` | 125 |
| Auth callback | `app/auth/callback/route.ts` | 16 |
| useUser hook | `lib/hooks/useUser.tsx` | 77 |

---

## Checks

### SQL & Sécurité
- [x] 5 migrations séquentielles (001→005) ✅
- [x] RLS activé sur 11 tables ✅
- [x] CHECK constraints sur types, statuts, dates ✅
- [x] `motif_refus` obligatoire si `statut = 'refusee'` ✅
- [x] Trigger `update_updated_at` pour absences et relevés ✅
- [x] Trigger `handle_new_user` crée profil après signup ✅
- [x] Indexes de performance (`idx_notifications_destinataire`, `idx_messages_created`) ✅
- [x] Seed data avec montants convention collective (10€ repas, 65€ nuit PL, etc.) ✅
- [x] UNIQUE constraint `(employe_id, periode_id)` sur `releves_frais` ✅

### Auth
- [x] Login page avec email/password ✅
- [x] Password visibility toggle ✅
- [x] Loading + error states ✅
- [x] Glassmorphism dark theme ✅
- [x] Auth callback avec `exchangeCodeForSession` ✅
- [x] `useUser` hook avec RBAC (`isAdmin`, `isBureau`, `isConducteur`) ✅
- [x] Real-time `onAuthStateChange` listener ✅

### Code Quality
- [x] 0 `console.log` ✅
- [x] 0 `: any` ✅
- [x] Max 125 lignes (login) — sous limite 300 ✅

---

## Tables créées

| Table | RLS | Policies | Checks |
|-------|-----|----------|--------|
| `profiles` | ✅ | 3 | role IN (admin, bureau, conducteur) |
| `absences` | ✅ | 5 | type (6 vals), statut (3 vals), date_reprise > dernier_jour |
| `periodes_frais` | ✅ | 2 | statut (ouverte, cloturee), date_fin > date_debut |
| `categories_frais` | ✅ | 2 | type (frais, prime), vehicule (VL, PL, tous) |
| `releves_frais` | ✅ | 5 | statut (5 vals), UNIQUE(employe, periode) |
| `lignes_frais` | ✅ | 3 | — |
| `lignes_primes` | ✅ | 3 | — |
| `corrections_frais` | ✅ | 3 | — |
| `contestations` | ✅ | 4 | statut (ouverte, resolue) |
| `messages` | ✅ | 3 | type (4 vals), destinataires (4 vals) |
| `notifications` | ✅ | 3 | — |

---

## Supabase Dashboard

- [x] 11 tables visibles dans Table Editor ✅
- [x] Seed data inséré (10 catégories + 1 période) ✅
- [x] API URL et Anon Key récupérés ✅

---

## Verdict

- [x] ✅ **PASS** → Phase 3 autorisée
