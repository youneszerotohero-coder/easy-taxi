import { useRef, useState } from 'react'
import { img } from '../lib/img'
import { gsap, prefersReducedMotion } from '../lib/gsap'
import { useLazyGSAP } from '../lib/animReady'
import { useBooking } from '../context/BookingContext'
import { ParallaxImage, SplitHeading } from '../components/anim'
import { ArrowUpRight } from '../components/icons'
import { destinations } from '../data/site'


/*
  Destinations — the client's "secteurs d'intervention". A full-bleed image opens from a small window as it scrolls in, then a list where
  hovering a row floats its photo next to the cursor (desktop). Clicking books that destination.
*/
export default function Destinations() {
  const { openBooking } = useBooking()
  const root = useRef(null)
  const float = useRef(null)
  // The 7 hover photos only download once the visitor actually hovers the list (desktop only)
  const [armed, setArmed] = useState(false)

  useLazyGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.fromTo(
        '[data-window]',
        { clipPath: 'inset(22% 26% 22% 26% round 2rem)' },
        // Fully open once its top is a quarter of the way down the screen — not when it reaches the top edge,
        // which on a tall phone screen meant scrolling through most of it while it was still a small window
        { clipPath: 'inset(0% 0% 0% 0% round 0rem)', ease: 'none', scrollTrigger: { trigger: '[data-window]', start: 'top 95%', end: 'top 25%', scrub: true } },
      )
      gsap.from('[data-window-title]', { yPercent: 40, autoAlpha: 0, ease: 'none', scrollTrigger: { trigger: '[data-window]', start: 'top 75%', end: 'top 35%', scrub: true } })
      gsap.from('[data-row]', { y: 60, autoAlpha: 0, duration: 1.1, ease: 'expo.out', stagger: 0.06, scrollTrigger: { trigger: '[data-rows]', start: 'top 85%', once: true } })

      if (matchMedia('(hover: none)').matches) return
      const el = float.current
      const xTo = gsap.quickTo(el, 'x', { duration: 0.7, ease: 'power3.out' })
      const yTo = gsap.quickTo(el, 'y', { duration: 0.7, ease: 'power3.out' })
      const list = root.current.querySelector('[data-rows]')
      const move = (e) => {
        xTo(e.clientX + 24)
        yTo(e.clientY - 110)
      }
      const enter = (e) => {
        gsap.set(el, { x: e.clientX + 24, y: e.clientY - 110 })
        gsap.to(el, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'osmo' })
      }
      const leave = () => gsap.to(el, { autoAlpha: 0, scale: 0.6, duration: 0.4, ease: 'power3.in' })
      // Wheel-scrolling with a still mouse moves the list away without any pointer event — check on scroll
      const last = { x: -1, y: -1, over: false }
      const track = (e) => {
        last.x = e.clientX
        last.y = e.clientY
        last.over = true
      }
      const onScroll = () => {
        if (!last.over) return
        if (!document.elementFromPoint(last.x, last.y)?.closest('[data-rows]')) {
          last.over = false
          leave()
        }
      }
      const out = () => {
        last.over = false
        leave()
      }
      list.addEventListener('pointermove', move)
      list.addEventListener('pointermove', track)
      list.addEventListener('pointerenter', enter)
      list.addEventListener('pointerenter', track)
      list.addEventListener('pointerleave', out)
      window.addEventListener('scroll', onScroll, { passive: true })
      return () => {
        list.removeEventListener('pointermove', move)
        list.removeEventListener('pointermove', track)
        list.removeEventListener('pointerenter', enter)
        list.removeEventListener('pointerenter', track)
        list.removeEventListener('pointerleave', out)
        window.removeEventListener('scroll', onScroll)
      }
    },
    { scope: root },
  )

  const show = (i) => {
    const imgs = float.current?.querySelectorAll('img')
    imgs?.forEach((img, k) => gsap.to(img, { autoAlpha: k === i ? 1 : 0, scale: k === i ? 1 : 1.15, duration: 0.6, ease: 'osmo' }))
  }

  return (
    <section id="destinations" ref={root} className="relative bg-white text-ink-900">
      <div className="relative h-[70svh] md:h-[90svh]">
        <div data-window className="absolute inset-0 overflow-hidden">
          <ParallaxImage src="/images/highway-dusk.webp" sizes="100vw" alt="Autoroute la nuit, traînées de phares" reveal={false} speed={10} className="!absolute inset-0" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/25 to-ink-950/30" />
        </div>
        <div data-window-title className="absolute inset-x-0 bottom-0 mx-auto max-w-[1440px] px-5 pb-14 md:px-10">
          <p className="eyebrow text-amber">(06) — Destinations</p>
          <h2 className="display mt-5 max-w-[14ch] text-[clamp(2.8rem,8vw,8rem)] text-white">Où allons-nous aujourd’hui ?</h2>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-5 py-20 md:px-10 md:py-28">
        <SplitHeading as="p" className="max-w-2xl text-[1.15rem] leading-relaxed text-ink-500">
          Nos secteurs d’intervention : Beauvais et toute l’Oise, les aéroports, les hôpitaux d’Amiens, de Paris et de Rouen — et partout en France sur devis.
        </SplitHeading>
        <ul data-rows onPointerEnter={() => setArmed(true)} className="mt-12 border-t border-ink-900/10">
          {destinations.map((d, i) => (
            <li key={d.name} data-row onPointerEnter={() => show(i)}>
              <button
                type="button"
                onClick={(e) => openBooking({ mode: d.mode, dropoff: d.name }, e.currentTarget.querySelector('[data-row-arrow]'))}
                className="group flex w-full items-center gap-4 border-b border-ink-900/10 py-6 text-left md:gap-8 md:py-8"
              >
                <span className="eyebrow hidden w-28 shrink-0 text-ink-400 md:block">{d.meta}</span>
                <span className="flex min-w-0 flex-1 flex-col gap-1.5 transition-transform duration-700 ease-osmo group-hover:translate-x-4 lg:flex-row lg:items-baseline lg:justify-between lg:gap-8">
                  <span className="display text-[clamp(1.6rem,4vw,3.4rem)] transition-colors duration-500 group-hover:text-amber-700">{d.name}</span>
                  <span className="max-w-sm text-[0.92rem] leading-snug text-ink-500 lg:text-right">{d.text}</span>
                </span>
                <span data-row-arrow className="flex size-11 shrink-0 items-center justify-center rounded-full bg-ink-900/[0.05] transition-all duration-500 ease-osmo group-hover:rotate-45 group-hover:bg-amber group-hover:text-ink-900">
                  <ArrowUpRight className="size-5" />
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div ref={float} className="pointer-events-none fixed top-0 left-0 z-40 hidden h-56 w-80 overflow-hidden rounded-2xl opacity-0 shadow-2xl md:block" style={{ transform: 'scale(0.6)' }} aria-hidden="true">
        {armed && destinations.map((d, i) => (
          <img key={d.name} {...img(d.image, '320px')} alt="" decoding="async" className="absolute inset-0 size-full object-cover" style={{ opacity: i === 0 ? 1 : 0 }} />
        ))}
      </div>
    </section>
  )
}
