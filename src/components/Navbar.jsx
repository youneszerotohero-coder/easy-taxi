import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router'
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/gsap'
import { lockScroll, unlockScroll } from '../lib/scroll'
import { introDone } from '../lib/intro'
import { cx } from '../lib/cx'
import { useBooking } from '../context/BookingContext'
import { featuredServices, site } from '../data/site'
import { TLink } from '../transition/PageTransition'
import Logo from './Logo'
import Button from './Button'
import { ArrowRight, Phone, Whatsapp } from './icons'

const links = [
  { label: 'Services', to: '/#services' },
  { label: 'Médical', to: '/#medical' },
  { label: 'Flotte', to: '/#flotte' },
  { label: 'Destinations', to: '/#destinations' },
  { label: 'FAQ', to: '/#faq' },
]

export default function Navbar() {
  const { openBooking } = useBooking()
  const root = useRef(null)
  const bar = useRef(null)
  const menu = useRef(null)
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  // Over the home page's night photo (before the bar turns into white glass) the bar uses white text
  const onDark = !scrolled && !open && pathname === '/'

  // Drops in after the intro, then stays pinned to the top; scrolling only switches it to white glass
  useLayoutEffect(() => {
    // Fires only when crossing 40px instead of on every scroll frame
    const st = ScrollTrigger.create({ start: 40, end: 'max', onToggle: (self) => setScrolled(self.isActive) })
    if (!prefersReducedMotion()) {
      gsap.set(bar.current, { yPercent: -160 })
      introDone.then(() => gsap.to(bar.current, { yPercent: 0, duration: 1.2, ease: 'expo.out', delay: 0.5 }))
    }
    return () => st.kill()
  }, [])

  // Full-screen menu (mobile & tablet)
  useEffect(() => {
    const m = menu.current
    if (!m) return
    const items = m.querySelectorAll('[data-m-item]')
    if (open) {
      lockScroll('menu')
      gsap
        .timeline({ defaults: { ease: 'osmo' } })
        .set(m, { display: 'flex' })
        .fromTo(m, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.8 })
        .fromTo(items, { yPercent: 120, rotate: 4 }, { yPercent: 0, rotate: 0, duration: 0.9, stagger: 0.05, ease: 'expo.out' }, 0.25)
    } else if (m.style.display === 'flex') {
      gsap
        .timeline({ defaults: { ease: 'osmo' }, onComplete: () => unlockScroll('menu') })
        .to(items, { yPercent: -120, duration: 0.4, stagger: 0.02, ease: 'power3.in' })
        .to(m, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.7 }, 0.15)
        .set(m, { display: 'none' })
    }
  }, [open])

  const book = (e) => {
    const origin = e.currentTarget.closest('[data-menu]') ? root.current.querySelector('[data-book-main]') : e.currentTarget
    setOpen(false)
    openBooking(null, origin)
  }

  return (
    <header ref={root}>
      <div ref={bar} className="fixed inset-x-0 top-0 z-[60] px-3 pt-3 md:px-5 md:pt-4">
        <nav
          className={cx(
            'mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 rounded-full pr-2 pl-5 transition-[background-color,box-shadow,backdrop-filter] duration-500',
            scrolled || open ? 'bg-white/80 shadow-[0_1rem_2.5rem_-1rem_rgba(11,11,12,0.18)] ring-1 ring-ink-900/[0.06] backdrop-blur-xl' : 'bg-transparent',
          )}
        >
          <TLink to="/" aria-label={`${site.name} — accueil`} onClick={() => setOpen(false)} className={cx('transition-colors duration-500', onDark ? 'text-white' : 'text-ink-900')}>
            <Logo />
          </TLink>

          <ul className="hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <li key={l.to}>
                <TLink to={l.to} className={cx('group relative block overflow-hidden rounded-full px-4 py-2 text-[0.93rem] transition-colors duration-500', onDark ? 'text-white/80 hover:text-white' : 'text-ink-900/70 hover:text-ink-900')}>
                  <span className="block transition-transform duration-500 ease-osmo group-hover:-translate-y-[150%]">{l.label}</span>
                  <span className="absolute inset-x-4 top-2 block translate-y-[150%] text-amber-600 transition-transform duration-500 ease-osmo group-hover:translate-y-0" aria-hidden="true">
                    {l.label}
                  </span>
                </TLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <a href={site.phoneHref} className={cx('hidden h-11 items-center gap-2 rounded-full px-4 text-[0.92rem] transition-colors duration-500 xl:inline-flex', onDark ? 'text-white/85 hover:text-amber' : 'text-ink-900/75 hover:text-amber-700')}>
              <span className="relative flex size-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-care opacity-60" />
                <span className="relative size-2 rounded-full bg-care" />
              </span>
              {site.phone}
            </a>
            <span className="hidden sm:block">
              <Button data-book-main onClick={book} size="md">
                Réserver
              </Button>
            </span>
            <button
              type="button"
              aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
              className={cx('relative flex size-11 items-center justify-center rounded-full transition-colors duration-500 lg:hidden', onDark ? 'bg-white/15 hover:bg-white/25' : 'bg-ink-900/[0.06] hover:bg-ink-900/[0.12]')}
            >
              <span className={cx('absolute h-[1.5px] w-5 transition-[transform,background-color] duration-500 ease-osmo', onDark ? 'bg-white' : 'bg-ink-900', open ? 'rotate-45' : '-translate-y-[4px]')} />
              <span className={cx('absolute h-[1.5px] w-5 transition-[transform,background-color] duration-500 ease-osmo', onDark ? 'bg-white' : 'bg-ink-900', open ? '-rotate-45' : 'translate-y-[4px]')} />
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile menu */}
      <div ref={menu} data-menu className="fixed inset-0 z-[55] hidden flex-col bg-white px-5 pt-28 pb-8 text-ink-900" inert={!open}>
        <ul className="space-y-1">
          {links.map((l, i) => (
            <li key={l.to} className="overflow-hidden">
              <TLink data-m-item to={l.to} onClick={() => setOpen(false)} className="flex items-baseline gap-4 py-1">
                <span className="eyebrow text-amber-700">0{i + 1}</span>
                <span className="display text-[clamp(2.6rem,11vw,4.5rem)]">{l.label}</span>
              </TLink>
            </li>
          ))}
        </ul>
        <div className="mt-8 overflow-hidden">
          <div data-m-item className="flex flex-wrap gap-2">
            {featuredServices.slice(0, 4).map((s) => (
              <TLink key={s.slug} to={`/services/${s.slug}`} onClick={() => setOpen(false)} className="rounded-full bg-ink-900/[0.05] px-4 py-2 text-[0.9rem] text-ink-900/75">
                {s.short}
              </TLink>
            ))}
          </div>
        </div>
        <div className="mt-auto overflow-hidden">
          <div data-m-item className="grid gap-2">
            <button type="button" onClick={book} className="flex h-14 items-center justify-between rounded-full bg-amber pr-2 pl-6 font-medium text-ink-900">
              Réserver une course
              <span className="flex size-10 items-center justify-center rounded-full bg-ink-900 text-white">
                <ArrowRight className="size-4" />
              </span>
            </button>
            <div className="grid grid-cols-2 gap-2">
              <a href={site.phoneHref} className="flex h-12 items-center justify-center gap-2 rounded-full bg-ink-900/[0.06]">
                <Phone className="size-4" /> Appeler
              </a>
              <a href={site.whatsapp} className="flex h-12 items-center justify-center gap-2 rounded-full bg-[#25d366]/12 text-[#128c4a]">
                <Whatsapp className="size-4" /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
