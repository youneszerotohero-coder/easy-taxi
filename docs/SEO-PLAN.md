# SEO plan — Easy Taxi du Beauvaisis

Goal: rank in the top 3 (map pack + organic) on Google for the client's keywords:
**Taxi Beauvais · Taxi gare Beauvais · Taxi aéroport Beauvais · Ambulance Beauvais · Ambulance Oise**
(+ "taxi conventionné beauvais / oise" as a bonus), capturing the two "ambulance" searches honestly (see §5).

> Nobody can guarantee a #1 position on Google. What we control: a technically perfect, fast site with one strong page per keyword + a blog (done), then the Google Business Profile, reviews and citations below (the client's part, and the biggest lever).

### Keyword → page map

| Keyword | Main page (title starts with the keyword) | Supporting blog article(s) |
|---|---|---|
| Taxi Beauvais | `/` (home) | `/blog/taxi-beauvais-reserver-prix-disponibilite` |
| Taxi gare Beauvais | `/services/taxi-gare-beauvais` | `/blog/taxi-gare-de-beauvais` |
| Taxi aéroport Beauvais | `/services/taxi-aeroport-beauvais-tille-bva` | `/blog/taxi-aeroport-beauvais-tille-guide` |
| Ambulance Beauvais | `/services/taxi-conventionne-ou-ambulance-beauvais` | `/blog/ambulance-beauvais-ou-taxi-conventionne` |
| Ambulance Oise | `/services/taxi-conventionne-ou-ambulance-beauvais` | `/blog/ambulance-oise-transport-medical-guide` |
| Taxi conventionné Beauvais / Oise | `/services/taxi-conventionne-beauvais` | `/blog/transport-conventionne-cpam-prise-en-charge` |

Each article links to its service page(s) and each service page lists its articles ("Guides utiles") — the internal links tell Google which page is the authority for each keyword. Don't create a second page targeting the same keyword (they would compete).

For a local taxi, ranking comes from three things, in this order of weight:
1. **Google Business Profile** (map pack — where most "taxi beauvais" clicks go)
2. **Reviews + local citations** (trust & consistency of name / phone / area across the web)
3. **The website** (relevance of each page for each search + technical quality)

---

## 1. Already done in the website (technical & on-page)

| Item | Where |
|---|---|
| **Pre-rendered HTML** for every page (crawlers see full content without JavaScript) | `scripts/prerender.mjs`, `src/entry-server.jsx` |
| Unique `<title>` + meta description per page, written for its keyword | `src/data/seo.js` |
| Canonical URLs, Open Graph (link previews on WhatsApp / Facebook), `robots` | `src/lib/head.js` |
| **Structured data (JSON-LD)**: `LocalBusiness` + `TaxiService` (phone, 24/7 hours, area served, SIRET, Rainvillers), `Service` + `BreadcrumbList` per page, `FAQPage` on the home | `src/data/seo.js` |
| `sitemap.xml` (23 URLs) and `robots.txt`, generated at build | `dist/` |
| **Blog** `/blog` + 6 keyword articles (600–900 words each, `BlogPosting` + breadcrumb structured data, `og:type=article`), latest 3 on the home page | `src/data/blog.js`, `src/pages/Blog*.jsx` |
| One page per intent: home = "taxi beauvais", `/services/taxi-gare-beauvais`, `/services/taxi-aeroport-beauvais-tille-bva`, `/services/taxi-conventionne-beauvais`, `/services/taxi-conventionne-ou-ambulance-beauvais`, + 11 other service pages | `src/data/site.js` |
| Each service page: H1 = the search, ~150 words of local copy, breadcrumb, links to related services | `src/pages/ServicePage.jsx` |
| Home H1 contains "Taxi Beauvais & Oise · Conventionné CPAM · 24h/24" | `src/sections/Hero.jsx` |
| Mandatory mentions visible: commune de rattachement **Rainvillers (60155)**, **SIRET 825 360 456 00024** | footer |
| Core Web Vitals: LCP ≈ 1 s desktop / ≈ 2 s on throttled 4G phone, CLS 0, responsive images, preloaded fonts | — |

**Before going live (blocking):**
- [ ] Put the final domain in `site.url` (`src/data/site.js`) — it's used for canonicals, sitemap and structured data. Rebuild.
- [ ] Host on HTTPS, with **gzip/brotli** and long cache headers for `/assets/*` and `/images/*` (Netlify, Vercel, Cloudflare Pages or nginx all do this). The host must serve `services/<slug>/index.html` for `/services/<slug>` (default on those hosts) and `404.html` for unknown URLs.
- [ ] Redirect `http://` → `https://` and `www`/non-`www` to one version (the one in `site.url`).
- [ ] Add a **Mentions légales** page (legal obligation in France: company name, owner, address, SIRET, host) and a **privacy policy** (the form collects health data: social security number, prescription). Send me the missing details (owner name, postal address, host) and I'll add both pages.
- [ ] Confirm every claim on the site is true for this business: *conventionné CPAM*, *24h/24 7j/7*, *siège enfant*, the stats (12k+ courses, 4.9★) and the 4 reviews (placeholders — replace with real Google reviews or remove).

---

## 2. Google Business Profile — the #1 lever (do this first)

1. Create / claim the profile at business.google.com with **exactly** the same name, phone and website as the site:
   - Name: **Easy Taxi du Beauvaisis** (no keyword stuffing — Google penalises it)
   - Phone: **07 59 93 05 80** · Website: the final domain
