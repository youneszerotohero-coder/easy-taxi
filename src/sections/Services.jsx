import { useRef, useState } from 'react'
import { img } from '../lib/img'
import { gsap, useGSAP, prefersReducedMotion } from '../lib/gsap'
import { featuredServices, serviceCategories, services } from '../data/site'
import { SplitHeading } from '../components/anim'
import { TLink } from '../transition/PageTransition'
import { ArrowChip } from '../components/Button'
import { ArrowLeft, ArrowRight } from '../components/icons'
import { cx } from '../lib/cx'

/*
  Services — pinned horizontal road trip on desktop: the section sticks and the cards travel left
  as you scroll, each image counter-drifting inside its card; a progress line fills along the bottom.
  Below lg it becomes a swipeable carousel of square cards with prev/next buttons and a progress line.
*/
export default function Services() {
  const root = useRef(null)
  const track = useRef(null)
  const [pos, setPos] = useState({ index: 0, progress: 0 })
  const count = featuredServices.length + 1 // + catalogue card

  const stepWidth = () => {
    const el = track.current
    return el.querySelector('[data-card]').offsetWidth + (parseFloat(getComputedStyle(el).columnGap) || 16)
  }

  // Mobile carousel: which card is in view, and how far along the row we are
  const onScroll = () => {
    const el = track.current
    if (!el || window.innerWidth >= 1024) return
    const max = el.scrollWidth - el.clientWidth
    setPos({ index: Math.min(count - 1, Math.round(el.scrollLeft / stepWidth())), progress: max > 0 ? el.scrollLeft / max : 0 })
  }
  const slide = (dir) => track.current.scrollBy({ left: dir * stepWidth(), behavior: 'smooth' })

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const mm = gsap.matchMedia()
      mm.add('(min-width: 1024px)', () => {
        const distance = () => track.current.scrollWidth - window.innerWidth + 80
        const tween = gsap.to(track.current, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        })
        gsap.utils.toArray('[data-card-img]', root.current).forEach((img) => {
          gsap.fromTo(img, { xPercent: -10 }, { xPercent: 10, ease: 'none', scrollTrigger: { trigger: img.parentElement, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } })
        })
        gsap.fromTo('[data-progress]', { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: () => `+=${distance()}`, scrub: true } })
      })
      gsap.from('[data-card]', { y: 120, autoAlpha: 0, duration: 1.4, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: track.current, start: 'top 85%', once: true } })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section id="services" ref={root} className="relative overflow-hidden bg-paper py-24 lg:flex lg:h-screen lg:flex-col lg:justify-center lg:py-0">
      <div className="mx-auto w-full max-w-[1440px] px-5 md:px-10">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow text-amber-700">(02) — Nos services</p>
            <SplitHeading className="display mt-5 text-[clamp(2.6rem,min(6vw,9vh),5.8rem)]">
              Un trajet pour
              <br />
              chaque besoin.
            </SplitHeading>
          </div>
          <p className="max-w-sm text-ink-500">Médical, aéroports, loisirs ou affaires : un seul numéro, le même soin, à toute heure.</p>
        </div>
      </div>

      <div
        ref={track}
        onScroll={onScroll}
        className="no-scrollbar mt-10 flex scroll-px-5 snap-x snap-mandatory items-start gap-4 overflow-x-auto px-5 md:scroll-px-10 md:px-10 lg:mt-14 lg:w-max lg:snap-none lg:items-stretch lg:gap-6 lg:overflow-visible"
      >
        {featuredServices.map((s, i) => (
          <TLink
            key={s.slug}
            data-card
            to={`/services/${s.slug}`}
            className="group relative flex aspect-square w-[80vw] max-w-[22rem] shrink-0 snap-start flex-col overflow-hidden rounded-[1.75rem] bg-ink-800 text-white shadow-[0_2rem_4rem_-2rem_rgba(11,11,12,0.35)] lg:aspect-auto lg:h-[min(62vh,calc(100svh-22rem))] lg:w-[min(30rem,34vw)] lg:max-w-none"
          >
            <div className="absolute inset-0 overflow-hidden">
              <img data-card-img {...img(s.image, '(min-width: 1024px) 42vw, 100vw')} alt="" loading="lazy" decoding="async" className="absolute inset-y-0 -left-[12%] h-full w-[124%] max-w-none object-cover transition-transform duration-[1.4s] ease-osmo group-hover:scale-110" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/30 to-ink-950/10 transition-opacity duration-700 group-hover:opacity-80" />
            <div className="relative flex items-center justify-between p-5 lg:p-6">
              <span className="eyebrow rounded-full bg-ink-950/50 px-3 py-2 text-paper/80 backdrop-blur-md">{s.short}</span>
              <span className="display text-[1.4rem] text-paper/50">{String(i + 1).padStart(2, '0')}</span>
            </div>
            <div className="relative mt-auto p-5 lg:p-6">
              <h3 className="display text-[clamp(1.7rem,2.6vw,2.6rem)]">{s.card ?? s.title}</h3>
              <div className="hidden grid-rows-[0fr] transition-[grid-template-rows] duration-700 ease-osmo group-hover:grid-rows-[1fr] lg:grid">
                <p className="overflow-hidden text-[0.95rem] text-paper/65">
                  <span className="block pt-3">{s.lead}</span>
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-white/15 pt-3 lg:mt-5 lg:pt-4">
                <span className="text-[0.92rem] text-paper/70">Découvrir</span>
                <ArrowChip className="bg-paper text-ink-900 group-hover:bg-amber" />
              </div>
            </div>
          </TLink>
        ))}

        {/* Full catalogue — every service of the client's site, grouped like its menu */}
        <div
          data-card
          className="flex aspect-square w-[80vw] max-w-[22rem] shrink-0 snap-start flex-col rounded-[1.75rem] bg-white p-5 ring-1 ring-ink-900/[0.06] lg:aspect-auto lg:h-[min(62vh,calc(100svh-22rem))] lg:w-[min(46rem,52vw)] lg:max-w-none lg:p-8"
        >
          <p className="eyebrow text-amber-700">Tous nos services</p>
          <p className="display mt-2 text-[clamp(1.5rem,2.2vw,2.3rem)] lg:mt-3">{services.length} trajets, un seul numéro.</p>

          {/* Square mobile card: names run inline under each category */}
          <div className="mt-4 grid gap-3 lg:hidden">
            {serviceCategories.map((c) => (
              <div key={c.key}>
                <p className="eyebrow !text-[0.62rem] text-ink-400">{c.label}</p>
                <p className="mt-1 text-[0.82rem] leading-relaxed text-ink-700">
                  {services
                    .filter((s) => s.category === c.key)
                    .map((s, i) => (
                      <span key={s.slug}>
                        {i > 0 && <span className="px-1 text-ink-300">·</span>}
                        <TLink to={`/services/${s.slug}`} className="underline decoration-ink-900/15 underline-offset-4 hover:text-amber-700">
                          {s.title}
                        </TLink>
                      </span>
                    ))}
                </p>
              </div>
            ))}
          </div>

          {/* Desktop: grouped lists */}
          <div className="no-scrollbar mt-6 hidden min-h-0 flex-1 gap-x-8 gap-y-6 overflow-y-auto lg:grid lg:grid-cols-2" data-lenis-prevent>
            {serviceCategories.map((c) => (
              <div key={c.key} className={c.key === 'medical' ? 'lg:row-span-2' : undefined}>
                <p className="eyebrow text-ink-400">{c.label}</p>
                <ul className="mt-3 grid gap-1">
                  {services
                    .filter((s) => s.category === c.key)
                    .map((s) => (
                      <li key={s.slug}>
                        <TLink to={`/services/${s.slug}`} className="group/l flex items-center justify-between gap-3 border-b border-ink-900/[0.07] py-2 text-[0.95rem] text-ink-700 transition-colors hover:text-ink-900">
                          {s.title}
                          <span className="text-ink-300 transition-[translate,color] duration-500 ease-osmo group-hover/l:translate-x-1 group-hover/l:text-amber-700">→</span>
                        </TLink>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="hidden w-[10vw] shrink-0 lg:block" />
      </div>

      {/* Mobile carousel controls */}
      <div className="mx-auto mt-6 flex w-full max-w-[1440px] items-center gap-4 px-5 md:px-10 lg:hidden">
        <span className="eyebrow w-16 shrink-0 text-ink-500 tabular-nums">
          {String(pos.index + 1).padStart(2, '0')} <span className="text-ink-300">/ {String(count).padStart(2, '0')}</span>
        </span>
        <div className="h-px flex-1 bg-ink-900/10">
          <div className="h-px origin-left bg-ink-900 transition-transform duration-150" style={{ transform: `scaleX(${Math.max(1 / count, pos.progress)})` }} />
        </div>
        <div className="flex gap-2">
          {[
            [-1, ArrowLeft, 'Service précédent', pos.progress <= 0.01],
            [1, ArrowRight, 'Service suivant', pos.progress >= 0.99],
          ].map(([dir, Icon, label, off]) => (
            <button
              key={label}
              type="button"
              aria-label={label}
              disabled={off}
              onClick={() => slide(dir)}
              className={cx(
                'flex size-12 items-center justify-center rounded-full transition-[opacity,transform] duration-300 active:scale-90 disabled:opacity-30',
                dir > 0 ? 'bg-ink-900 text-white' : 'bg-white text-ink-900 ring-1 ring-ink-900/10',
              )}
            >
              <Icon className="size-5" />
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-10 hidden w-full max-w-[1440px] px-10 lg:block">
        <div className="h-px bg-ink-900/10">
          <div data-progress className="h-px origin-left bg-ink-900" />
        </div>
      </div>
    </section>
  )
}
