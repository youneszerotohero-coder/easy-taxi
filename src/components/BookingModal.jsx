import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { img } from '../lib/img'
import { createPortal } from 'react-dom'
import { gsap, prefersReducedMotion } from '../lib/gsap'
import { lockScroll, unlockScroll } from '../lib/scroll'
import { cx } from '../lib/cx'
import { submitBooking } from '../lib/api'
import { useBooking } from '../context/BookingContext'
import { site } from '../data/site'
import { emptyForm, flows } from './booking/steps'
import { Segmented } from './booking/fields'
import { ArrowLeft, ArrowRight, Car, Check, Close, Cross, Phone, Whatsapp } from './icons'
import { LogoMark } from './Logo'

/*
  The booking panel is born from the button that opened it (same choreography as ilhem's quote modal):
  1. a pill the size/colour of that button slides to the centre and widens (0.6s)
  2. it grows vertically into the full panel (0.9s @0.3s) while rows rise in
  Closing runs the other way and lands back on the button.
  Inside, the form is a slider: each step slides in from the direction of travel and its fields stagger.
*/

const PANEL = 'rgb(255, 255, 255)'
const PILL = 'rgb(11, 11, 12)' // fallback origin when no button is visible
const gutter = () => (window.innerWidth < 768 ? 8 : 24)

function measureFinal(contentEl) {
  const vw = document.documentElement.clientWidth
  const vh = window.innerHeight
  const g = gutter()
  const w = Math.min(1180, vw - g * 2)
  const h = Math.min(800, vh - g * 2)
  contentEl.style.width = `${w}px`
  contentEl.style.height = `${h}px`
  return { x: (vw - w) / 2, y: (vh - h) / 2, w, h }
}

function rectFrom(el) {
  if (!el?.isConnected || el.closest('[inert]')) return null
  const r = el.getBoundingClientRect()
  if (r.width < 4 || r.height < 4 || r.bottom < 0 || r.top > window.innerHeight) return null
  const cs = getComputedStyle(el)
  const bg = cs.backgroundColor
  return {
    x: r.left,
    y: r.top,
    w: r.width,
    h: r.height,
    radius: Math.min(parseFloat(cs.borderTopLeftRadius) || 6, r.height / 2),
    bg: !bg || bg === 'rgba(0, 0, 0, 0)' ? PILL : bg,
  }
}

function centrePill(box) {
  const w = 180
  const h = 48
  return { x: box.x + (box.w - w) / 2, y: box.y + (box.h - h) / 2, w, h, radius: 24, bg: PILL, fade: true }
}

// Short labels on phones so the switch never runs under the close button
const MODES = [
  {
    value: 'private',
    icon: Car,
    label: (
      <>
        <span className="sm:hidden">Privée</span>
        <span className="hidden sm:inline">Course privée</span>
      </>
    ),
  },
  {
    value: 'medical',
    icon: Cross,
    label: (
      <>
        <span className="sm:hidden">Médical</span>
        <span className="hidden sm:inline">Transport médical</span>
      </>
    ),
  },
]

