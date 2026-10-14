import { useRef } from 'react'
import { img } from '../lib/img'
import { gsap, ScrollTrigger, SplitText, prefersReducedMotion } from '../lib/gsap'
import { useLazyGSAP } from '../lib/animReady'
import { cx } from '../lib/cx'

/*
  Small animation primitives shared by every section.
  All of them animate once when they scroll into view (start: top 85%) unless `immediate` is passed,
  in which case they wait for `delay` and play straight away (hero, page heads).
*/

/** Heading split into masked lines that slide up */
export function SplitHeading({ as: Tag = 'h2', className, children, delay = 0, immediate = false, stagger = 0.08, type = 'lines' }) {
  const ref = useRef(null)
  useLazyGSAP(
    () => {
      if (prefersReducedMotion()) return
      // autoSplit re-splits once the webfont lands (or on resize) and hands the tween over
      const split = SplitText.create(ref.current, {
        type: type === 'chars' ? 'lines,words,chars' : 'lines',
        mask: 'lines',
        linesClass: 'split-line',
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(type === 'chars' ? self.chars : self.lines, {
            yPercent: 115,
            rotate: type === 'chars' ? 6 : 2,
            duration: type === 'chars' ? 1.1 : 1.2,
            ease: 'expo.out',
            stagger: type === 'chars' ? 0.018 : stagger,
            delay,
            scrollTrigger: immediate ? undefined : { trigger: ref.current, start: 'top 88%', once: true },
          }),
      })
      return () => split.revert()
    },
    { scope: ref },
  )
  return (
    <Tag ref={ref} className={cx(className)}>
      {children}
    </Tag>
  )
}

/** Children marked [data-reveal] fade & rise in, staggered */
export function Reveal({ as: Tag = 'div', className, children, y = 40, stagger = 0.08, delay = 0, immediate = false, ...props }) {
  const ref = useRef(null)
  useLazyGSAP(
    () => {
      if (prefersReducedMotion()) return
      const items = ref.current.querySelectorAll('[data-reveal]')
      gsap.from(items.length ? items : ref.current, {
        y,
        autoAlpha: 0,
        duration: 1.1,
        ease: 'expo.out',
        stagger,
        delay,
        scrollTrigger: immediate ? undefined : { trigger: ref.current, start: 'top 85%', once: true },
      })
    },
    { scope: ref },
  )
  return (
    <Tag ref={ref} className={className} {...props}>
      {children}
    </Tag>
  )
}

/** Image revealed by a clip that opens upward, then drifts with a scrubbed parallax */
export function ParallaxImage({ src, alt = '', className, imgClassName, speed = 12, reveal = true, from = 'bottom', sizes = '(min-width: 1024px) 50vw, 100vw', children }) {
  const ref = useRef(null)
  useLazyGSAP(
    () => {
      const img = ref.current.querySelector('img')
      if (prefersReducedMotion()) return
      gsap.fromTo(img, { yPercent: -speed }, { yPercent: speed, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true } })
      if (!reveal) return
      const clip = { bottom: 'inset(100% 0% 0% 0%)', left: 'inset(0% 100% 0% 0%)', right: 'inset(0% 0% 0% 100%)', center: 'inset(18% 18% 18% 18%)' }[from]
      gsap
        .timeline({ scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true } })
        .fromTo(ref.current, { clipPath: clip }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut' })
        .from(img, { scale: 1.35, duration: 1.8, ease: 'expo.out' }, 0.1)
    },
    { scope: ref },
  )
  return (
    <div ref={ref} className={cx('relative overflow-hidden', className)}>
      <img {...img(src, sizes)} alt={alt} loading="lazy" decoding="async" className={cx('absolute -inset-y-[14%] inset-x-0 h-[128%] w-full object-cover', imgClassName)} />
      {children}
    </div>
  )
}

/** Number that counts up when visible */
export function Counter({ value, decimals = 0, suffix = '', className }) {
  const ref = useRef(null)
  useLazyGSAP(
    () => {
      const obj = { v: 0 }
      const write = () => (ref.current.textContent = obj.v.toFixed(decimals).replace('.', ','))
      if (prefersReducedMotion()) {
        obj.v = value
        return write()
      }
      write()
      gsap.to(obj, { v: value, duration: 2, ease: 'expo.out', onUpdate: write, scrollTrigger: { trigger: ref.current, start: 'top 90%', once: true } })
    },
    { scope: ref },
  )
  return (
    <span className={className}>
      <span ref={ref}>0</span>
      {suffix}
    </span>
  )
}

/** Element drifts toward the pointer while hovered */
export function Magnetic({ children, strength = 0.35, className }) {
  const ref = useRef(null)
  useLazyGSAP(
    () => {
      const el = ref.current
      if (prefersReducedMotion() || matchMedia('(hover: none)').matches) return
      const xTo = gsap.quickTo(el, 'x', { duration: 0.8, ease: 'elastic.out(1, 0.4)' })
      const yTo = gsap.quickTo(el, 'y', { duration: 0.8, ease: 'elastic.out(1, 0.4)' })
      const move = (e) => {
        const r = el.getBoundingClientRect()
        xTo((e.clientX - r.left - r.width / 2) * strength)
        yTo((e.clientY - r.top - r.height / 2) * strength)
      }
      const leave = () => {
        xTo(0)
        yTo(0)
      }
      el.addEventListener('pointermove', move)
      el.addEventListener('pointerleave', leave)
      return () => {
        el.removeEventListener('pointermove', move)
        el.removeEventListener('pointerleave', leave)
      }
    },
    { scope: ref },
  )
  return (
    <div ref={ref} className={cx('inline-block', className)}>
      {children}
    </div>
  )
}

/** Paragraph whose words light up one by one as you scroll through it */
export function ScrubText({ text, className, highlight = [] }) {
  const ref = useRef(null)
  useLazyGSAP(
    () => {
      const words = ref.current.querySelectorAll('[data-word]')
      if (prefersReducedMotion()) return gsap.set(words, { opacity: 1 })
      gsap.fromTo(words, { opacity: 0.16 }, { opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top 80%', end: 'bottom 45%', scrub: true } })
    },
    { scope: ref },
  )
  return (
    <p ref={ref} className={className}>
      {text.split(' ').map((w, i) => (
        <span key={i} data-word className={cx('inline', highlight.includes(i) && 'text-amber-600')}>
          {w}{' '}
        </span>
      ))}
    </p>
  )
}

export { ScrollTrigger }
