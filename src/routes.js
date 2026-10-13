// Code-split chunks. The homepage ships without them; they're prefetched once the page is idle,
// and the page transition waits for the destination chunk while the curtain covers the screen.
export const loadServicePage = () => import('./pages/ServicePage')
export const loadNotFound = () => import('./pages/NotFound')
export const loadBookingModal = () => import('./components/BookingModal')

export const loadRoute = (pathname) => (pathname === '/' ? Promise.resolve() : pathname.startsWith('/services/') ? loadServicePage() : loadNotFound())