export default function BookingModal() {
  const { open, prefill, origin, id, closeBooking } = useBooking()
  const [mounted, setMounted] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [step, setStep] = useState(0)
  const [reached, setReached] = useState(0)
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [reference, setReference] = useState('')
  const panel = useRef(null)
  const content = useRef(null)
  const backdrop = useRef(null)
  const body = useRef(null)
  const nextBtn = useRef(null)
  const tl = useRef(null)
  const prevStep = useRef(0)

  const steps = flows[form.mode]
  const current = steps[step]
  const last = step === steps.length - 1

  // Fresh form (with any prefill) every time the modal opens
  useEffect(() => {
    if (!open) return
    setMounted(true)
    const next = { ...emptyForm, mode: prefill?.mode ?? 'private', pickup: prefill?.pickup ?? '', dropoff: prefill?.dropoff ?? '' }
    const start = next.mode === 'private' && next.pickup && next.dropoff ? 1 : 0
    setForm(next)
    setErrors({})
    setStep(start)
    setReached(start)
    prevStep.current = start
    setStatus('idle')
  }, [open, id, prefill])

  const set = useCallback((patch, errPatch) => {
    setForm((f) => ({ ...f, ...patch }))
    setErrors((e) => {
      const n = { ...e }
      Object.keys(patch).forEach((k) => delete n[k])
      return errPatch ? { ...n, ...errPatch } : n
    })
  }, [])

  // OPEN
  useLayoutEffect(() => {
    if (!mounted || !open) return
    lockScroll('booking')
    const to = measureFinal(content.current)
    const from = rectFrom(origin) ?? centrePill(to)
    const items = panel.current.querySelectorAll('[data-q-item], [data-slide-active] [data-f-item]')

    tl.current?.kill()
    gsap.set(panel.current, { left: from.x, top: from.y, width: from.w, height: from.h, borderRadius: from.radius, backgroundColor: from.bg, autoAlpha: 1 })
    gsap.set(items, { y: '2rem', autoAlpha: 0 })

    tl.current = gsap
      .timeline({ defaults: { ease: 'osmo' }, onComplete: () => panel.current?.focus({ preventScroll: true }) })
      .to(backdrop.current, { autoAlpha: 1, duration: 0.6 }, 0)
      .to(panel.current, { left: to.x, width: to.w, top: to.y + to.h / 2 - from.h / 2, duration: 0.6 }, 0)
      .to(panel.current, { backgroundColor: PANEL, duration: 0.35, ease: 'power1.inOut' }, 0.05)
      .to(panel.current, { top: to.y, height: to.h, borderRadius: 28, duration: 0.9 }, 0.3)
      .to(items, { y: 0, duration: 0.9, stagger: 0.05 }, 0.3)
      .to(items, { autoAlpha: 1, duration: 0.5, stagger: 0.05, ease: 'power1.out' }, 0.38)
      .fromTo(panel.current.querySelector('[data-aside-img]'), { scale: 1.25 }, { scale: 1, duration: 1.6, ease: 'expo.out' }, 0.3)

    if (prefersReducedMotion()) tl.current.progress(1)
  }, [mounted, open, id, origin])

  // CLOSE
  useLayoutEffect(() => {
    if (!mounted || open) return
    const box = panel.current.getBoundingClientRect()
    const back = rectFrom(origin) ?? rectFrom(document.querySelector('[data-book-main]')) ?? centrePill({ x: box.left, y: box.top, w: box.width, h: box.height })
    const items = panel.current.querySelectorAll('[data-q-item], [data-slide-active] [data-f-item]')

    tl.current?.kill()
    tl.current = gsap
      .timeline({
        defaults: { ease: 'osmo' },
        onComplete: () => {
          setMounted(false)
          unlockScroll('booking')
          origin?.focus?.({ preventScroll: true })
        },
      })
      .to(items, { y: '2rem', autoAlpha: 0, duration: 0.45, stagger: { each: 0.03, from: 'end' } }, 0)
      .to(panel.current, { top: box.top + box.height / 2 - back.h / 2, height: back.h, borderRadius: back.radius, duration: 0.6 }, 0.1)
      .to(panel.current, { left: back.x, width: back.w, top: back.y, duration: 0.8 }, 0.35)
      .to(panel.current, { backgroundColor: back.bg, duration: 0.3, ease: 'power1.inOut' }, 0.75)
      .to(panel.current, { autoAlpha: 0, duration: 0.22, ease: 'power1.out' }, back.fade ? 0.55 : 1.1)
      .to(backdrop.current, { autoAlpha: 0, duration: 0.6 }, 0.3)

    if (prefersReducedMotion()) tl.current.progress(1)
  }, [mounted, open, origin])

  // Slides are shown/hidden by GSAP only (React never touches their visibility, so exits can animate)
  useLayoutEffect(() => {
    if (!mounted || !body.current) return
    body.current.querySelectorAll('[data-slide]').forEach((el, i) => gsap.set(el, { autoAlpha: i === prevStep.current ? 1 : 0, xPercent: 0 }))
  }, [mounted, form.mode, status, id])

  // SLIDE between steps — from the direction of travel
  useLayoutEffect(() => {
    if (!mounted || !body.current || status === 'sent') return
    const from = prevStep.current
    prevStep.current = step
    if (from === step) return
    const dir = step > from ? 1 : -1
    const slides = body.current.querySelectorAll('[data-slide]')
    const out = slides[from]
    const inc = slides[step]
    if (!inc) return
    const fields = inc.querySelectorAll('[data-f-item]')
    gsap.killTweensOf([out, inc, fields])
    gsap
      .timeline({ defaults: { ease: 'osmo' } })
      .to(out, { xPercent: -dir * 12, autoAlpha: 0, duration: 0.5, ease: 'power3.in' }, 0)
      .set(inc, { xPercent: 0, autoAlpha: 1 }, 0.2)
      .fromTo(fields, { x: dir * 90, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.85, stagger: 0.055 }, 0.2)
    inc.scrollTop = 0
    if (prefersReducedMotion()) gsap.globalTimeline.getChildren().forEach((t) => t.progress(1))
  }, [step, mounted, status])

  // MODE switch — the whole slide rises in again
  const switchMode = (mode) => {
    if (mode === form.mode) return
    const fields = body.current?.querySelectorAll('[data-slide-active] [data-f-item]')
    gsap.to(fields, {
      y: -24,
      autoAlpha: 0,
      duration: 0.3,
      stagger: 0.02,
      ease: 'power3.in',
      onComplete: () => {
        prevStep.current = 0
        setForm((f) => ({ ...f, mode, pickup: '', dropoff: '' }))
        setErrors({})
        setStep(0)
        setReached(0)
        requestAnimationFrame(() => {
          const inc = body.current?.querySelectorAll('[data-slide-active] [data-f-item]')
          gsap.fromTo(inc, { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.05, ease: 'osmo' })
        })
      },
    })
  }

  // Keyboard: Esc closes, Tab stays inside
  useEffect(() => {
    if (!mounted || !open) return
    const onKey = (e) => {
      if (e.key === 'Escape') closeBooking()
      if (e.key !== 'Tab') return
      const focusables = [...panel.current.querySelectorAll('button:not([disabled]), input, textarea, select, a[href]')].filter((el) => !el.closest('[inert]'))
      const first = focusables[0]
      const lastEl = focusables[focusables.length - 1]
      if (e.shiftKey && (document.activeElement === first || document.activeElement === panel.current)) {
        e.preventDefault()
        lastEl.focus()
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault()
        first.focus()
      }
    }
    const onResize = () => {
      tl.current?.progress(1)
      const to = measureFinal(content.current)
      gsap.set(panel.current, { left: to.x, top: to.y, width: to.w, height: to.h })
    }
    document.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    return () => {
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
    }
  }, [mounted, open, closeBooking])

  const shake = () => {
    gsap.fromTo(nextBtn.current, { x: -10 }, { x: 0, duration: 0.7, ease: 'elastic.out(1.2, 0.3)' })
    const slide = body.current?.querySelector('[data-slide-active]')
    const firstErr = slide?.querySelector('[aria-invalid="true"]')
    firstErr?.focus({ preventScroll: false })
  }

  const goTo = (i) => {
    if (i < 0 || i >= steps.length || i === step) return
    setStep(i)
    setReached((r) => Math.max(r, i))
  }

  const next = async (e) => {
    e?.preventDefault()
    if (status === 'sending') return
    const errs = current.validate(form)
    if (Object.keys(errs).length) {
      setErrors(errs)
      requestAnimationFrame(shake)
      return
    }
    if (!last) return goTo(step + 1)
    setStatus('sending')
    try {
      const res = await submitBooking(form)
      setReference(res.reference)
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  const restart = () => {
    setForm({ ...emptyForm, mode: form.mode })
    setErrors({})
    prevStep.current = 0
    setStep(0)
    setReached(0)
    setStatus('idle')
  }

  if (!mounted) return null
  const medical = form.mode === 'medical'

  return createPortal(
    <div className="fixed inset-0 z-[100]" role="presentation">
      <div ref={backdrop} onClick={closeBooking} className="invisible absolute inset-0 bg-ink-950/45 opacity-0 backdrop-blur-[10px]" />

      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-title"
        tabIndex={-1}
        className="invisible fixed overflow-hidden text-ink-900 opacity-0 shadow-[0_2.5rem_6rem_-1.5rem_rgba(11,11,12,0.45)] outline-none"
      >
        <button
          type="button"
          data-q-item
          onClick={closeBooking}
          aria-label="Fermer"
          className="group absolute z-20 flex size-11 items-center justify-center rounded-full bg-ink-900/[0.06] backdrop-blur transition-[background-color,border-radius] duration-300 ease-osmo hover:rounded-xl hover:bg-ink-900/[0.12] max-md:top-6 max-md:right-4 md:top-8 md:right-6"
        >
          <Close className="size-5 transition-transform duration-500 ease-osmo group-hover:rotate-90" />
        </button>

        <div ref={content} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="grid h-full grid-rows-[minmax(0,1fr)] gap-2 p-2 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.3fr)] md:gap-3">
            {/* ───────── Aside ───────── */}
            <aside data-q-item className="relative hidden overflow-hidden rounded-[1.4rem] text-white md:flex md:flex-col">
              <div data-aside-img className="absolute inset-0">
                <img {...img('/images/driver-hands.webp', '40vw')} alt="" loading="lazy" decoding="async" className={cx('absolute inset-0 size-full object-cover transition-opacity duration-700', medical ? 'opacity-0' : 'opacity-100')} />
                <img {...img('/images/care-nurse.webp', '40vw')} alt="" loading="lazy" decoding="async" className={cx('absolute inset-0 size-full object-cover transition-opacity duration-700', medical ? 'opacity-100' : 'opacity-0')} />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-ink-950/80 via-ink-950/55 to-ink-950/95" />
              <div className="relative flex h-full flex-col p-7 lg:p-8">
                <div className="flex items-center gap-2.5">
                  <LogoMark className="h-6 text-paper" />
                  <span className="eyebrow text-paper/70">{site.name}</span>
                </div>
                <h2 id="booking-title" className="display mt-8 text-[clamp(2.2rem,3.6vw,3.3rem)]">
                  {medical ? (
                    <>
                      Votre transport
                      <br />
                      <span className="text-care">conventionné.</span>
                    </>
                  ) : (
                    <>
                      Réservez
                      <br />
                      <span className="text-amber">votre course.</span>
                    </>
                  )}
                </h2>
                <p className="mt-4 max-w-[22rem] text-[0.95rem] leading-relaxed text-paper/65">
                  {medical ? 'Prise en charge CPAM, nous gérons les démarches. Réponse sous 15 minutes.' : 'Confirmation par téléphone en moins de 10 minutes, prix annoncé avant le départ.'}
                </p>

                {/* Step rail */}
                <ol className="mt-auto space-y-1 pt-8">
                  {steps.map((s, i) => {
                    const done = i < step || status === 'sent'
                    const active = i === step && status !== 'sent'
                    return (
                      <li key={s.key}>
                        <button
                          type="button"
                          disabled={i > reached || status === 'sent'}
                          onClick={() => goTo(i)}
                          className="group flex w-full items-center gap-3 rounded-xl py-1.5 text-left disabled:cursor-default"
                        >
                          <span
                            className={cx(
                              'relative flex size-7 shrink-0 items-center justify-center rounded-full text-[0.75rem] font-semibold transition-all duration-500 ease-osmo',
                              done && 'bg-amber text-ink-900',
                              active && 'bg-paper text-ink-900 animate-glow',
                              !done && !active && 'text-paper/50 ring-1 ring-white/20',
                            )}
                          >
                            {done ? <Check className="size-3.5" /> : i + 1}
                          </span>
                          <span className={cx('text-[0.95rem] transition-colors duration-300', active ? 'text-paper' : done ? 'text-paper/75 group-hover:text-paper' : 'text-paper/40')}>{s.title}</span>
                        </button>
                      </li>
                    )
                  })}
                </ol>

                <div className="mt-6 flex flex-wrap gap-2 border-t border-white/10 pt-5">
                  <a href={site.phoneHref} className="inline-flex h-10 items-center gap-2 rounded-full bg-white/10 px-4 text-[0.88rem] backdrop-blur transition-colors hover:bg-white/20">
                    <Phone className="size-4" /> {site.phone}
                  </a>
                  <a href={site.whatsapp} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center gap-2 rounded-full bg-[#25d366]/15 px-4 text-[0.88rem] text-[#5ce58f] transition-colors hover:bg-[#25d366]/25">
                    <Whatsapp className="size-4" /> WhatsApp
                  </a>
                </div>
              </div>
            </aside>

            {/* ───────── Form ───────── */}
            <div className="flex min-h-0 min-w-0 flex-col px-2 pt-3 pb-2 md:px-4 md:pt-5 md:pr-6">
              {status === 'sent' ? (
                <Success form={form} reference={reference} onClose={closeBooking} onAgain={restart} />
              ) : (
                <form onSubmit={next} noValidate className="flex min-h-0 flex-1 flex-col">
                  <div data-q-item className="pr-14 md:pr-16">
                    <Segmented value={form.mode} onChange={switchMode} options={MODES} className="max-w-[26rem]" />
                  </div>

                  <div data-q-item className="mt-5 short:mt-3">
                    <div className="flex items-baseline justify-between gap-4">
                      <p className="eyebrow text-amber-700">
                        Étape {String(step + 1).padStart(2, '0')} <span className="text-ink-400">/ {String(steps.length).padStart(2, '0')}</span>
                      </p>
                      <p className="eyebrow hidden text-ink-400 sm:block">{current.short}</p>
                    </div>
                    <div className="mt-3 h-[3px] overflow-hidden rounded-full bg-ink-900/[0.08]">
                      <div className="h-full rounded-full bg-amber transition-[width] duration-700 ease-osmo" style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
                    </div>
                    <StepHeading key={`${form.mode}-${current.key}`} title={current.title} desc={current.desc} />
                  </div>

                  {/* Slides */}
                  <div ref={body} className="relative mt-4 min-h-0 flex-1 short:mt-3">
                    {steps.map((s, i) => (
                      <div
                        key={`${form.mode}-${s.key}`}
                        data-slide
                        data-slide-active={i === step ? '' : undefined}
                        inert={i !== step}
                        data-lenis-prevent
                        className="no-scrollbar absolute inset-0 space-y-4 short:space-y-3 overflow-y-auto overscroll-contain px-0.5 pt-0.5 pb-2"
                      >
                        <s.Component form={form} set={set} errors={i === step ? errors : {}} />
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div data-q-item className="flex items-center justify-between gap-3 border-t border-ink-900/[0.08] pt-3">
                    <button
                      type="button"
                      onClick={() => goTo(step - 1)}
                      disabled={step === 0}
                      className="inline-flex h-12 items-center gap-2 rounded-full px-4 text-ink-700 transition-[opacity,color,background-color] hover:bg-ink-900/[0.05] hover:text-ink-900 disabled:pointer-events-none disabled:opacity-0"
                    >
                      <ArrowLeft className="size-4" /> Retour
                    </button>
                    {status === 'error' && <p className="text-[0.85rem] text-[#d93d42]">Envoi impossible, réessayez ou appelez-nous.</p>}
                    <button
                      ref={nextBtn}
                      type="submit"
                      className={cx(
                        'group inline-flex h-13 items-center gap-3 rounded-full pr-2 pl-6 font-medium transition-colors duration-300',
                        last ? 'bg-amber text-ink-900 hover:bg-amber-300' : 'bg-sky-600 text-white hover:bg-sky-700',
                      )}
                    >
                      {status === 'sending' ? 'Envoi en cours…' : last ? (medical ? 'Demander le transport' : 'Confirmer la réservation') : 'Continuer'}
                      <span className={cx('flex size-9 items-center justify-center rounded-full text-white', last ? 'bg-ink-900' : 'bg-white/20')}>
                        {status === 'sending' ? (
                          <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        ) : (
                          <ArrowRight className="size-4 transition-transform duration-500 ease-osmo group-hover:translate-x-0.5" />
                        )}
                      </span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}

/** Title that rolls in word by word whenever the step changes */
function StepHeading({ title, desc }) {
  const root = useRef(null)
  useLayoutEffect(() => {
    const words = root.current.querySelectorAll('[data-w]')
    const ctx = gsap.context(() => {
      gsap.from(words, { yPercent: 110, duration: 0.8, stagger: 0.05, ease: 'osmo', delay: 0.15 })
      gsap.from('[data-d]', { autoAlpha: 0, y: 8, duration: 0.6, delay: 0.3, ease: 'power2.out' })
    }, root)
    return () => ctx.revert()
  }, [])
  return (
    <div ref={root} className="mt-3 short:mt-2">
      <h3 className="display text-[clamp(1.6rem,2.6vw,2.3rem)] short:text-[1.6rem]">
        {title.split(' ').map((w, i) => (
          <span key={i} className="inline-block overflow-clip pb-[0.1em] align-bottom">
            <span data-w className="inline-block">
              {w}&nbsp;
            </span>
          </span>
        ))}
      </h3>
      <p data-d className="mt-1 text-[0.92rem] text-ink-500 short:hidden">
        {desc}
      </p>
    </div>
  )
}

function Success({ form, reference, onClose, onAgain }) {
  const root = useRef(null)
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-s-item]', { y: '1.5rem', autoAlpha: 0, duration: 0.9, ease: 'osmo', stagger: 0.07, delay: 0.15 })
      gsap.from('[data-s-ring]', { scale: 0.4, autoAlpha: 0, duration: 1, ease: 'expo.out' })
      gsap.fromTo('[data-s-check]', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.7, ease: 'power2.out', delay: 0.25 })
      gsap.fromTo('[data-s-road]', { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: 'expo.inOut', delay: 0.2 })
      gsap.fromTo('[data-s-car]', { left: '0%' }, { left: '100%', duration: 1.4, ease: 'expo.inOut', delay: 0.2 })
    }, root)
    return () => ctx.revert()
  }, [])
  const medical = form.mode === 'medical'
  return (
    <div ref={root} className="flex h-full flex-col justify-center py-6 md:pl-4">
      <span data-s-ring className="flex size-18 items-center justify-center rounded-full bg-amber text-ink-900">
        <svg viewBox="0 0 24 24" className="size-9" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path data-s-check pathLength="1" strokeDasharray="1" d="m5 12.5 4.5 4.5L19 7.5" />
        </svg>
      </span>
      <h3 data-s-item className="display mt-8 text-[clamp(2.2rem,4vw,3.6rem)]">
        Merci {form.firstName || ''} !<br />
        <span className="text-amber-600">{medical ? 'Demande transmise.' : 'Course enregistrée.'}</span>
      </h3>
      <p data-s-item className="mt-4 max-w-md text-ink-500">
        Nous vous appelons au {form.mode === 'private' ? form.dial + ' ' : ''}
        {form.phone} dans les prochaines minutes pour confirmer {medical ? 'la prise en charge.' : 'le prix et l’horaire.'}
      </p>
      <div data-s-item className="mt-8 max-w-md">
        <div className="relative h-px">
          <div data-s-road className="absolute inset-0 origin-left bg-gradient-to-r from-ink-900/10 via-amber/60 to-amber" />
          <span data-s-car className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber shadow-[0_0_1.2rem_0.3rem_rgb(255_179_26/0.6)]" />
        </div>
        <div className="mt-3 flex justify-between text-[0.85rem] text-ink-400">
          <span className="truncate pr-4">{form.pickup}</span>
          <span className="truncate pl-4 text-right">{form.dropoff}</span>
        </div>
      </div>
      <p data-s-item className="eyebrow mt-8 text-ink-400">
        Référence <span className="text-ink-900">{reference}</span>
      </p>
      <div data-s-item className="mt-8 flex flex-wrap gap-2">
        <button type="button" onClick={onClose} className="inline-flex h-12 items-center rounded-full bg-sky-600 px-6 font-medium text-white transition-colors hover:bg-sky-700">
          Terminer
        </button>
        <button type="button" onClick={onAgain} className="inline-flex h-12 items-center rounded-full px-6 text-ink-700 ring-1 ring-ink-900/20 transition-colors hover:bg-ink-900/[0.05] hover:text-ink-900">
          Nouvelle réservation
        </button>
      </div>
    </div>
  )
}
