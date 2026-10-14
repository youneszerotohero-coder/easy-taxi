import { useRef } from 'react'
import { gsap, prefersReducedMotion } from '../lib/gsap'
import { useLazyGSAP } from '../lib/animReady'
import { useBooking } from '../context/BookingContext'
import { ParallaxImage, Reveal, SplitHeading } from '../components/anim'
import Button from '../components/Button'
import { ArrowRight, Check, Cross, File as FileIcon, Shield, Wheelchair } from '../components/icons'

const steps = [
  [FileIcon, 'Ordonnance médicale', 'Votre médecin vous délivre une prescription médicale de transport.'],
  [Shield, 'On gère la CPAM', 'Nous transmettons les documents, vous n’avancez pas les frais en ALD.'],
  [Wheelchair, 'Accompagnement', 'De votre porte jusqu’au service, aide à la marche ou fauteuil.'],
]

/*
  Paper section — the calm one. Images stack and fan out on scroll, a hospital chip list
  slides along, and the CTA opens the booking panel straight in "medical" mode.
*/
export default function Medical() {
  const { openBooking } = useBooking()
  const root = useRef(null)

  useLazyGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.fromTo('[data-fan]', { rotate: 0, y: 80 }, { rotate: (i) => [-6, 5][i], y: 0, ease: 'none', scrollTrigger: { trigger: '[data-fan-wrap]', start: 'top bottom', end: 'center center', scrub: true } })
      gsap.from('[data-pill]', { xPercent: -40, autoAlpha: 0, stagger: 0.06, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '[data-pills]', start: 'top 90%', once: true } })
    },
    { scope: root },
  )

  return (
    <section id="medical" ref={root} className="relative overflow-hidden bg-white px-5 py-28 text-ink-900 md:px-10 md:py-40">
      <div className="mx-auto grid max-w-[1440px] gap-16 lg:grid-cols-2 lg:gap-24">
        <div>
          <p className="eyebrow flex items-center gap-2 text-ink-500">
            <span className="flex size-5 items-center justify-center rounded-full bg-sky-600 text-white">
              <Cross className="size-3" />
            </span>
            (03) — Transport médical
          </p>
          <SplitHeading className="display mt-6 text-[clamp(2.6rem,6vw,5.6rem)]">
            Taxi conventionné, l’esprit tranquille.
          </SplitHeading>
          <Reveal>
            <p data-reveal className="mt-8 max-w-xl text-[1.1rem] leading-relaxed text-ink-500">
              Consultations, dialyse, chimiothérapie, radiothérapie, hospitalisation de jour : nous sommes agréés par l’Assurance Maladie pour vous conduire vers vos soins, en toute sérénité.
            </p>
            <ol className="mt-12 grid gap-px overflow-hidden rounded-[1.5rem] bg-ink-900/10">
              {steps.map(([Icon, t, d], i) => (
                <li data-reveal key={t} className="flex gap-5 bg-white p-6 transition-colors duration-500 hover:bg-paper">
                  <span className="display text-[1.1rem] text-ink-300">0{i + 1}</span>
                  <div className="flex-1">
                    <p className="flex items-center gap-2 font-display text-[1.3rem] font-semibold tracking-tight">
                      <Icon className="size-5 text-amber-700" /> {t}
                    </p>
                    <p className="mt-1 text-ink-500">{d}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div data-reveal className="mt-10 flex flex-wrap items-center gap-4">
              <Button variant="dark" size="lg" onClick={(e) => openBooking({ mode: 'medical' }, e.currentTarget)} icon={<ArrowRight className="size-4" />}>
                Réserver un transport médical
              </Button>
              <span className="flex items-center gap-2 text-[0.92rem] text-ink-500">
                <Check className="size-4 text-amber-600" /> CPAM · MSA · MGEN · SSI
              </span>
            </div>
          </Reveal>
        </div>

        <div data-fan-wrap className="relative min-h-[34rem] lg:min-h-0">
          <div data-fan className="absolute top-0 left-0 w-[68%] origin-bottom-right">
            <ParallaxImage src="/images/hospital-building.webp" alt="Bâtiment hospitalier" className="aspect-[4/5] rounded-[1.75rem] shadow-2xl" speed={8} />
          </div>
          <div data-fan className="absolute right-0 bottom-0 w-[62%] origin-bottom-left">
            <ParallaxImage src="/images/care-walker.webp" alt="Accompagnement d’une patiente à la sortie de l’hôpital" className="aspect-[4/5] rounded-[1.75rem] shadow-2xl ring-8 ring-white" speed={8} from="right" />
          </div>
          <div className="absolute top-[42%] left-[44%] z-10 flex -translate-x-1/2 items-center gap-3 rounded-full bg-sky-600 py-2 pr-5 pl-2 text-paper shadow-xl">
            <span className="flex size-10 items-center justify-center rounded-full bg-care text-ink-900">
              <Shield className="size-5" />
            </span>
            <span className="text-[0.9rem] leading-tight">
              Agréé
              <br />
              <span className="text-paper/60">Assurance Maladie</span>
            </span>
          </div>
        </div>
      </div>

      <div data-pills className="mx-auto mt-20 flex max-w-[1440px] flex-wrap gap-2 md:mt-28">
        <span data-pill className="eyebrow mr-3 self-center text-ink-400">
          Nous desservons
        </span>
        {['CH Beauvais', 'CHU Amiens-Picardie', 'CHU Rouen Charles-Nicolle', 'AP-HP Paris', 'Centres de dialyse', 'Cliniques de l’Oise', 'Centres de radiothérapie'].map((h) => (
          <span data-pill key={h} className="rounded-full px-4 py-2 text-[0.92rem] ring-1 ring-ink-900/15">
            {h}
          </span>
        ))}
      </div>
    </section>
  )
}
