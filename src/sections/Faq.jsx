import { useLayoutEffect, useRef, useState } from 'react'
import { gsap, prefersReducedMotion } from '../lib/gsap'
import { faq, payments } from '../data/site'
import { Reveal, SplitHeading } from '../components/anim'
import { Bank, Card, Cash, Plus } from '../components/icons'
import { cx } from '../lib/cx'

const payIcons = [Card, Cash, Bank]

function Row({ item, open, onToggle, i }) {
  const body = useRef(null)
  const mounted = useRef(false)

  // Animate on every change of `open` (also when another row opening closes this one)
  useLayoutEffect(() => {
    const el = body.current
    if (!mounted.current) {
      mounted.current = true
      el.style.height = open ? 'auto' : '0px' // plain style: no forced layout read at load
      return
    }
    const d = prefersReducedMotion() ? 0 : 1
    if (open) {
      gsap.fromTo(el, { height: 0 }, { height: 'auto', duration: 0.8 * d, ease: 'osmo' })
      gsap.fromTo(el.firstChild, { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6 * d, ease: 'osmo', delay: 0.1 * d })
    } else {
      gsap.to(el, { height: 0, duration: 0.6 * d, ease: 'osmo' })
      gsap.to(el.firstChild, { y: -8, autoAlpha: 0, duration: 0.4 * d, ease: 'power2.in' })
    }
  }, [open])

  return (
    <li data-reveal className="border-b border-ink-900/10">
      <button type="button" onClick={onToggle} aria-expanded={open} className="group flex w-full items-center gap-5 py-7 text-left">
        <span className="eyebrow w-8 text-ink-400">0{i + 1}</span>
        <span className={cx('flex-1 font-display text-[clamp(1.2rem,2vw,1.6rem)] font-medium tracking-tight transition-colors', open ? 'text-amber-700' : 'group-hover:text-amber-700')}>{item.q}</span>
        <span className={cx('flex size-10 shrink-0 items-center justify-center rounded-full transition-all duration-500 ease-osmo', open ? 'rotate-45 bg-amber text-ink-900' : 'bg-ink-900/[0.05]')}>
          <Plus className="size-4" />
        </span>
      </button>
      <div ref={body} className="overflow-hidden">
        <p className="max-w-2xl pb-8 pl-13 text-ink-500">{item.a}</p>
      </div>
    </li>
  )
}

export default function Faq() {
  const [open, setOpen] = useState(0)
  return (
    <section id="faq" className="bg-white px-5 py-28 text-ink-900 md:px-10 md:py-40">
      <div className="mx-auto grid max-w-[1440px] gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div>
          <p className="eyebrow text-amber-700">(08) — Questions fréquentes</p>
          <SplitHeading className="display mt-5 text-[clamp(2.6rem,5vw,4.8rem)]">
            Tout ce qu’il faut savoir avant de monter.
          </SplitHeading>
          <Reveal className="mt-12 grid gap-2">
            <p data-reveal className="eyebrow mb-2 text-ink-400">
              Moyens de paiement
            </p>
            {payments.map((p, i) => {
              const Icon = payIcons[i]
              return (
                <div data-reveal key={p.title} className="flex items-center gap-4 rounded-2xl bg-paper p-4 ring-1 ring-ink-900/[0.05]">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-amber/20 text-amber-700">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <p className="font-medium">{p.title}</p>
                    <p className="text-[0.9rem] text-ink-500">{p.text}</p>
                  </div>
                </div>
              )
            })}
          </Reveal>
        </div>
        <Reveal as="ul" className="border-t border-ink-900/10" stagger={0.06}>
          {faq.map((item, i) => (
            <Row key={item.q} item={item} i={i} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
          ))}
        </Reveal>
      </div>
    </section>
  )
}
