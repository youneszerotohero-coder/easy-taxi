import { useLayoutEffect, useRef, useState } from 'react'
import { gsap, prefersReducedMotion } from '../lib/gsap'
import { lockScroll, requestRefresh, unlockScroll } from '../lib/scroll'
import { finishIntro } from '../lib/intro'
import { LogoMark } from './Logo'
import { site } from '../data/site'

/*
  First-load intro: the roof sign lights up, a meter counts to 100 while headlights sweep the road,
  then the screen splits along the amber line like two doors and the hero rolls in behind it.
*/
// Plays once per browser session — reloading or coming back goes straight to the page.
// Read at module load so React's double-invoked effects (dev) can't mark it as seen early.
const firstVisit = (() => {
  try {
    const seen = sessionStorage.getItem('intro-seen') === '1'
    sessionStorage.setItem('intro-seen', '1')
    return !seen
  } catch {
    return true
  }
})()

export default function Preloader() {
  const root = useRef(null)
  const num = useRef(null)
  const [gone, setGone] = useState(false)

  useLayoutEffect(() => {
    document.getElementById('splash')?.remove() // static first-paint splash from index.html
    if (!firstVisit || prefersReducedMotion()) {
      finishIntro()
      setGone(true)
      return
    }
    lockScroll('intro')
    const q = gsap.utils.selector(root)
    const meter = { v: 0 }

    // The doors open as soon as the hero photo and fonts are ready (min ~1.4s for the animation, max 3s)
    const hero = document.querySelector('[data-h-img]')
    const ready = Promise.race([
      Promise.all([document.fonts?.ready, hero && !hero.complete ? new Promise((r) => hero.addEventListener('load', r, { once: true })) : null]),
      new Promise((r) => setTimeout(r, 3000)),
    ])

    const ctx = gsap.context(() => {
      const tl = gsap
        .timeline({
          defaults: { ease: 'osmo' },
          onComplete: () => {
            unlockScroll('intro')
            setGone(true)
            requestRefresh(0) // re-measure pins now that the page scrolls normally again
          },
        })
        .from(q('[data-p-mark]'), { scale: 0.6, autoAlpha: 0, duration: 0.7, ease: 'back.out(2)' }, 0)
        .fromTo(q('[data-p-glow]'), { autoAlpha: 0, scale: 0.5 }, { autoAlpha: 1, scale: 1, duration: 1, ease: 'expo.out' }, 0.2)
        .from(q('[data-p-text]'), { yPercent: 110, duration: 0.8, stagger: 0.06 }, 0.15)
        .to(meter, {
          v: 100,
          duration: 1.2,
          ease: 'power2.inOut',
          onUpdate: () => (num.current.textContent = String(Math.round(meter.v)).padStart(3, '0')),
        }, 0.15)
        .fromTo(q('[data-p-bar]'), { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: 'power2.inOut' }, 0.15)
        .fromTo(q('[data-p-dash]'), { backgroundPositionX: '0rem' }, { backgroundPositionX: '-16rem', duration: 1.4, ease: 'power1.in' }, 0.15)
        .addPause(1.35, () => ready.then(() => tl.play()))
        .to(q('[data-p-content]'), { yPercent: -30, autoAlpha: 0, duration: 0.5, ease: 'power3.in' }, 1.35)
        .fromTo(q('[data-p-line]'), { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'expo.inOut' }, 1.45)
        .call(finishIntro, null, 1.85)
        .to(q('[data-p-top]'), { yPercent: -100, duration: 1, ease: 'expo.inOut' }, 1.85)
        .to(q('[data-p-bottom]'), { yPercent: 100, duration: 1, ease: 'expo.inOut' }, 1.85)
        .to(q('[data-p-line]'), { autoAlpha: 0, duration: 0.4 }, 2.05)
    }, root)
    return () => ctx.revert()
  }, [])

  if (gone) return null
  return (
    <div ref={root} className="fixed inset-0 z-[200]" aria-hidden="true">
      <div data-p-top className="absolute inset-x-0 top-0 h-1/2 bg-white" />
      <div data-p-bottom className="absolute inset-x-0 bottom-0 h-1/2 bg-white" />
      <div data-p-line className="absolute inset-x-0 top-1/2 h-px bg-amber shadow-[0_0_2rem_0.25rem_rgb(255_179_26/0.6)]" />

      <div data-p-content className="absolute inset-0 flex flex-col items-center justify-center px-6 text-ink-900">
        <div className="relative">
          <span data-p-glow className="absolute inset-0 -m-10 rounded-full bg-amber/30 blur-3xl" />
          <span data-p-mark className="relative block text-ink-900">
            <LogoMark className="h-16" />
          </span>
        </div>
        <div className="mt-8 overflow-hidden">
          <p data-p-text className="display text-[2rem] sm:text-[2.6rem]">
            {site.name}
          </p>
        </div>
        <div className="overflow-hidden">
          <p data-p-text className="eyebrow mt-3 text-ink-400">
            Beauvais · Oise · 24h/24
          </p>
        </div>

        <div className="absolute inset-x-6 bottom-10 sm:inset-x-12">
          <div className="flex items-end justify-between">
            <span className="eyebrow text-ink-400">Préparation du véhicule</span>
            <span ref={num} className="display text-[3.5rem] text-amber-600 tabular-nums sm:text-[5rem]">
              000
            </span>
          </div>
          <div className="relative mt-4 h-[3px] overflow-hidden rounded-full bg-ink-900/[0.06]">
            <div data-p-bar className="absolute inset-0 origin-left bg-amber" />
          </div>
          <div data-p-dash className="road-dash mt-3 h-[2px] text-ink-900/15" />
        </div>
      </div>
    </div>
  )
}
