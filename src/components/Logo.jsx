import { cx } from '../lib/cx'
import { site } from '../data/site'

// A lit roof sign: amber trapezoid over a paper base
export function LogoMark({ className = 'h-7' }) {
  return (
    <svg viewBox="0 0 40 28" className={className} aria-hidden="true">
      <path d="M7 19 11 4h18l4 15z" fill="var(--color-amber)" />
      <path d="M15 9.5h10M17 13.5h6" stroke="var(--color-ink-900)" strokeWidth="2.2" strokeLinecap="round" />
      <rect x="2" y="20" width="36" height="6" rx="2" fill="currentColor" />
    </svg>
  )
}

export default function Logo({ className }) {
  return (
    <span className={cx('inline-flex items-center gap-2.5', className)}>
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.15rem] font-semibold tracking-[-0.03em]">{site.short}</span>
        <span className="eyebrow mt-1 !text-[0.58rem] opacity-55">{site.tagline}</span>
      </span>
    </span>
  )
}
