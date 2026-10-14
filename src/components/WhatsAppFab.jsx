import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap, prefersReducedMotion } from '../lib/gsap'
import { introDone } from '../lib/intro'
import { site } from '../data/site'
import { cx } from '../lib/cx'
import { Close, Whatsapp } from './icons'

const MESSAGE = 'Bonjour, je souhaite réserver un taxi.'
const href = `${site.whatsapp}?text=${encodeURIComponent(MESSAGE)}`
const SEEN_KEY = 'wa-greeting-seen'

/*
  Floating WhatsApp button — tablets & desktop only (phones have it in the bottom bar).
  - A green disc with a slow "sonar" ring and an online dot; on hover it widens into a pill with a label.
  - Once per session, a small greeting bubble pops out of it a few seconds after the intro (dismissable).
  - Drops in after the preloader with a little spring.
*/
export default function WhatsAppFab() {
  const root = useRef(null)
  const bubble = useRef(null)
  const [greet, setGreet] = useState(false)

  // Entrance after the intro
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    gsap.set(root.current, { y: 40, scale: 0.6, autoAlpha: 0 })
    introDone.then(() => gsap.to(root.current, { y: 0, scale: 1, autoAlpha: 1, duration: 1, ease: 'back.out(1.8)', delay: 1.4 }))
  }, [])

  // Greeting bubble: once per session, ~6s after the intro
  useEffect(() => {
    let seen = false
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === '1'
    } catch {}
    if (seen) return
    let id
    introDone.then(() => (id = setTimeout(() => setGreet(true), 6000)))
    return () => clearTimeout(id)
  }, [])

  useLayoutEffect(() => {
    if (!greet || !bubble.current) return
    try {
      sessionStorage.setItem(SEEN_KEY, '1')
    } catch {}
    if (prefersReducedMotion()) return
    gsap.fromTo(bubble.current, { y: 16, scale: 0.85, autoAlpha: 0, transformOrigin: '100% 100%' }, { y: 0, scale: 1, autoAlpha: 1, duration: 0.7, ease: 'back.out(1.7)' })
  }, [greet])

  const dismiss = () => {
    if (!bubble.current || prefersReducedMotion()) return setGreet(false)
    gsap.to(bubble.current, { y: 10, scale: 0.9, autoAlpha: 0, duration: 0.3, ease: 'power2.in', onComplete: () => setGreet(false) })
  }

  return (
    <div ref={root} className="fixed right-6 bottom-6 z-50 hidden flex-col items-end gap-3 sm:flex">
      {greet && (
        <div ref={bubble} role="status" className="relative w-72 rounded-2xl bg-white p-4 pr-10 text-ink-900 shadow-[0_1.25rem_3rem_-0.75rem_rgba(11,11,12,0.35)] ring-1 ring-ink-900/[0.06]">
          <button type="button" onClick={dismiss} aria-label="Fermer le message" className="absolute top-2.5 right-2.5 flex size-7 items-center justify-center rounded-full text-ink-400 transition-colors hover:bg-ink-900/[0.06] hover:text-ink-900">
            <Close className="size-3.5" />
          </button>
          <div className="flex items-center gap-2.5">
            <span className="relative flex size-9 shrink-0 items-center justify-center rounded-full bg-[#25d366] text-white">
              <Whatsapp className="size-[1.15rem]" />
              <span className="absolute -right-0.5 -bottom-0.5 size-3 rounded-full bg-[#25d366] ring-2 ring-white" />
            </span>
            <div className="leading-tight">
              <p className="text-[0.92rem] font-semibold">{site.short}</p>
              <p className="text-[0.75rem] text-[#128c4a]">En ligne · répond rapidement</p>
            </div>
          </div>
          <p className="mt-3 text-[0.9rem] leading-snug text-ink-600">Une course, un devis, un transport médical ? Écrivez-nous, on vous répond tout de suite.</p>
          <a href={href} target="_blank" rel="noreferrer" onClick={dismiss} className="mt-3 inline-flex items-center gap-1.5 text-[0.88rem] font-medium text-[#128c4a] hover:underline">
            Démarrer la discussion →
          </a>
          {/* little tail pointing at the button */}
          <span className="absolute -bottom-1.5 right-7 size-3 rotate-45 bg-white ring-1 ring-ink-900/[0.06] [clip-path:polygon(100%_0,100%_100%,0_100%)]" />
        </div>
      )}

      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        aria-label={`Écrire sur WhatsApp au ${site.phone}`}
        className="group relative flex h-16 items-center rounded-full bg-[#25d366] text-white shadow-[0_1rem_2.5rem_-0.5rem_rgb(37_211_102/0.55)] transition-[background-color,box-shadow,transform] duration-500 ease-osmo hover:-translate-y-0.5 hover:bg-[#1fbe5b] hover:shadow-[0_1.25rem_3rem_-0.5rem_rgb(37_211_102/0.7)]"
      >
        {/* sonar ring */}
        <span className="pointer-events-none absolute inset-0 rounded-full bg-[#25d366] [animation:wa-sonar_2.8s_cubic-bezier(0,0,0.2,1)_infinite]" aria-hidden="true" />

        {/* label slides open on hover (width animated through a grid track) */}
        <span className="relative grid grid-cols-[0fr] transition-[grid-template-columns] duration-500 ease-osmo group-hover:grid-cols-[1fr] group-focus-visible:grid-cols-[1fr]">
          <span className="overflow-hidden">
            <span className="block pl-6 pr-1 whitespace-nowrap leading-tight">
              <span className="block text-[0.95rem] font-semibold">WhatsApp</span>
              <span className="block text-[0.72rem] text-white/85">Réponse rapide · 24h/24</span>
            </span>
          </span>
        </span>

        <span className="relative flex size-16 shrink-0 items-center justify-center">
          <Whatsapp className={cx('size-7 transition-transform duration-500 ease-osmo group-hover:rotate-[-8deg] group-hover:scale-110')} />
          {/* online dot */}
          <span className="absolute top-3 right-3 flex size-3">
            <span className="absolute inset-0 animate-ping rounded-full bg-white opacity-60" />
            <span className="relative size-3 rounded-full bg-white ring-2 ring-[#25d366]" />
          </span>
        </span>
      </a>
    </div>
  )
}
