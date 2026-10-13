import Lenis from 'lenis'
import { gsap, ScrollTrigger, prefersReducedMotion } from './gsap'

let lenis = null
const locks = new Set()

export function initSmoothScroll() {
  if (lenis || prefersReducedMotion()) return
  lenis = new Lenis({ lerp: 0.1 })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => lenis.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)
}

export const getLenis = () => lenis

export function lockScroll(key) {
  locks.add(key)
  lenis?.stop()
  document.documentElement.classList.add('is-locked')
}

export function unlockScroll(key) {
  locks.delete(key)
  if (locks.size) return
  lenis?.start()
  document.documentElement.classList.remove('is-locked')
}

export function scrollToTarget(target, offset = -24) {
  const el = typeof target === 'string' ? document.querySelector(target) : target
  if (!el) return
  if (lenis) lenis.scrollTo(el, { offset, duration: 1.4 })
  else el.scrollIntoView({ behavior: 'smooth' })
}

// Re-measuring every ScrollTrigger is a big main-thread job — coalesce bursts of requests into one
let refreshTimer = 0
export function requestRefresh(delay = 150) {
  clearTimeout(refreshTimer)
  refreshTimer = setTimeout(() => ScrollTrigger.refresh(), delay)
}