2. Category: **primary "Service de taxi"**; secondary: "Service de transport médical", "Service de navette aéroport".
3. Business type: **service-area business** (hide the home address), service area: Beauvais, Rainvillers, Allonne, Goincourt, Tillé, Beauvais agglomeration, Oise, + Amiens, Paris airports if relevant.
4. Hours: open 24 hours, every day (only if true).
5. Services: add each service from the site with a short description (same wording as the pages).
6. Photos: the real car (outside + inside), the driver with the car, the taxi sign, 10+ photos to start, then 1–2 per month.
7. Posts: one Google Post per week (airport tips, CPAM reminders, availability on holidays…).
8. Q&A: add the FAQ questions/answers from the site.
9. Enable messaging / WhatsApp link.

## 3. Reviews (drives map-pack ranking and conversions)

- Target: **30+ Google reviews in 3 months**, then a steady flow (2–4 per week).
- Send the review link (from Business Profile → "Ask for reviews") by **SMS/WhatsApp after each ride**. A small card in the car with a QR code works well.
- Answer **every** review within 48h (thank, mention the service: "merci pour votre trajet vers l'aéroport de Beauvais-Tillé").
- Never buy or write reviews (illegal in France — DGCCRF — and Google removes them).
- Once there are real reviews, I can show them on the site in place of the placeholders (and in the structured data with `aggregateRating`).

## 4. Local citations (same Name / Address / Phone everywhere)

List the business, with **identical** name, phone and website, on:
- PagesJaunes, Mappy, Bing Places, Apple Business Connect (Apple Maps), Waze, Yelp, Hoodspot, Cylex, 118712
- Facebook page + Instagram (link to the site; post photos)
- Taxi directories: taxi-france, allotaxi, les annuaires de taxis conventionnés
- **Ameli**: check that the business appears in the CPAM list of conventionné taxis for the Oise (patients and hospitals use it)
- Local partners: Beauvais tourist office, hotels near the airport and the station, dialysis/oncology centres, retirement homes — a link from their site is worth a lot

## 5. "Ambulance Beauvais / Oise" — how to rank without misleading

A taxi conventionné **must not present itself as an ambulance** (regulated activity; misleading advertising). The site targets these searches honestly:
- Page `/services/taxi-conventionne-ou-ambulance-beauvais`: explains ambulance vs VSL vs taxi conventionné, and that patients who can travel seated are covered by the CPAM in a taxi conventionné.
- FAQ "Êtes-vous une ambulance ?" (also in the FAQPage structured data).
- **Do not** put "ambulance" in the Business Profile name or categories.

## 6. Content plan (months 1–6)

Add pages for searches with clear intent (each ~400–600 words, real local info, a booking button):

| Priority | Page / article | Target searches |
|---|---|---|
| High | Zone pages: Taxi Creil, Taxi Compiègne, Taxi Méru, Taxi Noailles, Taxi Clermont, Taxi Rainvillers | "taxi creil", "taxi compiègne"… |
| High | Prix d'un taxi Beauvais → aéroport / gare / Paris (price ranges, how it's calculated) | "prix taxi beauvais", "tarif taxi aéroport beauvais" |
| High | Comment obtenir un transport conventionné CPAM (bon de transport, ALD, démarches) | "taxi conventionné comment faire", "prise en charge transport cpam" |
| ✅ Done | Gare, aéroport, ambulance vs taxi conventionné, ambulance Oise, CPAM, réserver un taxi à Beauvais | the 5 main keywords (see map above) |
| Medium | Aéroport de Beauvais-Tillé : comment s'y rendre tôt le matin / la nuit | "aéroport beauvais navette nuit" |
| Medium | Taxi de nuit à Beauvais / taxi dimanche et jours fériés | "taxi beauvais nuit", "taxi beauvais dimanche" |
| Medium | Beauvais → Disneyland / Paris : temps de trajet, prix, conseils | "taxi beauvais disneyland", "taxi beauvais paris" |

New article: add an entry to `src/data/blog.js` (slug, title, metaTitle, description, body, related `services`) → page, structured data and sitemap are generated at build. Aim for **1–2 articles per month**: freshness and steady growth help.

Each new service/zone page: added to `src/data/site.js` + `src/data/seo.js` → it automatically gets its title, description, structured data and sitemap entry at build.

## 7. Measure & iterate

- **Google Search Console**: verify the domain, submit `sitemap.xml`, check indexing of the 16 pages, watch queries/positions monthly.
- **Google Business Profile insights**: calls, direction requests, website clicks.
- Optionally Plausible / Matomo (privacy-friendly analytics, no cookie banner needed) to count booking-form submissions.
- Monthly: check positions for the 5 main keywords; reinforce the pages that are on page 2 (more content, more internal links, more reviews mentioning the place).

## 8. Timeline

| When | Actions |
|---|---|
| Week 1 | Final domain + HTTPS hosting, legal pages, Search Console + sitemap, Google Business Profile created & verified |
| Weeks 2–4 | Citations (§4), first 10–15 reviews, Business Profile photos & posts, real reviews on the site |
| Months 2–3 | Zone pages + price page + CPAM guide, partner links, 30+ reviews |
| Months 4–6 | Remaining articles, keep reviews and posts flowing, review positions & adjust |

Realistic expectation: map-pack visibility for "taxi beauvais" usually moves within **4–8 weeks** of a complete, verified Business Profile with steady reviews; organic positions for competitive terms take **3–6 months**.
