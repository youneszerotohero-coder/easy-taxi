import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/bricolage-grotesque/wdth.css'
import '@fontsource-variable/inter'
import '@fontsource/jetbrains-mono/latin-500.css' // labels only use one weight — static file is ~3× smaller
import 'lenis/dist/lenis.css'
import './index.css'
import { initSmoothScroll, requestRefresh } from './lib/scroll'
import { ScrollTrigger } from './lib/gsap'
import App from './App.jsx'

// Page transitions handle scroll position themselves
if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
initSmoothScroll()
// Display font changes line heights once loaded — re-measure every trigger
// Webfonts and late images change line heights / layout — re-measure (debounced into a single pass)
document.fonts?.ready.then(() => requestRefresh())
window.addEventListener('load', () => requestRefresh())
if (import.meta.env.DEV) window.__ST = ScrollTrigger // inspect triggers from devtools

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
