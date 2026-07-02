# 🎬 Cinematic Dark UI — CSS Replacement Guide

## What Changed
Your entire UI is now transformed to match the **liquid glass cinematic dark** aesthetic from the reference image:
- **Black video-backdrop base** (#000000) replacing the purple dark theme
- **Liquid glass components** — frosted glass cards, pills, inputs with gradient border shimmer
- **Instrument Serif italic** for all headings (same font as "Built for the curious")
- **White-on-black palette** — no more purple/pink/teal accents, everything is white at varying opacities
- **Pill-shaped buttons** with white fill or glass border
- **All responsive breakpoints preserved** (360 → 1280px)

---

## Step 1 — Copy CSS Files

Replace files in your `frontend/src/` folder:

| File in this ZIP | Replace in your project |
|---|---|
| `styles/global.css` | `frontend/src/styles/global.css` |
| `components/Navbar.css` | `frontend/src/components/Navbar.css` |
| `components/ToolCard.css` | `frontend/src/components/ToolCard.css` |
| `components/Modal.css` | `frontend/src/components/Modal.css` |
| `components/Footer.css` | `frontend/src/components/Footer.css` |
| `components/Chatbot.css` | `frontend/src/components/Chatbot.css` |
| `pages/Home.css` | `frontend/src/pages/Home.css` |
| `pages/AuthPages.css` | `frontend/src/pages/AuthPages.css` |
| `pages/Profile.css` | `frontend/src/pages/Profile.css` |
| `pages/Pages.css` | **NEW FILE** → `frontend/src/pages/Pages.css` |

---

## Step 2 — Import Pages.css

`Pages.css` is a new file that contains CSS for Compare, Saved, Roadmaps, and News pages (previously they were in separate files or the big AuthPages paste).

Open each of these files and add this import at the top if not already present:

**`frontend/src/pages/Compare.js`** (or wherever your compare page is):
```js
import './Pages.css';
```

**`frontend/src/pages/Saved.js`**:
```js
import './Pages.css';
```

**`frontend/src/pages/Roadmaps.js`**:
```js
import './Pages.css';
```

**`frontend/src/pages/News.js`**:
```js
import './Pages.css';
```

> Or just import it once in `App.js`:
> ```js
> import './pages/Pages.css';
> ```

---

## Step 3 — Add Video Background to Home.js

To get the cinematic video background on the hero, add this inside your `Home.js` return, **before** the hero section:

```jsx
{/* Cinematic Video Background */}
<div className="video-bg-container">
  <video
    className="video-bg"
    src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_115001_bcdaa3b4-03de-47e7-ad63-ae3e392c32d4.mp4"
    autoPlay
    muted
    loop
    playsInline
  />
  <div className="video-overlay" />
</div>
```

The CSS for `.video-bg-container`, `.video-bg`, and `.video-overlay` is already in `global.css`.

---

## Step 4 — Remove old theme toggle logic (optional)

The new theme is **dark-only**. The light mode still works but maps to the same dark colors.  
You can hide the theme toggle button in `Navbar.js` if you want a clean look:

```jsx
// Comment out or remove:
// <button className="theme-toggle" ...>
```

---

## What Each File Does

### `global.css`
- New CSS variables (all black/white/glass)
- `.liquid-glass` class with `::before` gradient border trick
- `.video-bg-container` + `.video-bg` for the hero background
- `.btn-primary` is now **white pill** (not purple gradient)
- All badges are now white-tinted glass

### `Navbar.css`
- Transparent navbar (no dark background pill)
- Logo is plain white sans-serif
- Nav links are `rgba(255,255,255,0.7)`
- CTA button is liquid glass pill

### `ToolCard.css`
- Cards are `rgba(255,255,255,0.03)` with glass shimmer border
- Hover: lifts + brightens slightly
- All colored accents replaced with white variants

### `Home.css`
- Hero heading uses `font-style: italic` + `font-family: Instrument Serif`
- Search bar is a liquid glass pill with white submit circle
- Stats, marquee, filter bar, grid all updated

### `Modal.css`, `Chatbot.css`, `Profile.css`, `AuthPages.css`, `Footer.css`, `Pages.css`
- All updated to match the cinematic dark language consistently

---

## Fonts Already Included

`global.css` imports both fonts:
```css
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:...');
```

No `npm install` needed for fonts.

---

## Result

Your site will look like the reference image:
- Pure black cinematic background (with video on hero)
- Frosted glass cards and nav elements  
- Italic serif headings
- Minimal white typography
- Clean pill buttons
