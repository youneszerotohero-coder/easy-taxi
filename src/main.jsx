import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import '@fontsource-variable/bricolage-grotesque/wdth.css'
import '@fontsource-variable/inter'
import '@fontsource/jetbrains-mono/latin-500.css' // labels only use one weight — static file is ~3× smaller
import 'lenis/dist/lenis.css'
import './index.css'
import { initSmoothScroll, requestRefresh } from './lib/scroll'
import { isAnimReady } from './lib/animReady'
import { ScrollTrigger } from './lib/gsap'
import App from './App.jsx'

// Page transitions handle scroll position themselves
if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
initSmoothScroll()
// Webfonts and late images change line heights / layout — re-measure (debounced into a single pass).
// Before the animations are released there's nothing below the fold to measure: lib/animReady refreshes then.
const refreshIfReady = () => isAnimReady() && requestRefresh()
document.fonts?.ready.then(refreshIfReady)
window.addEventListener('load', refreshIfReady)
if (import.meta.env.DEV) window.__ST = ScrollTrigger // inspect triggers from devtools

const root = document.getElementById('root')
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)
// Production pages arrive pre-rendered (scripts/prerender.mjs): hydrate them. The dev server serves an empty shell.
if (root.firstElementChild) hydrateRoot(root, app)
else createRoot(root).render(app)
