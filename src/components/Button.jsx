import { forwardRef, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { cx } from '../lib/cx'
import { ArrowUpRight } from './icons'
import { TLink } from '../transition/PageTransition'

const variants = {
  amber: 'bg-amber text-ink-900 hover:bg-amber-300',
  dark: 'bg-ink-800 text-paper hover:bg-ink-700',
  glass: 'bg-white/[0.08] text-paper backdrop-blur-md hover:bg-white/[0.14] shadow-[inset_0_0_0_1px_rgb(255_255_255/0.12)]',
  paper: 'bg-paper text-ink-900 hover:bg-white',
  outline: 'text-current shadow-[inset_0_0_0_1px_currentColor] hover:bg-current/[0.06]',
}

const sizes = {
  sm: 'h-9 px-3.5 text-[0.9rem]',
  md: 'h-11 px-5 text-[0.98rem]',
  lg: 'h-14 px-7 text-[1.05rem]',
}

const ROLL = 40 // degrees the label wheel turns per hover

/**
 * Button whose label swings away on a wide arc while a copy swings in.
 * `to` = internal page (plays the page transition), `href` = plain link, neither = button.
 */
const Button = forwardRef(function Button(
  { href, to, variant = 'amber', size = 'md', pill = true, icon, children, className, onPointerEnter, ...props },
  ref,
) {
  const wheel = useRef(null)
  const busy = useRef(false)
  const length = typeof children === 'string' ? children.length : 10
  const origin = `50% ${100 + 30 * (12 + 6 * length)}%`

  const handleEnter = (e) => {
    onPointerEnter?.(e)
    if (e.pointerType === 'touch' || busy.current || !wheel.current) return
    busy.current = true
    gsap.fromTo(
      wheel.current,
      { rotation: 0 },
      {
        rotation: ROLL,
        duration: 0.6,
        ease: 'osmo',
        onComplete: () => {
          gsap.set(wheel.current, { rotation: 0 })
          busy.current = false
        },
      },
    )
  }

  const Comp = to ? TLink : href ? 'a' : 'button'

  return (
    <Comp
      ref={ref}
      to={to}
      href={href}
      type={to || href ? undefined : props.type || 'button'}
      onPointerEnter={handleEnter}
      className={cx(
        'group relative inline-flex shrink-0 select-none items-center justify-center gap-2.5 overflow-hidden font-medium whitespace-nowrap tracking-[-0.01em] transition-colors duration-200',
        pill ? 'rounded-full' : 'rounded-xl',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      <span ref={wheel} className="relative block" style={{ transformOrigin: origin }}>
        <span className="block">{children}</span>
        <span aria-hidden="true" className="absolute inset-0 block" style={{ transformOrigin: origin, rotate: `${-ROLL}deg` }}>
          {children}
        </span>
      </span>
      {icon}
    </Comp>
  )
})

export default Button

/** Round arrow badge; the arrow exits top-right and re-enters on parent `group` hover. */
export function ArrowChip({ className = '' }) {
  return (
    <span className={cx('relative inline-flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full transition-colors duration-300', className)}>
      <ArrowUpRight className="size-4 transition-transform duration-500 ease-osmo group-hover:translate-x-[190%] group-hover:-translate-y-[190%]" />
      <ArrowUpRight className="absolute size-4 -translate-x-[190%] translate-y-[190%] transition-transform duration-500 ease-osmo group-hover:translate-x-0 group-hover:translate-y-0" />
    </span>
  )
}
