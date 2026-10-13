import Button from '../components/Button'
import { img } from '../lib/img'
import { SplitHeading } from '../components/anim'
import { intro } from '../transition/PageTransition'

export default function NotFound() {
  return (
    <section className="relative flex min-h-[100svh] flex-col items-start justify-center overflow-hidden bg-paper px-5 text-ink-900 md:px-10">
      <img {...img('/images/highway-night.webp')} alt="" decoding="async" className="absolute inset-0 size-full object-cover opacity-[0.12] grayscale" />
      <div className="relative mx-auto w-full max-w-[1440px]">
        <p className="eyebrow text-amber-700">Erreur 404 — hors itinéraire</p>
        <SplitHeading as="h1" immediate delay={intro.delay + 0.2} type="chars" className="display mt-6 text-[clamp(3rem,10vw,10rem)]">
          Mauvaise sortie.
        </SplitHeading>
        <p className="mt-6 max-w-md text-ink-500">Cette page n’existe pas ou a été déplacée. Faisons demi-tour.</p>
        <Button to="/" size="lg" className="mt-10">
          Retour à l’accueil
        </Button>
      </div>
    </section>
  )
}
