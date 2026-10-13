// Single source of truth for the brand — swap these when the client confirms their details.
export const site = {
  name: 'Easy Taxi',
  short: 'Easy Taxi',
  tagline: 'Taxi Beauvais & Oise',
  phone: '+33 6 00 00 00 00',
  phoneHref: 'tel:+33600000000',
  whatsapp: 'https://wa.me/33600000000',
  email: 'contact@easytaxi.fr',
  city: 'Beauvais, Oise (60)',
  hours: '24h/24 · 7j/7 · jours fériés inclus',
}

const img = (name) => `/images/${name}.webp`

// Same catalogue as the client's current site (taxieasytransport60.fr) — slugs mirror its URLs.
export const serviceCategories = [
  { key: 'medical', label: 'Médical' },
  { key: 'airports', label: 'Aéroports & loisirs' },
  { key: 'other', label: 'Autres services' },
]

const catalogue = [
  /* ───────── Médical ───────── */
  {
    slug: 'taxi-conventionne-beauvais',
    category: 'medical',
    kind: 'medical',
    title: 'Taxi conventionné Beauvais',
    card: 'Transport conventionné CPAM',
    short: 'Conventionné CPAM',
    lead: 'Transport assis professionnalisé pris en charge par l’Assurance Maladie, selon votre éligibilité. Nous nous occupons des démarches administratives à votre place.',
    image: img('care-nurse'),
    gallery: [img('hospital-building'), img('care-walker'), img('hospital-lobby')],
    points: [
      'Agréé CPAM — tiers payant selon votre situation (ALD, hospitalisation…)',
      'Démarches et transmission de l’ordonnance médicale gérées pour vous',
      'Prise en charge à domicile, attente sur place',
      'CPAM, MSA, MGEN, SSI et autres caisses',
    ],
    places: ['CH Beauvais', 'CHU Amiens-Picardie', 'CHU Rouen Charles-Nicolle', 'AP-HP Paris'],
  },
  {
    slug: 'taxi-hopital-beauvais',
    category: 'medical',
    kind: 'medical',
    title: 'Taxi Hôpital Beauvais',
    short: 'CH Beauvais',
    lead: 'Vos trajets vers le Centre Hospitalier de Beauvais avec prise en charge CPAM : départ depuis votre porte, 24h/24, y compris pour les séances régulières.',
    image: img('hospital-building'),
    gallery: [img('hospital-lobby'), img('care-nurse'), img('rear-seats')],
    points: [
      'Prise en charge CPAM du domicile jusqu’au service',
      'Disponible 24h/24 et 7j/7',
      'Trajets réguliers : dialyse, chimiothérapie, consultations',
      'Aide à la marche et accompagnement fauteuil',
    ],
    places: ['CH Beauvais', 'Cliniques de Beauvais', 'Centres de radiologie', 'Laboratoires'],
  },
  {
    slug: 'taxi-hopital-amiens',
    category: 'medical',
    kind: 'medical',
    title: 'Taxi CHU Amiens',
    short: 'CHU Amiens-Picardie',
    lead: 'Transport conventionné vers le CHU Amiens-Picardie depuis Beauvais et toute l’Oise. Le forfait est confirmé à la réservation, temps d’attente compris.',
    image: img('hospital-lobby'),
    gallery: [img('hospital-building'), img('highway-dusk'), img('care-caregiver')],
    points: [
      'Forfait confirmé dès la réservation',
      'Temps d’attente sur place inclus',
      'Prise en charge CPAM selon éligibilité',
      'Départ de Beauvais et de toutes les communes de l’Oise',
    ],
    places: ['CHU Amiens-Picardie', 'Cliniques d’Amiens', 'Centres spécialisés', 'Amiens (80000)'],
  },
  {
    slug: 'taxi-dialyse-oise',
    category: 'medical',
    kind: 'medical',
    title: 'Taxi dialyse Oise',
    short: 'Séances de dialyse',
    lead: 'Plusieurs séances par semaine, à heure fixe : un chauffeur ponctuel qui connaît vos horaires et vous ramène dès la fin du traitement.',
    image: img('care-caregiver'),
    gallery: [img('care-nurse'), img('hospital-building'), img('rear-seats')],
    points: [
      'Planning récurrent organisé à l’avance',
      'Chauffeur attitré, horaires respectés',
      'Retour à domicile dès la fin de la séance',
      'Prise en charge CPAM (ALD)',
    ],
    places: ['Centres de dialyse de l’Oise', 'CH Beauvais', 'CHU Amiens-Picardie', 'Compiègne'],
  },
  {
    slug: 'taxi-chimiotherapie-oise',
    category: 'medical',
    kind: 'medical',
    title: 'Taxi chimiothérapie Oise',
    short: 'Chimio & radiothérapie',
    lead: 'Un trajet calme et confortable vers vos séances de chimiothérapie ou de radiothérapie, avec un chauffeur attentif à votre fatigue.',
    image: img('care-walker'),
    gallery: [img('care-nurse'), img('hospital-lobby'), img('rear-seats')],
    points: [
      'Véhicule climatisé et conduite en douceur',
      'Attente pendant la séance ou retour programmé',
      'Accompagnement jusqu’au service',
      'Prise en charge CPAM (ALD)',
    ],
    places: ['CH Beauvais', 'CHU Amiens-Picardie', 'CHU Rouen Charles-Nicolle', 'Centres de radiothérapie'],
  },
  {
    slug: 'taxi-conventionne-beauvais-paris',
    category: 'medical',
    kind: 'medical',
    title: 'Taxi conventionné Beauvais Paris',
    short: 'Hôpitaux parisiens',
    lead: 'Rendez-vous dans un hôpital parisien ou un centre spécialisé d’Île-de-France ? Nous vous y conduisons depuis l’Oise, avec la prise en charge CPAM.',
    image: img('paris-champs'),
    gallery: [img('highway-night'), img('hospital-lobby'), img('driver-hands')],
    points: [
      'Hôpitaux de l’AP-HP, cliniques et centres spécialisés',
      'Horaire anticipé pour arriver à l’heure',
      'Attente sur place ou retour programmé',
      'Prise en charge CPAM selon éligibilité',
    ],
    places: ['AP-HP Paris', 'Cliniques parisiennes', 'Centres spécialisés', 'Île-de-France'],
  },

  /* ───────── Aéroports & loisirs ───────── */
  {
    slug: 'taxi-aeroport-beauvais-tille-bva',
    category: 'airports',
    kind: 'private',
    title: 'Aéroport Beauvais-Tillé (BVA)',
    short: 'Aéroport BVA',
    lead: 'Navettes vers et depuis l’aéroport de Beauvais-Tillé, avec suivi de vos horaires de vol : on vous attend même si l’avion a du retard.',
    image: img('airport-plane'),
    gallery: [img('airport-silhouettes'), img('luggage-chauffeur'), img('van-headlights')],
    points: [
      'Suivi des horaires de vol en temps réel',
      'Accueil en zone d’arrivée',
      'Véhicules spacieux pour les bagages',
      'Tarif annoncé avant le départ',
    ],
    places: ['Beauvais-Tillé (BVA)', 'Gare de Beauvais', 'Paris', 'Amiens'],
  },
  {
    slug: 'taxi-aeroport-roissy-cdg',
    category: 'airports',
    kind: 'private',
    title: 'Aéroport Roissy-CDG',
    card: 'Transferts aéroports',
    short: 'BVA · CDG · Orly',
    lead: 'Transferts vers Roissy-Charles-de-Gaulle, Beauvais-Tillé et Orly, avec suivi des vols en temps réel et des véhicules spacieux pour tous vos bagages.',
    image: img('airport-traveller'),
    gallery: [img('airport-plane'), img('airport-silhouettes'), img('luggage-couple')],
    points: [
      'Suivi des vols en temps réel',
      'Tous les terminaux de Roissy-CDG',
      'Jusqu’à 8 passagers et leurs bagages',
      'Tarif sur devis, sans surprise',
    ],
    places: ['Roissy-CDG', 'Beauvais-Tillé (BVA)', 'Paris-Orly', 'Gare du Nord'],
  },
  {
    slug: 'taxi-aeroport-orly',
    category: 'airports',
    kind: 'private',
    title: 'Aéroport Paris-Orly',
    short: 'Aéroport Orly',
    lead: 'De l’Oise à Paris-Orly en toute sérénité : départ calculé selon l’heure de votre vol et le trafic, devis sur demande.',
    image: img('airport-sunset'),
    gallery: [img('airport-traveller'), img('highway-dusk'), img('luggage-chauffeur')],
    points: [
      'Départ calculé selon votre vol et le trafic',
      'Tous les terminaux d’Orly',
      'Retour programmé à l’atterrissage',
      'Devis sur demande',
    ],
    places: ['Paris-Orly', 'Roissy-CDG', 'Beauvais-Tillé (BVA)', 'Paris'],
  },
  {
    slug: 'taxi-disneyland-paris',
    category: 'airports',
    kind: 'private',
    title: 'Disneyland Paris',
    short: 'Famille & loisirs',
    lead: 'De chez vous ou de l’aéroport jusqu’aux portes du parc : sièges enfants sur demande et un grand coffre pour les valises de toute la famille.',
    image: img('disneyland-paris'),
    gallery: [img('luggage-couple'), img('rear-seats'), img('van-headlights')],
    points: [
      'Van jusqu’à 8 places pour les familles',
      'Sièges et rehausseurs enfants',
      'Dépose aux hôtels du resort',
      'Retour à l’heure qui vous arrange',
    ],
    places: ['Disneyland Paris', 'Hôtels Disney', 'Val d’Europe', 'Marne-la-Vallée'],
  },

  /* ───────── Autres services ───────── */
  {
    slug: 'transport-prive-oise',
    category: 'other',
    kind: 'private',
    title: 'Transport privé Oise',
    card: 'Transport privé',
    short: 'Gares, sorties, événements',
    lead: 'Vos trajets au départ ou à destination de Beauvais : gares, aéroports, sorties, événements. Des véhicules de 4 à 8 places et un chauffeur professionnel et ponctuel.',
    image: img('chauffeur-van'),
    gallery: [img('station'), img('paris-street'), img('taxi-signs')],
    points: [
      'Réservation immédiate ou à l’avance',
      'Véhicules récents, propres et climatisés',
      'Chauffeur titulaire de la carte professionnelle',
      'CB, espèces ou virement',
    ],
    places: ['Gare de Beauvais', 'Creil', 'Compiègne', 'Méru'],
  },
  {
    slug: 'transport-longue-distance',
    category: 'other',
    kind: 'private',
    title: 'Longue distance',
    short: 'Partout en France',
    lead: 'Des trajets longue distance partout en France, sur devis personnalisé : un tarif transparent et sans surprise, annoncé avant le départ.',
    image: img('highway-night'),
    gallery: [img('highway-dusk'), img('city-trails'), img('driver-hands')],
    points: [
      'Devis personnalisé et transparent',
      'Pauses à la demande',
      'Aller simple ou aller-retour',
      'Véhicule climatisé, jusqu’à 8 passagers',
    ],
    places: ['Paris', 'Rouen', 'Amiens', 'Lille'],
  },
  {
    slug: 'mise-a-disposition-chauffeur',
    category: 'other',
    kind: 'private',
    title: 'Mise à disposition chauffeur',
    short: 'Chauffeur à l’heure',
    lead: 'Un chauffeur et son véhicule à votre disposition pour une soirée, un mariage, un séminaire ou une journée de rendez-vous.',
    image: img('chauffeur-door'),
    gallery: [img('woman-exit-car'), img('mercedes-front'), img('paris-champs')],
    points: [
      'Facturation à l’heure ou à la journée',
      'Événements, mariages, séminaires',
      'Tenue soignée, discrétion assurée',
      'Facture entreprise et virement SEPA',
    ],
    places: ['Événements', 'Mariages', 'Entreprises', 'Soirées'],
  },
]

