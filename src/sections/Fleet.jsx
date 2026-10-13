import { useRef } from 'react'
import { img } from '../lib/img'
import { gsap, useGSAP, prefersReducedMotion } from '../lib/gsap'
import { fleet } from '../data/site'
import { SplitHeading } from '../components/anim'
import { useBooking } from '../context/BookingContext'
import { Bag, Users } from '../components/icons'
import { ArrowChip } from '../components/Button'

/*
  Fleet — three cards that deal in like a hand of cards, then tilt toward the pointer (3D) on hover.
  Clicking a card opens the booking panel from that card.
*/
export default function Fleet() {
  const { openBooking } = useBooking()
  const root = useRef(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.from('[data-car-card]', {
        y: 160,
        rotate: (i) => [-8, 0, 8][i],
        autoAlpha: 0,
        duration: 1.5,
        ease: 'expo.out',
        stagger: 0.1,
        scrollTrigger: { trigger: '[data-cards]', start: 'top 85%', once: true },
      })
      if (matchMedia('(hover: none)').matches) return
      const off = []
      gsap.utils.toArray('[data-car-card]').forEach((card) => {
        const rx = gsap.quickTo(card, 'rotationX', { duration: 0.8, ease: 'power3.out' })
        const ry = gsap.quickTo(card, 'rotationY', { duration: 0.8, ease: 'power3.out' })
        const move = (e) => {
          const r = card.getBoundingClientRect()
          ry(((e.clientX - r.left) / r.width - 0.5) * 10)
          rx(-((e.clientY - r.top) / r.height - 0.5) * 10)
        }
        const leave = () => {
          rx(0)
          ry(0)
        }
        card.addEventListener('pointermove', move)
        card.addEventListener('pointerleave', leave)
        off.push(() => {
          card.removeEventListener('pointermove', move)
          card.removeEventListener('pointerleave', leave)
        })
      })
      return () => off.forEach((f) => f())
    },
    { scope: root },
  )

  return (
    <section id="flotte" ref={root} className="overflow-x-clip bg-white px-5 py-28 text-ink-900 md:px-10 md:py-40">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow text-amber-700">(05) — La flotte</p>
            <SplitHeading className="display mt-5 text-[clamp(2.6rem,6vw,5.8rem)]">
              Le bon véhicule,
              <br />à chaque trajet.
            </SplitHeading>
          </div>
          <p className="max-w-sm text-ink-500">Récents, climatisés et impeccables. De 1 à 8 passagers, avec la place pour tous les bagages.</p>
        </div>

        <div data-cards className="mt-16 grid gap-5 [perspective:1400px] md:grid-cols-3">
          {fleet.map((v) => (
            <button
              key={v.name}
              type="button"
              data-car-card
              onClick={(e) => openBooking({ mode: v.seats === 3 ? 'medical' : 'private' }, e.currentTarget)}
              className="group relative flex flex-col overflow-hidden rounded-[1.75rem] bg-paper text-left ring-1 ring-ink-900/[0.05] [transform-style:preserve-3d]"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img {...img(v.image, '(min-width: 768px) 33vw, 100vw')} alt={v.name} loading="lazy" decoding="async" className="size-full object-cover transition-transform duration-[1.2s] ease-osmo group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-paper via-transparent to-transparent" />
              </div>
              <div className="flex flex-1 flex-col p-6 [transform:translateZ(40px)]">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="display text-[2rem]">{v.name}</h3>
                  <ArrowChip className="bg-ink-900 text-white group-hover:bg-amber group-hover:text-ink-900" />
                </div>
                <p className="mt-2 text-ink-500">{v.note}</p>
                <div className="mt-auto flex gap-2 pt-8">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-[0.88rem]">
                    <Users className="size-4 text-amber-700" /> {v.seats} places
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-[0.88rem]">
                    <Bag className="size-4 text-amber-700" /> {v.bags} bagages
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
