import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const BookingContext = createContext(null)

/*
  `origin` is the element that was clicked — the booking panel grows out of it and shrinks back into it.
  `prefill` can carry { mode: 'private' | 'medical', pickup, dropoff, service }.
*/
export function BookingProvider({ children }) {
  const [state, setState] = useState({ open: false, prefill: null, origin: null, id: 0 })

  const openBooking = useCallback((prefill = null, origin = null) => {
    setState((s) => ({ open: true, prefill, origin, id: s.id + 1 }))
  }, [])
  const closeBooking = useCallback(() => setState((s) => ({ ...s, open: false })), [])

  const value = useMemo(() => ({ ...state, openBooking, closeBooking }), [state, openBooking, closeBooking])
  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
}

export const useBooking = () => useContext(BookingContext)
