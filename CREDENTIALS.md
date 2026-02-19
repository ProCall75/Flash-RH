# Flash RH — Identifiants Test (DÉFINITIFS)

> **Ne jamais modifier ces comptes manuellement dans Supabase.**
> En cas de problème, relancer `node scripts/reset-auth.mjs`.

## Comptes

| Rôle        | Email                        | Mot de passe       |
|-------------|------------------------------|---------------------|
| Admin       | `admin@flash-rh.test`        | `Flash2026!admin`   |
| Bureau      | `bureau@flash-rh.test`       | `Flash2026!bureau`  |
| Conducteur (PL) | `conducteur@flash-rh.test`   | `Flash2026!cond`    |
| Conducteur (VL) | `conducteur2@flash-rh.test`  | `Flash2026!cond`    |

## Pattern des mots de passe

```
Flash2026!<rôle>
```

- Admin → `Flash2026!admin`
- Bureau → `Flash2026!bureau`
- Conducteurs → `Flash2026!cond`

## Dépannage

Si le login ne marche plus :
```bash
node scripts/reset-auth.mjs
```
Ce script supprime TOUT et recrée les comptes. Pas de questions.
