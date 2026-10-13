import { useId, useLayoutEffect, useRef, useState } from 'react'
import { img } from '../../lib/img'
import { gsap } from '../../lib/gsap'
import { cx } from '../../lib/cx'
import { Check, File as FileIcon, Minus, Plus, Close } from '../icons'

/** Every direct child that should stagger in when its slide enters */
export function Item({ className, children, ...props }) {
  return (
    <div data-f-item className={className} {...props}>
      {children}
    </div>
  )
}

export function Label({ children, hint, htmlFor }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 flex items-baseline justify-between gap-3 short:mb-1.5">
      <span className="eyebrow text-ink-500">{children}</span>
      {hint && <span className="text-[0.75rem] text-ink-400">{hint}</span>}
    </label>
  )
}

export function ErrorText({ children }) {
  if (!children) return null
  return <p className="mt-1.5 text-[0.8rem] text-[#d93d42]">{children}</p>
}

/** Text-like input with a leading icon and an amber focus ring */
export function Field({ label, hint, icon: Icon, error, className, as = 'input', ...props }) {
  const id = useId()
  const Comp = as
  return (
    <div className={className}>
      {label && (
        <Label htmlFor={id} hint={hint}>
          {label}
        </Label>
      )}
      <div
        className={cx(
          'group relative flex items-center rounded-2xl bg-ink-900/[0.035] ring-1 transition-[box-shadow,background-color] duration-300 focus-within:bg-ink-900/[0.06] focus-within:ring-2 focus-within:ring-amber',
          error ? 'ring-[#d93d42]/70' : 'ring-ink-900/10 hover:ring-ink-900/20',
        )}
      >
        {Icon && <Icon className="pointer-events-none absolute left-4 size-[1.15rem] text-ink-400 transition-colors group-focus-within:text-amber-700" />}
        <Comp
          id={id}
          aria-invalid={!!error}
          className={cx(
            'w-full bg-transparent text-[1rem] text-ink-900 placeholder:text-ink-400/70 outline-none [color-scheme:light]',
            as === 'textarea' ? 'min-h-28 resize-none px-4 py-3.5' : 'h-14 short:h-12',
            Icon ? 'pl-11 pr-4' : 'px-4',
          )}
          {...props}
        />
      </div>
      <ErrorText>{error}</ErrorText>
    </div>
  )
}

/** Segmented control with a sliding pill */
export function Segmented({ value, onChange, options, className, size = 'md' }) {
  const wrap = useRef(null)
  const pill = useRef(null)
  const index = Math.max(0, options.findIndex((o) => o.value === value))

  useLayoutEffect(() => {
    const btn = wrap.current?.children[index + 1]
    if (!btn) return
    gsap.to(pill.current, { x: btn.offsetLeft, width: btn.offsetWidth, duration: 0.55, ease: 'osmo' })
  }, [index, options.length])

  return (
    <div ref={wrap} role="radiogroup" className={cx('relative flex rounded-full bg-ink-900/[0.05] p-1 ring-1 ring-ink-900/10', className)}>
      <span ref={pill} className="absolute top-1 bottom-1 left-0 rounded-full bg-amber" aria-hidden="true" />
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={o.value === value}
          onClick={() => onChange(o.value)}
          className={cx(
            'relative z-10 flex flex-1 items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-colors duration-300',
            size === 'sm' ? 'h-9 px-3 text-[0.85rem]' : 'h-11 px-4 text-[0.95rem] short:h-10',
            o.value === value ? 'text-ink-900' : 'text-ink-700 hover:text-ink-900',
          )}
        >
          {o.icon && <o.icon className="size-4 shrink-0" />}
          {o.label}
        </button>
      ))}
    </div>
  )
}

