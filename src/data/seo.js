import { faq, services, serviceBySlug, site } from './site'
import { postBySlug, posts } from './blog'

/*
  Search-engine content and metadata.
  - Every page gets its own <title> (~60 chars) and meta description (~155 chars) built around the searches it targets.
  - Each service page gets two paragraphs of real, local copy (rendered on the page, not hidden).
  - JSON-LD structured data: LocalBusiness/TaxiService for the company, Service + BreadcrumbList per page, FAQPage on home.
  Used both by the pre-renderer (static HTML for crawlers) and on the client when navigating.
*/

const BRAND = site.name

export const HOME = {
  title: `Taxi Beauvais 24h/24 — Gare, aéroport, conventionné CPAM | ${BRAND}`,
  description:
    'Taxi Beauvais 24h/24 : taxi gare de Beauvais, taxi aéroport Beauvais-Tillé, transport médical conventionné CPAM dans l’Oise, Roissy, Orly. Réservation en ligne ou au 07 59 93 05 80.',
}

// Per-service SEO copy (keyed by slug)
export const serviceSeo = {
  'taxi-conventionne-beauvais': {
    title: `Taxi conventionné Beauvais — Transport CPAM 24h/24 | ${BRAND}`,
    description: 'Taxi conventionné CPAM à Beauvais et dans l’Oise : consultations, dialyse, chimiothérapie, hospitalisation. Tiers payant, démarches gérées. Réservez en ligne.',
    about: [
      'Easy Taxi du Beauvaisis est un taxi conventionné par l’Assurance Maladie. Sur prescription médicale de transport, vos trajets vers l’hôpital, la clinique, le cabinet de radiologie ou le centre de soins sont pris en charge par votre caisse (CPAM, MSA, MGEN, SSI…), le plus souvent sans avance de frais lorsque vous êtes en ALD ou en hospitalisation.',
      'Nous venons vous chercher à domicile à Beauvais, Rainvillers, Allonne, Goincourt, Tillé et dans toutes les communes du Beauvaisis, puis nous vous attendons ou revenons vous chercher à l’heure convenue. Nous transmettons la facture et l’ordonnance à votre caisse : vous n’avez rien à gérer.',
    ],
  },
  'taxi-hopital-beauvais': {
    title: `Taxi hôpital de Beauvais — Trajets conventionnés | ${BRAND}`,
    description: 'Taxi pour le Centre Hospitalier de Beauvais : prise en charge CPAM, départ de votre domicile, attente sur place, 24h/24. Dialyse, chimio, consultations.',
    about: [
      'Pour vos rendez-vous au Centre Hospitalier de Beauvais, nous vous prenons en charge devant chez vous et vous déposons au bon service, avec une aide à la marche si besoin. Le trajet est remboursé par l’Assurance Maladie sur prescription médicale.',
      'Séances régulières, consultations, examens ou sorties d’hospitalisation : nous organisons les allers et retours à heure fixe et adaptons l’horaire en cas de retard du service.',
    ],
  },
  'taxi-hopital-amiens': {
    title: `Taxi CHU Amiens depuis Beauvais — Conventionné | ${BRAND}`,
    description: 'Transport conventionné vers le CHU Amiens-Picardie depuis Beauvais et l’Oise. Forfait confirmé à la réservation, attente incluse, prise en charge CPAM.',
    about: [
      'Le CHU Amiens-Picardie accueille de nombreux patients de l’Oise pour des consultations spécialisées et des traitements. Nous assurons le trajet depuis Beauvais et tout le département, avec un forfait annoncé à la réservation et le temps d’attente sur place compris.',
      'Le transport est pris en charge par l’Assurance Maladie sur prescription médicale ; nous gérons la facturation directement avec votre caisse.',
    ],
  },
  'taxi-dialyse-oise': {
    title: `Taxi dialyse Oise — Transport conventionné régulier | ${BRAND}`,
    description: 'Taxi conventionné pour vos séances de dialyse dans l’Oise : planning récurrent, chauffeur attitré, retour dès la fin de la séance. Prise en charge CPAM (ALD).',
    about: [
      'Les séances de dialyse reviennent plusieurs fois par semaine : nous mettons en place un planning fixe avec un chauffeur qui connaît vos horaires, votre adresse et vos besoins.',
      'Le transport est pris en charge à 100 % par l’Assurance Maladie dans le cadre d’une ALD, sur prescription. Nous vous ramenons chez vous dès la fin de la séance.',
    ],
  },
  'taxi-chimiotherapie-oise': {
    title: `Taxi chimiothérapie Oise — Transport conventionné | ${BRAND}`,
    description: 'Taxi conventionné pour la chimiothérapie et la radiothérapie dans l’Oise : conduite douce, attente ou retour programmé, accompagnement. Prise en charge CPAM.',
    about: [
      'Les traitements de chimiothérapie et de radiothérapie fatiguent : nous adaptons la conduite, la température du véhicule et le rythme du trajet, et nous vous accompagnons jusqu’au service.',
      'Selon la durée de la séance, le chauffeur vous attend sur place ou revient vous chercher à l’heure prévue. Le transport est pris en charge par l’Assurance Maladie sur prescription.',
    ],
  },
  'taxi-conventionne-beauvais-paris': {
    title: `Taxi conventionné Beauvais – Paris — Hôpitaux AP-HP | ${BRAND}`,
    description: 'Taxi conventionné de Beauvais vers les hôpitaux de Paris et d’Île-de-France (AP-HP, cliniques, centres spécialisés). Prise en charge CPAM, attente sur place.',
    about: [
      'Pour un rendez-vous dans un hôpital parisien ou un centre spécialisé d’Île-de-France, nous partons de Beauvais ou de votre commune avec une marge suffisante pour arriver à l’heure, quel que soit le trafic.',
      'Le trajet est pris en charge par l’Assurance Maladie sur prescription médicale ; le chauffeur vous attend sur place ou revient vous chercher.',
    ],
  },
  'taxi-conventionne-ou-ambulance-beauvais': {
    title: `Ambulance Beauvais ou taxi conventionné ? Transport assis CPAM | ${BRAND}`,
    description: 'Ambulance à Beauvais ou dans l’Oise ? Si vous pouvez voyager assis, le taxi conventionné est pris en charge par la CPAM comme le VSL. Réservation 24h/24.',
    about: [
      'Ambulance, véhicule sanitaire léger (VSL) ou taxi conventionné : c’est votre médecin qui choisit le mode de transport sur la prescription, selon votre état de santé. L’ambulance est réservée aux patients qui doivent voyager allongés ou sous surveillance. Si vous pouvez voyager assis, le taxi conventionné est le transport adapté — et il est pris en charge par l’Assurance Maladie dans les mêmes conditions.',
      'Easy Taxi du Beauvaisis n’est pas une ambulance : nous réalisons du transport assis professionnalisé en taxi conventionné, à Beauvais et dans toute l’Oise. Si votre prescription indique une ambulance, nous vous orientons vers un service ambulancier.',
    ],
  },
  'taxi-aeroport-beauvais-tille-bva': {
    title: `Taxi aéroport Beauvais-Tillé (BVA) 24h/24 — Suivi de vol | ${BRAND}`,
    description: 'Taxi pour l’aéroport de Beauvais-Tillé : suivi de votre vol, accueil à l’arrivée, prix annoncé à la réservation. Départs très tôt et arrivées tardives.',
    about: [
      'L’aéroport de Beauvais-Tillé est desservi par de nombreux vols très tôt le matin et tard le soir : nous sommes disponibles 24h/24 pour vous y conduire ou venir vous chercher, depuis Beauvais, l’Oise, Amiens ou Paris.',
      'Indiquez votre numéro de vol à la réservation : nous suivons l’horaire en temps réel et adaptons l’heure de prise en charge en cas de retard, sans supplément.',
    ],
  },
  'taxi-aeroport-roissy-cdg': {
    title: `Taxi Beauvais – Roissy-CDG — Transfert aéroport | ${BRAND}`,
    description: 'Transfert en taxi entre Beauvais, l’Oise et l’aéroport Roissy-Charles-de-Gaulle (tous terminaux). Suivi de vol, bagages, tarif annoncé à l’avance.',
    about: [
      'Nous assurons vos transferts entre Beauvais, l’Oise et l’aéroport Paris-Charles-de-Gaulle, tous terminaux. Le départ est calculé selon l’heure de votre vol et le trafic sur l’A16 et la Francilienne.',
      'Au retour, nous suivons votre vol et vous attendons en zone d’arrivée. Le tarif est communiqué sur devis avant la course.',
    ],
  },
  'taxi-aeroport-orly': {
    title: `Taxi Beauvais – Orly — Transfert aéroport | ${BRAND}`,
    description: 'Taxi entre Beauvais, l’Oise et l’aéroport Paris-Orly : départ calculé selon votre vol, suivi en temps réel, devis sur demande avant la course.',
    about: [
      'Orly est plus loin de l’Oise que Roissy : nous calculons l’heure de départ avec une marge confortable pour votre enregistrement, en tenant compte du trafic francilien.',
      'Retour programmé à l’atterrissage, suivi du vol en temps réel et devis communiqué avant la course.',
    ],
  },
  'taxi-disneyland-paris': {
    title: `Taxi Beauvais – Disneyland Paris | ${BRAND}`,
    description: 'Taxi de Beauvais ou de l’aéroport vers Disneyland Paris et ses hôtels. Siège enfant sur demande, grand coffre, retour à l’heure qui vous arrange.',
    about: [
      'Partez en famille de chez vous ou de l’aéroport de Beauvais-Tillé jusqu’aux portes du parc Disneyland Paris ou de votre hôtel, sans changement de train ni navette.',
      'Sièges et rehausseurs enfants sur demande, coffre pour les valises de la famille, et retour programmé à l’heure qui vous convient.',
    ],
  },
  'taxi-gare-beauvais': {
    title: `Taxi gare Beauvais — Gare SNCF, 24h/24, réservation en ligne | ${BRAND}`,
    description: 'Taxi à la gare SNCF de Beauvais : prise en charge à l’arrivée de votre train, dépose à l’heure pour vos départs, correspondance aéroport. 24h/24.',
    about: [
      'Vous arrivez en train à Beauvais ? Réservez votre taxi à l’avance : le chauffeur vous attend à la sortie de la gare, même si le train a du retard, et vous conduit à votre domicile, à votre hôtel, à l’hôpital ou à l’aéroport de Beauvais-Tillé.',
      'Pour un départ, nous vous déposons devant la gare avec une marge confortable. Paiement par carte bancaire à bord, en espèces ou par virement pour les entreprises.',
    ],
  },
  'transport-prive-oise': {
    title: `Taxi privé Beauvais & Oise — Courses 24h/24 | ${BRAND}`,
    description: 'Taxi privé à Beauvais et dans l’Oise : gares, sorties, rendez-vous, événements. Berline climatisée, chauffeur professionnel, réservation immédiate ou à l’avance.',
    about: [
      'Pour un rendez-vous, une sortie, un événement ou un trajet du quotidien, nous circulons à Beauvais et dans toute l’Oise : Creil, Compiègne, Méru, Noailles, Clermont, Montataire, Nogent-sur-Oise et les communes voisines.',
      'Berline climatisée jusqu’à 4 passagers, chauffeur titulaire de la carte professionnelle, prix annoncé avant la course.',
    ],
  },
  'transport-longue-distance': {
    title: `Taxi longue distance depuis Beauvais — Sur devis | ${BRAND}`,
    description: 'Taxi longue distance au départ de Beauvais et de l’Oise vers Paris, Lille, Rouen, Amiens et toute la France. Devis transparent, pauses à la demande.',
    about: [
      'Paris, Lille, Rouen, Amiens ou plus loin : nous réalisons vos trajets longue distance au départ de Beauvais et de l’Oise, en aller simple ou aller-retour.',
      'Le prix est fixé sur devis avant le départ, sans surprise. Pauses à la demande et véhicule climatisé pour un trajet confortable.',
    ],
  },
  'mise-a-disposition-chauffeur': {
    title: `Chauffeur à disposition à Beauvais — Événements | ${BRAND}`,
    description: 'Mise à disposition d’un chauffeur et de son véhicule à Beauvais et dans l’Oise : soirées, mariages, séminaires, rendez-vous d’affaires. À l’heure ou à la journée.',
    about: [
      'Pour un mariage, une soirée, un séminaire ou une journée de rendez-vous, un chauffeur reste à votre disposition avec son véhicule et vous conduit d’un lieu à l’autre.',
      'Facturation à l’heure ou à la journée, facture entreprise et paiement par virement SEPA possibles.',
    ],
  },
}

