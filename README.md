# Easy Taxi — site vitrine & réservation

Vite + React 19 + Tailwind v4 + GSAP 3 (ScrollTrigger, SplitText, CustomEase) + Lenis.

```bash
npm install
npm run dev
```

## Où modifier quoi
- `src/data/site.js` — nom, téléphone, e-mail, WhatsApp, services, flotte, avis, FAQ (**placeholders à remplacer**).
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
