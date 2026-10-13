const base = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', viewBox: '0 0 24 24' }
const I = (paths) =>
  function Icon({ className = 'size-5', ...props }) {
    return (
      <svg {...base} className={className} aria-hidden="true" {...props}>
        {paths}
      </svg>
    )
  }

export const ArrowRight = I(<path d="M5 12h14m-6-6 6 6-6 6" />)
export const ArrowLeft = I(<path d="M19 12H5m6-6-6 6 6 6" />)
export const ArrowUpRight = I(<path d="M7 17 17 7M8 7h9v9" />)
export const Close = I(<path d="M6 6l12 12M18 6 6 18" />)
export const Plus = I(<path d="M12 5v14M5 12h14" />)
export const Minus = I(<path d="M5 12h14" />)
export const Check = I(<path d="m5 12.5 4.5 4.5L19 7.5" />)
export const Phone = I(<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />)
export const Mail = I(<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>)
export const Pin = I(<><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" /></>)
export const Flag = I(<path d="M5 21V4m0 0h11l-2 4 2 4H5" />)
export const Calendar = I(<><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4m8-4v4" /></>)
export const Clock = I(<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>)
export const User = I(<><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>)
export const Users = I(<><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6" /></>)
export const Bag = I(<><rect x="5" y="7" width="14" height="13" rx="2" /><path d="M9 7V4h6v3M9 11v5m6-5v5" /></>)
export const Plane = I(<path d="M10.5 13.5 3 11l1.5-1.5 7.5 1L17 5a2 2 0 0 1 3 3l-5.5 5 1 7.5L14 22l-2.5-7.5L8 18v2.5L6.5 22 5 18l-3-1.5L3.5 15H6z" />)
export const Heart = I(<path d="M12 20s-8-4.6-8-10.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5C20 15.4 12 20 12 20Z" />)
export const Cross = I(<path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z" />)
export const Car = I(<><path d="M5 17H3v-5l2-5h14l2 5v5h-2" /><circle cx="7.5" cy="17" r="2" /><circle cx="16.5" cy="17" r="2" /><path d="M9.5 17h5M3 12h18" /></>)
export const Card = I(<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18M7 15h3" /></>)
export const Cash = I(<><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2.5" /><path d="M6 9v.01M18 15v.01" /></>)
export const Bank = I(<path d="M3 10h18L12 4zM5 10v8m4-8v8m6-8v8m4-8v8M3 21h18" />)
export const Wheelchair = I(<><circle cx="10" cy="4" r="1.6" /><path d="M10 7v6h6l3 5M10 10h5" /><path d="M7.5 10.5a5.5 5.5 0 1 0 7.8 7" /></>)
export const File = I(<><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5M9 13h6m-6 4h4" /></>)
export const Shield = I(<><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z" /><path d="m9 12 2 2 4-4" /></>)
export const Star = ({ className = 'size-4' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" />
  </svg>
)
export const Whatsapp = ({ className = 'size-5' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2m0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2m4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.5-.3" />
  </svg>
)
