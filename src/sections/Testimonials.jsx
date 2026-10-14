import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/gsap'
import { useLazyGSAP } from '../lib/animReady'
import { testimonials } from '../data/site'
import { ParallaxImage } from '../components/anim'
import { ArrowLeft, ArrowRight, Star } from '../components/icons'
import { cx } from '../lib/cx'

const DURATION = 7 // seconds per quote

/*
  Testimonials — one quote at a time. Words of the outgoing quote fall away, the next one's words
  rise in; segmented bars at the top fill like stories and auto-advance (paused off-screen / on hover).
*/
export default function Testimonials() {
  const root = useRef(null)
  const quote = useRef(null)
  const bars = useRef([])
  const timer = useRef(null)
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(true)
  const first = useRef(true)

  // First reveal + "only run the clock while on screen": built with the other below-the-fold animations (lib/animReady)
  useLazyGSAP(
    () => {
      ScrollTrigger.create({ trigger: root.current, start: 'top 75%', end: 'bottom 25%', onToggle: (self) => setPaused(!self.isActive) })
      if (prefersReducedMotion()) return
      gsap.from(quote.current.querySelectorAll('[data-qw]'), { yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: 0.012, scrollTrigger: { trigger: quote.current, start: 'top 85%', once: true } })
    },
    { scope: root },
  )

  // Words in when the quote changes
  useLayoutEffect(() => {
    if (first.current) return void (first.current = false)
    const words = quote.current.querySelectorAll('[data-qw]')
    if (prefersReducedMotion()) return
    gsap.fromTo(words, { yPercent: 110, rotate: 4 }, { yPercent: 0, rotate: 0, duration: 1, ease: 'expo.out', stagger: 0.012 })
    gsap.fromTo('[data-q-meta]', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'osmo', delay: 0.2 })
  }, [index])

  // Story bars
  useEffect(() => {
    // (the bars start at scaleX(0) in CSS — only touch them once the quotes have moved on)
    if (index > 0) bars.current.forEach((b, i) => gsap.set(b, { scaleX: i < index ? 1 : 0 }))
    timer.current?.kill()
    timer.current = gsap.to(bars.current[index], { scaleX: 1, duration: DURATION, ease: 'none', paused, onComplete: () => go(1) })
    return () => timer.current?.kill()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  useEffect(() => {
    if (paused) timer.current?.pause()
    else timer.current?.resume()
  }, [paused])

  const go = (d) => {
    const words = quote.current.querySelectorAll('[data-qw]')
    gsap.to(words, {
      yPercent: -110,
      duration: 0.45,
      ease: 'power3.in',
      stagger: 0.006,
      onComplete: () => setIndex((i) => (i + d + testimonials.length) % testimonials.length),
    })
  }

  const t = testimonials[index]
  return (
    <section ref={root} className="bg-paper px-5 py-28 text-ink-900 md:px-10 md:py-40" onPointerEnter={() => timer.current?.pause()} onPointerLeave={() => !paused && timer.current?.resume()}>
      <div className="mx-auto grid max-w-[1440px] gap-14 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
        <div className="flex flex-col">
          <p className="eyebrow text-ink-500">(07) — Avis clients</p>
          <div className="mt-6 flex items-center gap-4">
            <span className="display text-[5.5rem] leading-none">4,9</span>
            <div>
              <div className="flex text-amber-600">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-5" />
                ))}
              </div>
              <p className="mt-1 text-[0.92rem] text-ink-500">Plus de 300 avis vérifiés</p>
            </div>
          </div>
          <ParallaxImage src="/images/luggage-couple.webp" alt="Couple chargeant ses valises dans le coffre" className="mt-10 hidden aspect-[4/3] rounded-[1.75rem] lg:block" />
        </div>

        <div className="flex flex-col">
          <div className="flex gap-1.5">
            {testimonials.map((_, i) => (
              <span key={i} className="h-[3px] flex-1 overflow-hidden rounded-full bg-ink-900/10">
                <span ref={(el) => (bars.current[i] = el)} className="block h-full origin-left scale-x-0 bg-sky-600" />
              </span>
            ))}
          </div>

          <blockquote ref={quote} className="display mt-12 min-h-[9em] text-[clamp(1.8rem,3.6vw,3.4rem)] !leading-[1.06] md:min-h-[7.5em]">
            <span className="text-amber-700">“</span>
            {t.quote.split(' ').map((w, i) => (
              <span key={`${index}-${i}`} className="inline-block overflow-clip pb-[0.08em] align-bottom">
                <span data-qw className="inline-block">
                  {w}&nbsp;
                </span>
              </span>
            ))}
            <span className="text-amber-700">”</span>
          </blockquote>

          <div className="mt-auto flex items-end justify-between gap-6 pt-10">
            <div data-q-meta>
              <p className="font-display text-[1.3rem] font-semibold tracking-tight">{t.name}</p>
              <p className="text-ink-500">{t.role}</p>
            </div>
            <div className="flex gap-2">
              {[
                [ArrowLeft, -1, 'Avis précédent'],
                [ArrowRight, 1, 'Avis suivant'],
              ].map(([Icon, d, label]) => (
                <button
                  key={label}
                  type="button"
                  aria-label={label}
                  onClick={() => go(d)}
                  className={cx('flex size-14 items-center justify-center rounded-full transition-colors duration-300', d > 0 ? 'bg-sky-600 text-white hover:bg-sky-700' : 'ring-1 ring-ink-900/20 hover:bg-ink-900/5')}
                >
                  <Icon className="size-5" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
