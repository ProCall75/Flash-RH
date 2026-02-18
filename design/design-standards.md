# Design Standards PRAGMA

> Condensé du branding PRAGMA + standards UI pour l'IA.
> Ce fichier est la référence design pour tous les projets PRAGMA.
>
> **Source complète :** `DESIGN-SYSTEM/branding.md` dans le Daily

---

## Palette de Couleurs

### CSS Variables

```css
:root {
  /* Couleurs principales */
  --color-primary: #7748F6;       /* Boutons, liens, accents */
  --color-primary-hover: #6338E0; /* Hover sur primary */
  --color-primary-light: #A07CFE; /* Accents légers */
  --color-primary-dark: #4C249F;  /* Titres, accents foncés */

  /* Neutres */
  --color-dark: #1E1A33;          /* Titres, texte principal */
  --color-light: #FBFAFF;         /* Backgrounds */
  --color-white: #FFFFFF;         /* Cards, modales */
  --color-muted: #787685;         /* Sous-titres, texte secondaire */

  /* Sémantiques */
  --color-success: #00DC82;       /* Validations, confirmations */
  --color-error: #EF4444;         /* Alertes, erreurs */
  --color-warning: #F59E0B;       /* Avertissements */
  --color-info: #3B82F6;          /* Informations */
}
```

### Gradient Aurora (premium)

```css
.gradient-aurora {
  background: linear-gradient(-45deg, #7748F6, #A07CFE, #4C249F);
}
```

> **Règle :** Pour les projets client, adapter `--color-primary` à la couleur de marque du client. Le reste de la palette reste identique.

---

## Typographie

### Police : Plus Jakarta Sans (Google Fonts)

```html
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
```

```css
:root {
  --font-sans: 'Plus Jakarta Sans', ui-sans-serif, system-ui, -apple-system, sans-serif;
}
```

### Échelle typographique

| Élément | Desktop | Mobile | Weight | Letter Spacing | Line Height |
|---------|---------|--------|--------|----------------|-------------|
| H1 Hero | 72px | 42px | Bold 700 | -0.66px | 1.1 |
| H2 Section | 48px | 32px | Bold 700 | -0.5px | 1.1 |
| H3 Titre | 32px | 24px | SemiBold 600 | -0.37px | 1.1 |
| H4 Sous-titre | 24px | 20px | SemiBold 600 | -0.2px | 1.2 |
| Body | 16px | 16px | Regular 400 | normal | 1.5 |
| Caption | 14px | 12px | Medium 500 | +0.2px | 1.4 |
| Small | 12px | 12px | Regular 400 | +0.3px | 1.4 |

---

## Formes & Espacements

### Border Radius

| Élément | Radius |
|---------|--------|
| Boutons | 20px |
| Cards | 24px — 32px |
| Modales | 32px — 40px |
| Pills / Tags | 9999px |
| Inputs | 12px |

> **ADN visuel = Courbes généreuses. Jamais de coins pointus.**

### Spacing Scale (basé sur 4px)

```css
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
}
```

---

## Ombres

| Type | CSS | Usage |
|------|-----|-------|
| Subtle | `0 2px 8px rgba(0,0,0,0.05)` | Cards au repos |
| Medium | `0 8px 24px rgba(0,0,0,0.1)` | Cards hover |
| Heavy | `0 20px 40px rgba(0,0,0,0.15)` | Modales, popups |

### Effet Glass (Liquid Glass)

```css
.glass {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(32px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  box-shadow: 0 20px 40px -5px rgba(0, 0, 0, 0.1);
}
```

---

## Composants de Base

### Boutons

```css
.btn {
  font-family: var(--font-sans);
  font-weight: 600;
  font-size: 16px;
  padding: 12px 24px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 200ms ease-out;
}

.btn-primary {
  background: var(--color-primary);
  color: white;
  border: none;
}

.btn-primary:hover {
  background: var(--color-primary-hover);
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(119, 72, 246, 0.3);
}

.btn-secondary {
  background: transparent;
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
}

.btn-ghost {
  background: transparent;
  color: var(--color-dark);
  border: none;
}
```

### Cards

```css
.card {
  background: var(--color-white);
  border-radius: 24px;
  padding: var(--space-6);
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  transition: all 300ms ease-out;
}

.card:hover {
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
  transform: translateY(-2px);
}
```

### Inputs

```css
.input {
  font-family: var(--font-sans);
  font-size: 16px;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1.5px solid #E5E3EE;
  background: var(--color-white);
  color: var(--color-dark);
  transition: border-color 200ms ease-out;
}

.input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(119, 72, 246, 0.15);
}

.input::placeholder {
  color: var(--color-muted);
}
```

---

## Icônes

- **Bibliothèque :** [Lucide Icons](https://lucide.dev)
- **Style :** Outline / Line icons
- **Épaisseur :** 1.5px — 2px
- **Angles :** Arrondis
- **Taille standard :** 20px (inline), 24px (navigation)

---

## Animations

```css
/* Transitions standard */
--transition-fast: 150ms ease-out;
--transition-base: 200ms ease-out;
--transition-slow: 300ms ease-out;
--transition-spring: 400ms cubic-bezier(0.34, 1.56, 0.64, 1);
```

### Règles

- **Durée :** 200-400ms max
- **Easing :** ease-out ou spring physics
- **Objectif :** Expliquer, pas décorer
- **Principe :** Subtiles, jamais distrayantes

### Micro-animations courantes

| Interaction | Animation |
|-------------|-----------|
| Bouton hover | `translateY(-1px)` + ombre |
| Card hover | `translateY(-2px)` + ombre |
| Apparition contenu | `fadeIn` + `translateY(10px → 0)` |
| Toggle / switch | `spring` 400ms |
| Loading | Skeleton shimmer |

---

## Accessibilité (§18)

```
✅ Contraste WCAG AA minimum (4.5:1 pour le texte)
✅ Touch targets 44×44px minimum (Apple HIG)
✅ Alt text sur toutes les images informatives
✅ Labels sur tous les inputs (<label htmlFor> ou aria-label)
✅ Navigation clavier fonctionnelle (tab, enter, escape)
✅ Unités relatives (rem) pour les fonts
✅ Focus visible sur les éléments interactifs
✅ Heading hierarchy (un seul h1, puis h2, h3...)
✅ Semantic HTML (<nav>, <main>, <button> pas <div onClick>)
```

---

## Dark Mode (optionnel)

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-dark: #F0EFF5;
    --color-light: #0F0D1A;
    --color-white: #1A1726;
    --color-muted: #9998A5;
  }
}
```

---

## Adaptation Client

Quand on adapte le design pour un client :

1. **Changer `--color-primary`** avec la couleur de marque du client
2. **Garder la typographie** Plus Jakarta Sans (sauf si le client a une police de marque)
3. **Garder les radius** et l'ADN visuel PRAGMA (courbes généreuses)
4. **Garder les ombres** et effets glass
5. **Adapter le logo** dans le header et le favicon

---

*Standards basés sur [PRAGMA Brand Guidelines v2026.01](../../DESIGN-SYSTEM/branding.md)*
