import { useRef } from 'react'
import { img } from '../lib/img'
import { useParams } from 'react-router'
import { gsap, useGSAP, prefersReducedMotion } from '../lib/gsap'
import { intro } from '../transition/PageTransition'
import { serviceBySlug, services } from '../data/site'
import { useBooking } from '../context/BookingContext'
import { ParallaxImage, Reveal, SplitHeading } from '../components/anim'
import Button from '../components/Button'
import { TLink } from '../transition/PageTransition'
import { ArrowRight, Check, Pin } from '../components/icons'
import Cta from '../sections/Cta'
import Footer from '../sections/Footer'
import Marquee from '../sections/Marquee'
import NotFound from './NotFound'

export default function ServicePage() {
  const { slug } = useParams()
  const s = serviceBySlug(slug)
  const { openBooking } = useBooking()
  const root = useRef(null)
  const delay = intro.delay

  useGSAP(
    () => {
      if (!s || prefersReducedMotion()) return
      gsap.fromTo('[data-s-hero]', { clipPath: 'inset(30% 12% 0% 12% round 2rem)' }, { clipPath: 'inset(0% 0% 0% 0% round 2rem)', duration: 1.8, ease: 'expo.inOut', delay: delay + 0.3 })
      gsap.fromTo('[data-s-hero] img', { scale: 1.35 }, { scale: 1, duration: 2.2, ease: 'expo.out', delay: delay + 0.4 })
      gsap.to('[data-s-hero] img', { yPercent: -12, ease: 'none', scrollTrigger: { trigger: '[data-s-hero]', start: 'top bottom', end: 'bottom top', scrub: true } })
    },
    { scope: root, dependencies: [slug] },
  )

  if (!s) return <NotFound />
  const i = services.indexOf(s)
  const next = services[(i + 1) % services.length]

  return (
    <div ref={root}>
      <section className="relative overflow-hidden bg-white px-5 pt-36 pb-6 text-ink-900 md:px-10 md:pt-44">
        <div className="pointer-events-none absolute top-[-30%] left-[30%] size-[50rem] rounded-full bg-amber/15 blur-[140px]" />
        <div className="relative mx-auto w-full max-w-[1440px]">
          <Reveal immediate delay={delay + 0.2}>
            <p data-reveal className="eyebrow flex items-center gap-3 text-amber-700">
              <TLink to="/#services" className="text-ink-400 hover:text-ink-900">
                Services
              </TLink>
              <span className="text-ink-300">/</span> {s.index} — {s.short}
            </p>
          </Reveal>
          <SplitHeading as="h1" immediate delay={delay + 0.3} type="chars" className="display mt-6 max-w-[14ch] text-[clamp(3rem,8.5vw,8.5rem)]">
            {s.title}
          </SplitHeading>
          <Reveal immediate delay={delay + 0.6} className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <p data-reveal className="max-w-xl text-[1.15rem] leading-relaxed text-ink-500">
              {s.lead}
            </p>
            <div data-reveal>
              <Button size="lg" onClick={(e) => openBooking({ mode: s.kind }, e.currentTarget)} icon={<ArrowRight className="size-4" />}>
                {s.kind === 'medical' ? 'Réserver un transport médical' : 'Réserver ce trajet'}
              </Button>
            </div>
          </Reveal>
          <div data-s-hero className="relative mt-14 h-[62vh] min-h-[22rem] overflow-hidden rounded-[2rem]">
            <img {...img(s.image, '(min-width: 1440px) 1360px, 100vw')} alt={s.title} fetchPriority="high" className="absolute inset-0 h-[115%] w-full object-cover" />
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-24 text-ink-900 md:px-10 md:py-36">
        <div className="mx-auto grid max-w-[1440px] gap-14 lg:grid-cols-2 lg:gap-24">
          <div>
            <p className="eyebrow text-amber-700">Ce qui est inclus</p>
            <SplitHeading className="display mt-5 text-[clamp(2.4rem,5vw,4.6rem)]">Pensé pour vous, jusqu’au moindre détail.</SplitHeading>
            <Reveal as="ul" className="mt-12 grid gap-3">
              {s.points.map((p) => (
                <li data-reveal key={p} className="flex items-center gap-4 rounded-2xl bg-paper p-5 ring-1 ring-ink-900/[0.05]">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber text-ink-900">
                    <Check className="size-4" />
                  </span>
                  <span className="text-[1.05rem]">{p}</span>
                </li>
              ))}
            </Reveal>
            <Reveal className="mt-10">
              <p data-reveal className="eyebrow text-ink-400">
                Destinations fréquentes
              </p>
              <div data-reveal className="mt-4 flex flex-wrap gap-2">
                {s.places.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={(e) => openBooking({ mode: s.kind, dropoff: p }, e.currentTarget)}
                    className="inline-flex h-11 items-center gap-2 rounded-full bg-paper px-4 text-ink-700 ring-1 ring-ink-900/[0.06] transition-colors hover:bg-amber hover:text-ink-900"
                  >
                    <Pin className="size-4" /> {p}
                  </button>
                ))}
              </div>
            </Reveal>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <ParallaxImage src={s.gallery[0]} className="col-span-2 aspect-[16/10] rounded-[1.75rem]" />
            <ParallaxImage src={s.gallery[1]} from="left" className="aspect-[3/4] rounded-[1.75rem]" />
            <ParallaxImage src={s.gallery[2]} from="right" className="mt-16 aspect-[3/4] rounded-[1.75rem]" />
          </div>
        </div>
      </section>

      <Marquee />

      {/* Next service */}
      <TLink to={`/services/${next.slug}`} className="group relative block overflow-hidden bg-paper px-5 py-24 text-ink-900 md:px-10 md:py-32">
        <img {...img(next.image)} alt="" loading="lazy" decoding="async" className="absolute inset-0 size-full scale-110 object-cover opacity-0 transition-all duration-[1.2s] ease-osmo group-hover:scale-100 group-hover:opacity-20" />
        <div className="relative mx-auto flex max-w-[1440px] items-end justify-between gap-8">
          <div>
            <p className="eyebrow text-ink-400">Service suivant — {next.index}</p>
            <p className="display mt-5 text-[clamp(2.6rem,7vw,7rem)] transition-colors duration-500 group-hover:text-amber-700">{next.title}</p>
          </div>
          <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-ink-900 text-white transition-all duration-700 ease-osmo group-hover:-rotate-45 group-hover:bg-amber group-hover:text-ink-900 md:size-24">
            <ArrowRight className="size-6 md:size-8" />
          </span>
        </div>
      </TLink>

      <Cta />
      <Footer />
    </div>
  )
}
