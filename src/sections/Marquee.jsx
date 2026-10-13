import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from '../lib/gsap'
import { zones } from '../data/site'
import { cx } from '../lib/cx'

/*
  Tilted amber band of destinations. It drifts on its own and the scroll velocity pushes it faster
  (and flips its direction when you scroll back up).
*/
export default function Marquee({ items = zones, tone = 'amber', className }) {
  const root = useRef(null)
  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const track = root.current.querySelector('[data-track]')
      const loop = gsap.to(track, { xPercent: -50, duration: 38, ease: 'none', repeat: -1, paused: true })
      // One reusable tween for the speed (instead of two new tweens per scroll frame), and the loop
      // only runs while the band is on screen
      const speed = { v: 1 }
      const settle = gsap.to(speed, { v: 1, duration: 1.2, paused: true, onUpdate: () => loop.timeScale(speed.v) })
      const st = ScrollTrigger.create({
        trigger: root.current,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => (self.isActive ? loop.play() : loop.pause()),
        onUpdate: (self) => {
          const dir = self.direction
          speed.v = dir * (1 + Math.min(Math.abs(self.getVelocity()) / 220, 6))
          loop.timeScale(speed.v)
          settle.vars.v = dir
          settle.invalidate().restart()
        },
      })
      return () => st.kill()
    },
    { scope: root },
  )
  const row = [...items, ...items]
  return (
    <div ref={root} className={cx('relative z-10 overflow-hidden py-5', tone === 'amber' ? 'bg-amber text-ink-900' : 'bg-ink-800 text-paper', className)}>
      <div data-track className="flex w-max items-center">
        {row.map((z, i) => (
          <span key={i} className="flex items-center">
            <span className="display px-6 text-[clamp(2rem,4.5vw,3.8rem)] whitespace-nowrap">{z}</span>
            <svg viewBox="0 0 40 28" className="h-6 shrink-0 opacity-80" aria-hidden="true">
              <path d="M7 19 11 4h18l4 15z" fill="currentColor" />
              <rect x="2" y="20" width="36" height="6" rx="2" fill="currentColor" />
            </svg>
          </span>
        ))}
      </div>
    </div>
  )
}