export const services = catalogue.map((s, i) => ({ ...s, index: String(i + 1).padStart(2, '0') }))

export const serviceBySlug = (slug) => services.find((s) => s.slug === slug)

// The six services highlighted on the client's homepage, in the same order
export const featuredServices = [
  'taxi-conventionne-beauvais',
  'transport-prive-oise',
  'taxi-aeroport-roissy-cdg',
  'transport-longue-distance',
  'taxi-hopital-beauvais',
  'taxi-hopital-amiens',
].map(serviceBySlug)

export const zones = [
  'Beauvais', 'Creil', 'Compiègne', 'Méru', 'Noailles', 'Clermont-de-l’Oise', 'Montataire', 'Nogent-sur-Oise',
  'Amiens', 'Rouen', 'Paris', 'Beauvais-Tillé', 'Roissy-CDG', 'Orly', 'Disneyland Paris',
]

// "Nos secteurs d'intervention" on the client's site
export const destinations = [
  { name: 'Beauvais', meta: 'Ville', text: 'Centre-ville, gare, hôpital, cliniques et tous les établissements médicaux.', image: img('station'), mode: 'private' },
  { name: 'Oise (60)', meta: 'Département', text: 'Méru, Compiègne, Creil, Montataire, Nogent-sur-Oise et alentours.', image: img('city-trails'), mode: 'private' },
  { name: 'Aéroport Beauvais-Tillé', meta: 'BVA', text: 'Navettes avec suivi de vos horaires de vol.', image: img('airport-plane'), mode: 'private' },
  { name: 'Roissy-CDG & Orly', meta: 'Aéroports', text: 'Transferts vers les aéroports parisiens, sur devis.', image: img('airport-silhouettes'), mode: 'private' },
  { name: 'Amiens', meta: '80000', text: 'Hôpitaux et cliniques, dont le CHU Amiens-Picardie.', image: img('hospital-building'), mode: 'medical' },
  { name: 'Paris & Île-de-France', meta: 'AP-HP', text: 'Hôpitaux parisiens, AP-HP, cliniques et centres spécialisés.', image: img('paris-champs'), mode: 'medical' },
  { name: 'Rouen', meta: '76000', text: 'Hôpitaux et cliniques, dont le CHU Charles-Nicolle.', image: img('hospital-lobby'), mode: 'medical' },
]