/** Quick-pick chips (single or multi) */
export function Chips({ options, value, onChange, multi = false }) {
  const isOn = (v) => (multi ? value?.includes(v) : value === v)
  const toggle = (v) => {
    if (!multi) return onChange(v === value ? '' : v)
    onChange(isOn(v) ? value.filter((x) => x !== v) : [...(value || []), v])
  }
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const v = typeof o === 'string' ? o : o.value
        const label = typeof o === 'string' ? o : o.label
        const on = isOn(v)
        return (
          <button
            key={v}
            type="button"
            aria-pressed={on}
            onClick={() => toggle(v)}
            className={cx(
              'inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-[0.88rem] short:h-9 transition-[background-color,color,box-shadow,transform] duration-300 ease-osmo active:scale-95',
              on ? 'bg-amber text-ink-900' : 'bg-ink-900/[0.04] text-ink-700 ring-1 ring-ink-900/10 hover:bg-ink-900/[0.07] hover:text-ink-900',
            )}
          >
            <span className={cx('grid transition-[grid-template-columns] duration-300 ease-osmo', on ? 'grid-cols-[1fr]' : 'grid-cols-[0fr]')}>
              <span className="overflow-hidden">
                <Check className="mr-0.5 size-3.5" />
              </span>
            </span>
            {label}
          </button>
        )
      })}
    </div>
  )
}

/** +/- counter; the number rolls in the direction of the change */
export function Stepper({ label, icon: Icon, value, min = 0, max = 8, onChange, note }) {
  const num = useRef(null)
  const bump = (d) => {
    const next = Math.min(max, Math.max(min, value + d))
    if (next === value) {
      gsap.fromTo(num.current, { x: -4 }, { x: 0, duration: 0.4, ease: 'elastic.out(1, 0.3)' })
      return
    }
    onChange(next)
    gsap.fromTo(num.current, { yPercent: d > 0 ? 60 : -60, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.45, ease: 'osmo' })
  }
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-ink-900/[0.035] p-3 pl-4 ring-1 ring-ink-900/10 short:py-2">
      <div className="flex min-w-0 items-center gap-3">
        {Icon && (
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-ink-900/[0.05] text-amber-700">
            <Icon className="size-5" />
          </span>
        )}
        <div className="min-w-0">
          <p className="font-medium">{label}</p>
          {note && <p className="truncate text-[0.8rem] text-ink-400">{note}</p>}
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button type="button" onClick={() => bump(-1)} disabled={value <= min} aria-label={`Moins de ${label}`} className="flex size-10 items-center justify-center rounded-full bg-ink-900/[0.06] transition-colors hover:bg-ink-900/[0.1] disabled:opacity-30">
          <Minus className="size-4" />
        </button>
        <span className="w-9 overflow-hidden text-center font-display text-[1.4rem] font-semibold tabular-nums">
          <span ref={num} className="inline-block">
            {value}
          </span>
        </span>
        <button type="button" onClick={() => bump(1)} disabled={value >= max} aria-label={`Plus de ${label}`} className="flex size-10 items-center justify-center rounded-full bg-amber text-ink-900 transition-colors hover:bg-amber-300 disabled:opacity-30">
          <Plus className="size-4" />
        </button>
      </div>
    </div>
  )
}

/**
 * Big selectable card (vehicle, payment, ALD…).
 * `stacked` puts the icon above the text for narrow 2–3 column grids; `imageClassName` sets the photo's ratio.
 */
export function ChoiceCard({ selected, onClick, disabled, icon: Icon, title, text, image, imageClassName = 'aspect-[16/8]', badge, stacked = false }) {
  const check = (
    <span className={cx('flex size-5 shrink-0 items-center justify-center rounded-full ring-1 transition-all duration-300', selected ? 'bg-amber text-ink-900 ring-amber' : 'bg-white ring-ink-900/25', stacked && 'absolute top-3 right-3')}>
      <Check className={cx('size-3 transition-transform duration-300 ease-osmo', selected ? 'scale-100' : 'scale-0')} />
    </span>
  )
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      className={cx(
        'group relative flex w-full flex-col overflow-hidden rounded-2xl text-left ring-1 transition-[box-shadow,background-color,opacity] duration-300 disabled:cursor-not-allowed disabled:opacity-35',
        selected ? 'bg-amber/[0.09] ring-2 ring-amber' : 'bg-ink-900/[0.03] ring-ink-900/10 hover:bg-ink-900/[0.06] hover:ring-ink-900/25',
      )}
    >
      {image && (
        <span className={cx('relative block overflow-hidden', imageClassName)}>
          <img {...img(image, '(min-width: 1024px) 340px, 45vw')} alt="" decoding="async" className="size-full object-cover transition-transform duration-700 ease-osmo group-hover:scale-105" />
          <span className="absolute inset-0 bg-gradient-to-t from-ink-900/60 to-transparent" />
        </span>
      )}
      <span className={cx('flex gap-3', stacked ? 'flex-col items-start p-3 sm:p-4' : 'items-start p-3 sm:p-4')}>
        {Icon && (
          <span className={cx('flex size-10 shrink-0 items-center justify-center rounded-xl transition-colors', selected ? 'bg-amber text-ink-900' : 'bg-ink-900/[0.05] text-amber-700')}>
            <Icon className="size-5" />
          </span>
        )}
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1 font-medium">
            {title}
            {badge && <span className="eyebrow rounded-full bg-amber/15 px-2 py-1 !text-[0.6rem] text-amber-700">{badge}</span>}
          </span>
          {text && <span className="mt-0.5 block text-[0.8rem] leading-snug text-ink-500">{text}</span>}
        </span>
        {!stacked && check}
      </span>
      {stacked && check}
    </button>
  )
}

