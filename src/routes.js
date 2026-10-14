// Code-split chunks. The homepage ships without them; they're prefetched once the page is idle,
// and the page transition waits for the destination chunk while the curtain covers the screen.
export const loadServicePage = () => import('./pages/ServicePage')
export const loadBlogIndex = () => import('./pages/BlogIndex')
export const loadBlogPost = () => import('./pages/BlogPost')
export const loadNotFound = () => import('./pages/NotFound')
export const loadBookingModal = () => import('./components/BookingModal')

export function loadRoute(pathname) {
  if (pathname === '/') return Promise.resolve()
  if (pathname.startsWith('/services/')) return loadServicePage()
  if (pathname === '/blog' || pathname === '/blog/') return loadBlogIndex()
  if (pathname.startsWith('/blog/')) return loadBlogPost()
  return loadNotFound()
}
