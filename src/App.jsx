import { lazy, Suspense, useEffect, useRef } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router'
import { BookingProvider } from './context/BookingContext'
import { TransitionProvider } from './transition/PageTransition'
import Navbar from './components/Navbar'
import Preloader from './components/Preloader'
import MobileDock from './components/MobileDock'
import WhatsAppFab from './components/WhatsAppFab'
import Home from './pages/Home'
import { loadBlogIndex, loadBlogPost, loadBookingModal, loadNotFound, loadServicePage } from './routes'
import { markAnimReady } from './lib/animReady'
import { getSeo } from './data/seo'
import { applyHead } from './lib/head'

const ServicePage = lazy(loadServicePage)
const NotFound = lazy(loadNotFound)
const BlogIndex = lazy(loadBlogIndex)
const BlogPost = lazy(loadBlogPost)
const BookingModal = lazy(loadBookingModal)

function AppRoutes() {
  const location = useLocation()
  // Only the homepage holds its section animations back for the hero intro
  if (location.pathname !== '/') markAnimReady()

  // Keep <title>, description, canonical and structured data in sync when navigating (the first page comes pre-rendered)
  const first = useRef(true)
  useEffect(() => {
    if (first.current) return void (first.current = false)
    applyHead(getSeo(location.pathname))
  }, [location.pathname])

  // Keyed by path so moving between two services remounts the page and replays its entrance
  return (
    <main data-page className="origin-top">
      <Suspense fallback={<div className="min-h-[100svh]" />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/services/:slug" element={<ServicePage />} />
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </main>
  )
}

// Fetch the split chunks in the background once the first screen is done
function usePrefetch() {
  useEffect(() => {
    const idle = window.requestIdleCallback ?? ((cb) => setTimeout(cb, 2500))
    const id = idle(() => {
      loadBookingModal()
      loadServicePage()
    })
    return () => (window.cancelIdleCallback ?? clearTimeout)(id)
  }, [])
}

/** Everything inside the router — shared by the browser (BrowserRouter) and the pre-renderer (StaticRouter) */
export function AppShell() {
  usePrefetch()
  return (
    <BookingProvider>
      <TransitionProvider>
        <Preloader />
        <Navbar />
        <AppRoutes />
        <MobileDock />
        <WhatsAppFab />
        <Suspense fallback={null}>
          <BookingModal />
        </Suspense>
      </TransitionProvider>
    </BookingProvider>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}