/** iOS-style switch row */
export function Toggle({ checked, onChange, icon: Icon, title, text }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center gap-3 rounded-2xl bg-ink-900/[0.035] p-3 pl-4 text-left ring-1 ring-ink-900/10 transition-colors hover:bg-ink-900/[0.06] short:py-2"
    >
      {Icon && (
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-ink-900/[0.05] text-amber-700">
          <Icon className="size-5" />
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block font-medium">{title}</span>
        {text && <span className="block text-[0.8rem] text-ink-400">{text}</span>}
      </span>
      <span className={cx('relative h-7 w-12 shrink-0 rounded-full transition-colors duration-300', checked ? 'bg-amber' : 'bg-ink-900/15')}>
        <span className={cx('absolute top-1 left-1 size-5 rounded-full bg-white shadow transition-transform duration-500 ease-osmo', checked && 'translate-x-5 bg-ink-900')} />
      </span>
    </button>
  )
}

/** Drag & drop zone for the medical prescription (ordonnance) */
export function Dropzone({ file, onChange, error }) {
  const [over, setOver] = useState(false)
  const input = useRef(null)
  const accept = (f) => {
    if (!f) return
    if (f.size > 5 * 1024 * 1024) return onChange(null, 'Fichier trop lourd (5 Mo max).')
    if (!/\.(pdf|jpe?g|png)$/i.test(f.name)) return onChange(null, 'Formats acceptés : PDF, JPG, PNG.')
    onChange(f)
  }
  return (
    <div>
      {file ? (
        <div className="flex items-center gap-3 rounded-2xl bg-care/10 p-3 ring-1 ring-care/40">
          <span className="flex size-11 items-center justify-center rounded-xl bg-care text-ink-900">
            <FileIcon className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">{file.name}</p>
            <p className="text-[0.8rem] text-ink-500">{(file.size / 1024).toFixed(0)} Ko · prêt à l’envoi</p>
          </div>
          <button type="button" onClick={() => onChange(null)} aria-label="Retirer le fichier" className="flex size-9 items-center justify-center rounded-full bg-ink-900/[0.08] hover:bg-ink-900/15">
            <Close className="size-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => input.current?.click()}
          onDragOver={(e) => {
            e.preventDefault()
            setOver(true)
          }}
          onDragLeave={() => setOver(false)}
          onDrop={(e) => {
            e.preventDefault()
            setOver(false)
            accept(e.dataTransfer.files?.[0])
          }}
          className={cx(
            'flex w-full items-center gap-4 rounded-2xl border border-dashed px-4 py-3.5 text-left transition-colors duration-300',
            over ? 'border-amber bg-amber/10' : 'border-ink-900/20 bg-ink-900/[0.025] hover:border-ink-900/35 hover:bg-ink-900/[0.04]',
          )}
        >
          <span className={cx('flex size-11 shrink-0 items-center justify-center rounded-xl transition-all duration-500 ease-osmo', over ? 'scale-110 bg-amber text-ink-900' : 'bg-ink-900/[0.06] text-amber-700')}>
            <FileIcon className="size-5" />
          </span>
          <span className="min-w-0">
            <span className="block font-medium">Déposez votre ordonnance médicale</span>
            <span className="text-[0.82rem] text-ink-500">ou cliquez pour l’ajouter · photo ou PDF · 5 Mo max</span>
          </span>
        </button>
      )}
      <input ref={input} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={(e) => accept(e.target.files?.[0])} />
      <ErrorText>{error}</ErrorText>
    </div>
  )
}
