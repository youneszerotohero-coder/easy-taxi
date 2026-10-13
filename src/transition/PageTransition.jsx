import { createContext, useCallback, useContext, useLayoutEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { useLocation, useNavigate, useNavigationType } from 'react-router'
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/gsap'
import { getLenis, lockScroll, scrollToTarget, unlockScroll } from '../lib/scroll'
import { serviceBySlug, site } from '../data/site'
import { LogoMark } from '../components/Logo'
import { loadRoute } from '../routes'

/*
  Page transition — "night shift":
  LEAVE  five ink columns rise from the bottom one after another, an amber headlight line races across
         the middle and the destination name rises in above it. The route swaps while covered.
  ENTER  the name lifts away, the columns retract upward in the same order and the new page glides up.
*/

const COLS = 5

// Pages read this to time their entrance: longer right after a transition so it plays as the curtain lifts
export const intro = { delay: 0.2 }

const TransitionContext = createContext(null)
export const usePageTransition = () => useContext(TransitionContext)

const jumpTo = (y) => {
  getLenis()?.scrollTo(y, { immediate: true, force: true })
  window.scrollTo(0, y)
}

function describe(url) {
  const [section, slug] = url.pathname.split('/').filter(Boolean)
  if (!section) return { eyebrow: 'Bienvenue à bord', title: site.name }
  if (section === 'services') {
    const s = serviceBySlug(slug)
    if (s) return { eyebrow: `Service ${s.index}`, title: s.title }
  }
  return { eyebrow: 'Hors itinéraire', title: 'Page introuvable' }
}

export function TransitionProvider({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const navType = useNavigationType()
  const root = useRef(null)
  const busy = useRef(false)
  const pending = useRef(null)
  const [text, setText] = useState({ eyebrow: '', title: '' })

  const q = (sel) => root.current.querySelectorAll(sel)

  const cover = useCallback((words, onCovered) => {
    flushSync(() => setText(words))
    lockScroll('transition')
    gsap.set(root.current, { display: 'block' })
    gsap.set(q('[data-t-col]'), { scaleY: 0, transformOrigin: '50% 100%' })
    gsap.set(q('[data-t-word]'), { yPercent: 120, rotate: 6 })
    gsap.set(q('[data-t-eyebrow]'), { autoAlpha: 0, y: 12 })
    gsap.set(q('[data-t-line]'), { scaleX: 0, transformOrigin: '0% 50%' })
    gsap.set(q('[data-t-light]'), { xPercent: -100, left: '0%', autoAlpha: 1 })
    gsap.set(q('[data-t-mark]'), { scale: 0.4, autoAlpha: 0, rotate: -12 })

    gsap
      .timeline({ defaults: { ease: 'osmo' } })
      .to('[data-page]', { y: '-6vh', scale: 0.98, duration: 0.9, ease: 'power2.inOut' }, 0)
      .to(q('[data-t-col]'), { scaleY: 1, duration: 0.7, stagger: 0.055 }, 0)
      .to(q('[data-t-line]'), { scaleX: 1, duration: 0.9, ease: 'expo.inOut' }, 0.25)
      .to(q('[data-t-light]'), { left: '100%', duration: 0.9, ease: 'expo.inOut' }, 0.25)
      .to(q('[data-t-mark]'), { scale: 1, rotate: 0, autoAlpha: 1, duration: 0.7, ease: 'back.out(2)' }, 0.4)
      .to(q('[data-t-eyebrow]'), { autoAlpha: 1, y: 0, duration: 0.6 }, 0.45)
      .to(q('[data-t-word]'), { yPercent: 0, rotate: 0, duration: 0.8, ease: 'expo.out', stagger: 0.045 }, 0.45)
      .call(
        () => {
          unlockScroll('transition')
          intro.delay = 0.55
          onCovered()
        },
        null,
        1.05,
      )
  }, [])

  const go = useCallback(
    (to) => {
      const url = new URL(to, window.location.href)
      if (url.origin !== window.location.origin) {
        window.location.href = to
        return
      }
      const here = window.location
      // Same page: anchors scroll smoothly
      if (url.pathname === here.pathname) {
        if (url.hash) scrollToTarget(url.hash)
        else if (getLenis()) getLenis().scrollTo(0, { duration: 1.4 })
        else window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }
      if (busy.current) return
      busy.current = true
      const swap = () => {
        jumpTo(0)
        pending.current = { url }
        navigate(url.pathname + url.search + url.hash)
      }
      // Start fetching the destination's code now; swap once it's here (the curtain hides the wait)
      const ready = loadRoute(url.pathname)
      const swapWhenReady = () => ready.then(swap, swap)
      if (prefersReducedMotion()) return swapWhenReady()
      cover(describe(url), swapWhenReady)
    },
    [navigate, cover],
  )

  // ENTER — runs after the new route has rendered
  useLayoutEffect(() => {
    const p = pending.current
    if (!p) {
      if (navType === 'POP') jumpTo(0)
      return
    }
    pending.current = null
    const target = p.url?.hash && document.querySelector(p.url.hash)
    if (target) {
      // The leave animation left the page wrapper scaled (0.98) and shifted — clear that and measure pins
      // first, otherwise an anchor deep in the page is off by hundreds of pixels
      gsap.set('[data-page]', { clearProps: 'transform' })
      ScrollTrigger.refresh()
      jumpTo(target.getBoundingClientRect().top + window.scrollY - 24)
    }

    const done = () => {
      gsap.set(root.current, { display: 'none' })
      busy.current = false
      intro.delay = 0.2
      getLenis()?.resize()
      ScrollTrigger.refresh()
    }
    if (prefersReducedMotion()) return done()

    gsap
      .timeline({ defaults: { ease: 'osmo' }, delay: 0.1, onComplete: done })
      .to(q('[data-t-word]'), { yPercent: -120, duration: 0.45, ease: 'power3.in', stagger: 0.03 }, 0)
      .to(q('[data-t-eyebrow], [data-t-mark]'), { autoAlpha: 0, y: -10, duration: 0.35, ease: 'power3.in' }, 0)
      .to(q('[data-t-line]'), { scaleX: 0, transformOrigin: '100% 50%', duration: 0.6, ease: 'expo.in' }, 0)
      .to(q('[data-t-light]'), { autoAlpha: 0, duration: 0.2 }, 0)
      .set(q('[data-t-col]'), { transformOrigin: '50% 0%' }, 0.3)
      .to(q('[data-t-col]'), { scaleY: 0, duration: 0.8, stagger: 0.055 }, 0.3)
      .fromTo('[data-page]', { y: '12vh', scale: 1 }, { y: 0, duration: 1.2, ease: 'expo.out', clearProps: 'transform' }, 0.35)
  }, [location.key, navType])

  return (
    <TransitionContext.Provider value={{ go }}>
      {children}
      <div ref={root} className="pointer-events-auto fixed inset-0 z-[120] hidden" aria-hidden="true">
        <div className="absolute inset-0 flex">
          {Array.from({ length: COLS }).map((_, i) => (
            <div key={i} data-t-col className="-mx-px h-full flex-1 bg-amber" />
          ))}
        </div>
        <div className="absolute inset-x-0 top-1/2 h-px">
          <div data-t-line className="absolute inset-0 bg-gradient-to-r from-transparent via-ink-900 to-ink-900" />
          <div data-t-light className="absolute top-1/2 h-24 w-56 -translate-y-1/2 rounded-full bg-white/70 blur-2xl" />
        </div>
        <div className="absolute inset-x-4 bottom-1/2 mb-8 flex flex-col items-center text-center">
          <span data-t-mark className="mb-6 text-ink-900">
            <LogoMark className="h-10" />
          </span>
          <span data-t-eyebrow className="eyebrow mb-4 text-ink-900/60">
            {text.eyebrow}
          </span>
          <span className="display text-[clamp(2.4rem,7vw,6rem)] text-ink-900">
            {text.title.split(' ').map((w, i) => (
              <span key={i} className="inline-block overflow-clip pb-[0.08em] align-bottom">
                <span data-t-word className="inline-block">
                  {w}&nbsp;
                </span>
              </span>
            ))}
          </span>
        </div>
      </div>
    </TransitionContext.Provider>
  )
}

/** Internal link that plays the page transition */
export function TLink({ to, onClick, children, ...props }) {
  const { go } = usePageTransition()
  return (
    <a
      href={to}
      onClick={(e) => {
        onClick?.(e)
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
        e.preventDefault()
        go(to)
      }}
      {...props}
    >
      {children}
    </a>
  )
}