/* ──────────────────────────── structured data ──────────────────────────── */

export const businessJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'TaxiService'],
  '@id': `${site.url}/#business`,
  name: BRAND,
  url: site.url,
  telephone: site.phoneIntl.replace(/\s/g, ''),
  email: site.email,
  image: `${site.url}/images/hero-luxury-car-1080.webp`,
  logo: `${site.url}/favicon.svg`,
  priceRange: '€€',
  identifier: { '@type': 'PropertyValue', propertyID: 'SIRET', value: site.siret.replace(/\s/g, '') },
  address: { '@type': 'PostalAddress', addressLocality: site.commune, postalCode: '60155', addressRegion: 'Hauts-de-France', addressCountry: 'FR' },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '00:00',
    closes: '23:59',
  },
  areaServed: ['Beauvais', 'Oise', 'Rainvillers', 'Creil', 'Compiègne', 'Méru', 'Noailles', 'Clermont', 'Amiens', 'Paris'].map((name) => ({ '@type': 'City', name })),
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Services de taxi',
    itemListElement: services.map((s) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.title, url: `${site.url}/services/${s.slug}` } })),
  },
})

const faqJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
})

const serviceJsonLd = (s) => [
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: s.title,
    name: s.title,
    description: s.lead,
    provider: { '@id': `${site.url}/#business` },
    areaServed: { '@type': 'AdministrativeArea', name: 'Oise' },
    url: `${site.url}/services/${s.slug}`,
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: `${site.url}/` },
      { '@type': 'ListItem', position: 2, name: 'Services', item: `${site.url}/#services` },
      { '@type': 'ListItem', position: 3, name: s.title, item: `${site.url}/services/${s.slug}` },
    ],
  },
]

