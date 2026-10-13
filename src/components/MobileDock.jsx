import { useLayoutEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../lib/gsap'
import { introDone } from '../lib/intro'
import { useBooking } from '../context/BookingContext'
import { site } from '../data/site'
import { ArrowRight, Whatsapp } from './icons'

// Thumb-reach bar on phones: WhatsApp + booking (the navbar button is hidden below `sm`)
export default function MobileDock() {
  const { openBooking } = useBooking()
  const ref = useRef(null)
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    gsap.set(ref.current, { yPercent: 150 })
    introDone.then(() => gsap.to(ref.current, { yPercent: 0, duration: 1.2, ease: 'expo.out', delay: 1.2 }))
  }, [])
  return (
    <div ref={ref} className="fixed inset-x-3 bottom-3 z-50 flex gap-2 rounded-full bg-white/85 p-1.5 shadow-[0_1rem_2.5rem_-0.5rem_rgba(11,11,12,0.3)] ring-1 ring-ink-900/[0.08] backdrop-blur-xl sm:hidden">
      <a
        href={site.whatsapp}
        target="_blank"
        rel="noreferrer"
        className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#25d366] font-medium text-white transition-colors active:bg-[#1ebe5b]"
      >
        <Whatsapp className="size-5" /> WhatsApp
      </a>
      <button type="button" onClick={(e) => openBooking(null, e.currentTarget)} className="flex h-12 shrink-0 items-center gap-3 rounded-full bg-amber pr-1.5 pl-5 font-medium text-ink-900">
        Réserver
        <span className="flex size-9 items-center justify-center rounded-full bg-ink-900 text-white">
          <ArrowRight className="size-4" />
        </span>
      </button>
    </div>
  )
}