export const fleet = [
  {
    name: 'Berline confort',
    seats: 4,
    bags: 3,
    image: img('mercedes-front'),
    note: 'Idéale pour les trajets médicaux, la gare et les rendez-vous.',
  },
  {
    name: 'Van 8 places',
    seats: 8,
    bags: 8,
    image: img('van-headlights'),
    note: 'Familles, groupes, aéroports avec beaucoup de bagages.',
  },
  {
    name: 'Accès fauteuil',
    seats: 3,
    bags: 2,
    image: img('care-walker'),
    note: 'Accompagnement des patients à mobilité réduite.',
  },
]

export const stats = [
  { value: 24, suffix: '/7', label: 'Disponibilité, jours fériés inclus' },
  { value: 8, suffix: '', label: 'Passagers max. par véhicule' },
  { value: 12, suffix: 'k+', label: 'Courses réalisées' },
  { value: 4.9, suffix: '★', label: 'Note moyenne clients', decimals: 1 },
]

export const testimonials = [
  {
    quote: 'Trois séances de dialyse par semaine depuis un an. Toujours à l’heure, toujours un mot gentil. Je n’ai plus à penser aux papiers de la CPAM.',
    name: 'Monique R.',
    role: 'Patiente, Beauvais',
  },
  {
    quote: 'Vol retardé de deux heures à Beauvais-Tillé, le chauffeur était là quand même, pancarte en main. Le prix annoncé n’a pas bougé d’un centime.',
    name: 'Thomas L.',
    role: 'Transfert aéroport',
  },
  {
    quote: 'Van 8 places pour Disneyland avec trois enfants et cinq valises. Sièges auto prêts, voiture impeccable. Les petits ont adoré.',
    name: 'Sarah & Karim',
    role: 'Famille, Compiègne',
  },
  {
    quote: 'Nous l’utilisons pour tous nos déplacements clients. Facturation propre, chauffeur discret, ponctualité irréprochable.',
    name: 'Julien M.',
    role: 'Directeur commercial, Creil',
  },
]

