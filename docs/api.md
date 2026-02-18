# API Documentation

> **Documentation de toutes les routes API.**

Référence : Framework §13 (API Design Standards)

---

## Format Standard

Toutes les réponses suivent le format :

**Success :**
```json
{
  "data": { ... }
}
```

**Error :**
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": [...]
  }
}
```

---

## Authentication

Toutes les routes marquées 🔒 requièrent un token JWT valide.

**Header :**
```
Authorization: Bearer [token]
```

---

## Routes

### POST /api/auth/signup

Créer un nouveau compte.

**Auth :** ❌ Public

**Body :**
```json
{
  "email": "user@example.com",
  "password": "string (min 8 chars)",
  "full_name": "string (optional)"
}
```

**Response 201 :**
```json
{
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com"
    }
  }
}
```

**Errors :**
- 400 — Validation failed
- 409 — Email already exists

---

### GET /api/[resource]

[Documentation pour chaque route...]

**Auth :** 🔒 Required

**Query Params :**
- `page` (optional, default: 1)
- `limit` (optional, default: 20)

**Response 200 :**
```json
{
  "data": [...],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20
  }
}
```

---

*Mettre à jour ce fichier à chaque nouvelle route API.*
