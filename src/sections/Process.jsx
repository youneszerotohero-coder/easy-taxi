import { useRef } from 'react'
import { gsap, prefersReducedMotion } from '../lib/gsap'
import { useLazyGSAP } from '../lib/animReady'
import { SplitHeading } from '../components/anim'
import { Calendar, Car, Flag, Phone } from '../components/icons'

const steps = [
  [Calendar, 'Réservez', 'En ligne en une minute, par téléphone ou WhatsApp, à toute heure.'],
  [Phone, 'Confirmation', 'On vous rappelle avec le prix exact et le nom de votre chauffeur.'],
  [Car, 'Prise en charge', 'Le chauffeur arrive en avance et s’occupe de vos bagages.'],
  [Flag, 'À destination', 'CB, espèces ou facturation CPAM : tout est réglé, sans surprise.'],
]

// Road drawn in a 1400×300 box that is stretched to the full width (preserveAspectRatio="none");
// strokes keep their pixel thickness and the car/stops are HTML so nothing gets distorted.
const W = 1400
const H = 300
const ROUTE = 'M0 150 C 175 40, 350 40, 466 150 S 760 260, 933 150 S 1225 40, 1400 150'
const STOPS_X = [175, 525, 875, 1225] // centres of the four step columns

/*
  "Comment ça marche" — the section pins and you drive it: an amber line paints the road behind the car,
  each stop lights up as the car reaches it and its step rises to full colour underneath.
*/
export default function Process() {
  const root = useRef(null)

  useLazyGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const mm = gsap.matchMedia()

      mm.add('(min-width: 1024px)', () => {
        const box = q('[data-road]')[0]
        const path = q('[data-route]')[0]
        const len = path.getTotalLength()
        const samples = Array.from({ length: 401 }, (_, i) => ({ p: i / 400, pt: path.getPointAtLength((i / 400) * len) }))
        const stops = STOPS_X.map((x) => samples.reduce((a, b) => (Math.abs(b.pt.x - x) < Math.abs(a.pt.x - x) ? b : a)))
        const dots = q('[data-stop]')
        const cols = q('[data-step]')
        stops.forEach((s, i) => gsap.set(dots[i], { left: `${(s.pt.x / W) * 100}%`, top: `${(s.pt.y / H) * 100}%` }))

        const car = q('[data-car]')[0]
        const clip = q('[data-clip]')[0]
        const state = { p: 0 }

        const render = () => {
          const pt = path.getPointAtLength(state.p * len)
          const ahead = path.getPointAtLength(Math.min(len, state.p * len + 4))
          // Angle in screen space — the box is stretched differently on x and y
          const sx = box.clientWidth / W
          const sy = box.clientHeight / H
          const angle = (Math.atan2((ahead.y - pt.y) * sy, (ahead.x - pt.x) * sx) * 180) / Math.PI
          gsap.set(car, { left: `${(pt.x / W) * 100}%`, top: `${(pt.y / H) * 100}%`, rotate: angle })
          clip.setAttribute('width', pt.x)
          stops.forEach((s, i) => {
            const on = state.p >= s.p - 0.005
            cols[i].classList.toggle('is-on', on)
            dots[i].classList.toggle('is-on', on)
          })
        }
        render()

        gsap.to(state, {
          p: 1,
          ease: 'none',
          onUpdate: render,
          scrollTrigger: { trigger: root.current, start: 'top top', end: '+=180%', pin: true, scrub: 1, onRefresh: render },
        })
      })

      mm.add('(max-width: 1023px)', () => {
        if (prefersReducedMotion()) return
        gsap.fromTo(q('[data-vline]'), { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: q('[data-vlist]')[0], start: 'top 70%', end: 'bottom 60%', scrub: true } })
        q('[data-vstep]').forEach((el) =>
          gsap.from(el, { x: 40, autoAlpha: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 82%', once: true } }),
        )
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section ref={root} className="relative overflow-hidden bg-paper text-ink-900 lg:flex lg:h-screen lg:flex-col lg:justify-center">
      <div className="mx-auto w-full max-w-[1440px] px-5 py-28 md:px-10 lg:py-0">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow text-amber-700">(04) — Comment ça marche</p>
            <SplitHeading className="display mt-5 text-[clamp(2.6rem,min(5.4vw,8vh),5.4rem)]">
              Quatre étapes,
              <br />
              zéro stress.
            </SplitHeading>
          </div>
          <p className="max-w-sm text-ink-500">De la réservation à l’arrivée, on s’occupe de tout. Faites défiler pour prendre la route.</p>
        </div>

        {/* Desktop road */}
        <div className="mt-[clamp(1.5rem,5vh,3.5rem)] hidden lg:block">
          <div data-road className="relative h-[clamp(7.5rem,20vh,13rem)]">
            <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="absolute inset-0 size-full overflow-visible" aria-hidden="true">
              <defs>
                <clipPath id="painted">
                  <rect data-clip x="-20" y="-50" width="0" height={H + 100} />
                </clipPath>
              </defs>
              <path d={ROUTE} fill="none" stroke="#fff" strokeWidth="38" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
              <path d={ROUTE} fill="none" stroke="var(--color-paper-300)" strokeWidth="2" strokeDasharray="10 14" vectorEffect="non-scaling-stroke" />
              <path data-route d={ROUTE} fill="none" stroke="var(--color-amber)" strokeWidth="4" strokeLinecap="round" vectorEffect="non-scaling-stroke" clipPath="url(#painted)" />
            </svg>

            {STOPS_X.map((x, i) => (
              <span
                key={x}
                data-stop
                className="group/stop absolute flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white font-mono text-[0.75rem] font-medium text-ink-400 shadow-[0_0.5rem_1.2rem_-0.4rem_rgba(11,11,12,0.25)] ring-1 ring-ink-900/10 transition-all duration-500 ease-osmo [&.is-on]:scale-110 [&.is-on]:bg-ink-900 [&.is-on]:text-amber [&.is-on]:ring-ink-900"
                style={{ left: `${(x / W) * 100}%`, top: '50%' }}
              >
                0{i + 1}
              </span>
            ))}

            {/* Car */}
            <span data-car className="absolute z-10 -mt-[0.85rem] -ml-[1.4rem] block h-[1.7rem] w-[2.8rem] origin-center" style={{ left: 0, top: '50%' }}>
              <span className="absolute top-1/2 left-[85%] h-16 w-28 -translate-y-1/2 bg-[radial-gradient(ellipse_at_left,rgb(255_179_26/0.55),transparent_70%)]" />
              <span className="absolute inset-0 rounded-[0.55rem] bg-ink-900 shadow-[0_0.6rem_1.2rem_-0.3rem_rgba(11,11,12,0.45)]" />
              <span className="absolute top-[22%] bottom-[22%] left-[22%] w-[34%] rounded-[0.2rem] bg-amber" />
              <span className="absolute top-[18%] right-[6%] size-[0.32rem] rounded-full bg-amber-300" />
              <span className="absolute right-[6%] bottom-[18%] size-[0.32rem] rounded-full bg-amber-300" />
            </span>
          </div>

          <ol className="mt-[clamp(1.5rem,5vh,3rem)] grid grid-cols-4 gap-6">
            {steps.map(([Icon, t, d]) => (
              <li
                key={t}
                data-step
                className="flex translate-y-3 flex-col items-center text-center opacity-35 transition-all duration-700 ease-osmo [&.is-on]:translate-y-0 [&.is-on]:opacity-100"
              >
                <span className="flex size-11 items-center justify-center rounded-2xl bg-white text-amber-700 ring-1 ring-ink-900/[0.06]">
                  <Icon className="size-5" />
                </span>
                <p className="display mt-4 text-[clamp(1.5rem,2vw,2rem)] whitespace-nowrap">{t}</p>
                <p className="mt-2 max-w-[17rem] text-[0.98rem] leading-relaxed text-ink-500">{d}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Mobile timeline */}
        <ol data-vlist className="relative mt-14 space-y-10 pl-12 lg:hidden">
          <span className="absolute top-2 bottom-2 left-[1.05rem] w-px bg-ink-900/10" />
          <span data-vline className="absolute top-2 bottom-2 left-[1.05rem] w-px origin-top bg-amber" />
          {steps.map(([Icon, t, d], i) => (
            <li key={t} data-vstep className="relative">
              <span className="absolute top-0 -left-12 flex size-9 items-center justify-center rounded-full bg-ink-900 font-mono text-[0.72rem] font-medium text-amber ring-4 ring-paper">
                0{i + 1}
              </span>
              <p className="flex items-center gap-2 font-display text-[1.9rem] font-semibold tracking-tight">
                {t} <Icon className="size-5 text-amber-700" />
              </p>
              <p className="mt-1.5 text-ink-500">{d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