export const faq = [
  {
    q: 'Comment fonctionne la prise en charge CPAM ?',
    a: 'Votre médecin vous remet une ordonnance médicale de transport. Nous sommes conventionnés : vous n’avancez rien dans la plupart des cas (ALD, hospitalisation…) et nous transmettons directement les documents à votre caisse.',
  },
  {
    q: 'Puis-je réserver à la dernière minute ?',
    a: 'Oui. Nous roulons 24h/24 et 7j/7. Pour une course immédiate, appelez-nous ; pour un trajet planifié, la réservation en ligne prend moins d’une minute.',
  },
  {
    q: 'Que se passe-t-il si mon vol est retardé ?',
    a: 'Nous suivons votre vol en temps réel grâce à son numéro. Le chauffeur adapte son heure d’arrivée, sans frais supplémentaires.',
  },
  {
    q: 'Quels moyens de paiement acceptez-vous ?',
    a: 'Carte bancaire (Visa, Mastercard) directement dans le véhicule, espèces, ou virement SEPA pour les entreprises et les trajets réguliers.',
  },
  {
    q: 'Transportez-vous les personnes en fauteuil roulant ?',
    a: 'Oui, signalez-le lors de la réservation : nous envoyons un véhicule adapté et le chauffeur vous accompagne jusqu’à la porte.',
  },
]

export const payments = [
  { title: 'Carte bancaire', text: 'Visa, Mastercard — TPE à bord' },
  { title: 'Espèces', text: 'En euros, monnaie rendue' },
  { title: 'Virement SEPA', text: 'Entreprises & trajets réguliers' },
]
