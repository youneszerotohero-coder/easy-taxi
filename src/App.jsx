import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router'
import { BookingProvider } from './context/BookingContext'
import { TransitionProvider } from './transition/PageTransition'
import Navbar from './components/Navbar'
import Preloader from './components/Preloader'
import MobileDock from './components/MobileDock'
import Home from './pages/Home'
import { loadBookingModal, loadNotFound, loadServicePage } from './routes'

const ServicePage = lazy(loadServicePage)
const NotFound = lazy(loadNotFound)
const BookingModal = lazy(loadBookingModal)

function AppRoutes() {
  const location = useLocation()
  // Keyed by path so moving between two services remounts the page and replays its entrance
  return (
    <main data-page className="origin-top">
      <Suspense fallback={<div className="min-h-[100svh]" />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/services/:slug" element={<ServicePage />} />
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

export default function App() {
  usePrefetch()
  return (
    <BrowserRouter>
      <BookingProvider>
        <TransitionProvider>
          <Preloader />
          <Navbar />
          <AppRoutes />
          <MobileDock />
          <Suspense fallback={null}>
            <BookingModal />
          </Suspense>
        </TransitionProvider>
      </BookingProvider>
    </BrowserRouter>
  )
}