const breadcrumbs = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: `${site.url}${path}` })),
})

const postJsonLd = (p) => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: p.title,
  description: p.description,
  image: `${site.url}${p.image.replace(/\.webp$/, '-1080.webp')}`,
  datePublished: p.date,
  dateModified: p.updated ?? p.date,
  inLanguage: 'fr-FR',
  keywords: p.category,
  author: { '@type': 'Organization', name: BRAND, url: site.url },
  publisher: { '@id': `${site.url}/#business` },
  mainEntityOfPage: `${site.url}/blog/${p.slug}`,
})

/** Everything the <head> needs for a path */
export function getSeo(pathname) {
  const path = pathname.replace(/\/+$/, '') || '/'
  if (path === '/') {
    return { ...HOME, canonical: `${site.url}/`, image: `${site.url}/images/hero-luxury-car-1080.webp`, jsonLd: [businessJsonLd(), faqJsonLd()] }
  }
  const slug = path.match(/^\/services\/([^/]+)$/)?.[1]
  const s = slug && serviceBySlug(slug)
  if (s) {
    const seo = serviceSeo[s.slug] ?? {}
    return {
      title: seo.title ?? `${s.title} | ${BRAND}`,
      description: seo.description ?? s.lead,
      canonical: `${site.url}/services/${s.slug}`,
      image: `${site.url}${s.image.replace(/\.webp$/, '-1080.webp')}`,
      jsonLd: [businessJsonLd(), ...serviceJsonLd(s)],
    }
  }
  if (path === '/blog') {
    return {
      title: `Blog taxi Beauvais — Conseils gare, aéroport, transport médical | ${BRAND}`,
      description: 'Guides pratiques : taxi à Beauvais, gare SNCF, aéroport Beauvais-Tillé, ambulance ou taxi conventionné, prise en charge CPAM dans l’Oise.',
      canonical: `${site.url}/blog`,
      image: `${site.url}${posts[0].image.replace(/\.webp$/, '-1080.webp')}`,
      jsonLd: [businessJsonLd(), breadcrumbs([['Accueil', '/'], ['Blog', '/blog']])],
    }
  }
  const postSlug = path.match(/^\/blog\/([^/]+)$/)?.[1]
  const p = postSlug && postBySlug(postSlug)
  if (p) {
    return {
      title: `${p.metaTitle} | ${BRAND}`,
      description: p.description,
      canonical: `${site.url}/blog/${p.slug}`,
      image: `${site.url}${p.image.replace(/\.webp$/, '-1080.webp')}`,
      type: 'article',
      jsonLd: [postJsonLd(p), breadcrumbs([['Accueil', '/'], ['Blog', '/blog'], [p.category, `/blog/${p.slug}`]])],
    }
  }
  return { title: `Page introuvable | ${BRAND}`, description: HOME.description, canonical: null, noindex: true, jsonLd: [] }
}

export const allRoutes = () => ['/', ...services.map((s) => `/services/${s.slug}`), '/blog', ...posts.map((p) => `/blog/${p.slug}`)]
