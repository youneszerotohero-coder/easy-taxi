# Easy Taxi — site vitrine & réservation

Vite + React 19 + Tailwind v4 + GSAP 3 (ScrollTrigger, SplitText, CustomEase) + Lenis.

```bash
npm install
npm run dev      # développement
npm run build    # production : build + pré-rendu HTML de chaque page + sitemap.xml / robots.txt → dist/
```

Le dossier `dist/` est un site statique : à héberger en HTTPS (Netlify, Vercel, Cloudflare Pages, nginx…)
avec compression gzip/brotli. `/services/<slug>` → `services/<slug>/index.html`, pages inconnues → `404.html`.

SEO : voir `docs/SEO-PLAN.md` (fait / à faire). Le domaine final se règle dans `site.url` (`src/data/site.js`).

## Où modifier quoi
- `src/data/site.js` — nom, téléphone, WhatsApp, SIRET, commune de rattachement, services, flotte, avis, FAQ.
- `src/data/seo.js` — titres, descriptions, textes SEO par page et données structurées (JSON-LD).
- `public/images/` — photos Unsplash (licence libre) en WebP, en 3–4 tailles (640 / 1080 / 1600 / 2000 px).
  Pour ajouter ou changer une photo : l’ajouter dans `scripts/images.py`, puis `python scripts/images.py`
  (régénère les tailles et `src/data/images.json`, utilisé par `src/lib/img.js` pour le `srcset`).
- `src/components/BookingModal.jsx` — le panneau de réservation qui naît du bouton cliqué (même chorégraphie que le projet ilhem).
- `src/components/booking/steps.jsx` — étapes, champs et validation des deux parcours (course privée / transport médical CPAM).
- `src/lib/api.js` — **stub** d’envoi ; à remplacer par l’appel au backend (`POST /api/bookings`).
- `src/transition/PageTransition.jsx` — transition entre pages.

## Prochaine étape : backend
Le modal envoie l’objet `form` complet (voir `emptyForm` dans `steps.jsx`) ; `toPayload()` dans `api.js` le prépare
(le bon de transport est un `File` à envoyer en multipart).
