import { useRef } from 'react'
import { img } from '../lib/img'
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from '../lib/gsap'
import { useBooking } from '../context/BookingContext'
import { site } from '../data/site'
import { Magnetic, SplitHeading } from '../components/anim'
import { ArrowRight, Phone, Whatsapp } from '../components/icons'

/*
  Closing call to action over light trails. Headlight streaks race across on a loop,
  the giant round button is magnetic and opens the booking panel from itself.
*/
export default function Cta() {
  const { openBooking } = useBooking()
  const root = useRef(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      // Streak loops only run while the section is on screen
      const streaks = gsap.utils.toArray('[data-streak]').map((el, i) =>
        gsap.fromTo(el, { xPercent: -120 }, { xPercent: 420, duration: gsap.utils.random(1.6, 3), ease: 'power2.in', repeat: -1, delay: i * 0.7, repeatDelay: gsap.utils.random(0.5, 2), paused: true }),
      )
      ScrollTrigger.create({ trigger: root.current, start: 'top bottom', end: 'bottom top', onToggle: (self) => streaks.forEach((t) => (self.isActive ? t.play() : t.pause())) })
      gsap.fromTo('[data-cta-img]', { scale: 1.3 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom bottom', scrub: true } })
      gsap.from('[data-cta-btn]', { scale: 0, rotate: -120, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: root.current, start: 'top 60%', once: true } })
    },
    { scope: root },
  )

  return (
    <section className="bg-white p-3 md:p-5">
      <div ref={root} className="relative overflow-hidden rounded-[2rem] bg-ink-950 px-5 py-28 text-white md:rounded-[2.5rem] md:px-10 md:py-44">
        <img data-cta-img {...img('/images/city-trails.webp')} alt="" loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/80 via-ink-950/40 to-ink-950/90" />
        {[18, 46, 71].map((top, i) => (
          <span key={top} data-streak className="absolute left-0 h-[2px] w-1/4 rounded-full bg-gradient-to-r from-transparent via-amber to-amber-300 blur-[1px]" style={{ top: `${top}%`, opacity: 0.35 + i * 0.15 }} />
        ))}

        <div className="relative mx-auto flex max-w-[1440px] flex-col items-start gap-14 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow text-amber">Prêt à partir ?</p>
            <SplitHeading className="display mt-6 max-w-[11ch] text-[clamp(3.2rem,9vw,9rem)]" type="chars">
              On passe vous prendre.
            </SplitHeading>
            <div className="mt-10 flex flex-wrap gap-3">
              <a href={site.phoneHref} className="inline-flex h-14 items-center gap-3 rounded-full bg-white/10 px-6 backdrop-blur-md transition-colors hover:bg-white/20">
                <Phone className="size-5 text-amber" /> {site.phone}
              </a>
              <a href={site.whatsapp} target="_blank" rel="noreferrer" className="inline-flex h-14 items-center gap-3 rounded-full bg-[#25d366]/20 px-6 text-[#7cf0a6] backdrop-blur-md transition-colors hover:bg-[#25d366]/25">
                <Whatsapp className="size-5" /> WhatsApp
              </a>
            </div>
          </div>

          <Magnetic strength={0.3}>
            <button
              data-cta-btn
              type="button"
              onClick={(e) => openBooking(null, e.currentTarget)}
              className="group relative flex size-52 flex-col items-center justify-center gap-3 rounded-full bg-amber text-ink-900 transition-colors duration-500 hover:bg-amber-300 md:size-64"
            >
              <span className="absolute inset-0 animate-glow rounded-full" />
              <ArrowRight className="size-8 transition-transform duration-700 ease-osmo group-hover:-rotate-45" />
              <span className="display text-[1.6rem] md:text-[2rem]">Réserver</span>
              <span className="eyebrow text-ink-900/60">en 1 minute</span>
            </button>
          </Magnetic>
        </div>
      </div>
    </section>
  )
}
