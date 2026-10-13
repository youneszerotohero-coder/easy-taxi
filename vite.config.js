import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Preload the two fonts the first screen needs (body + display), so text paints in its final font
// without a re-layout. Their hashed names are only known once the bundle exists.
const CRITICAL_FONTS = [/inter-latin-wght-normal-.*\.woff2$/, /bricolage-grotesque-latin-wdth-normal-.*\.woff2$/]
function preloadFonts() {
  return {
    name: 'preload-critical-fonts',
    apply: 'build',
    transformIndexHtml(html, ctx) {
      const files = Object.keys(ctx.bundle ?? {}).filter((f) => CRITICAL_FONTS.some((re) => re.test(f)))
      return files.map((f) => ({ tag: 'link', attrs: { rel: 'preload', as: 'font', type: 'font/woff2', href: `/${f}`, crossorigin: '' }, injectTo: 'head' }))
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), preloadFonts()],
  build: {
    target: 'es2022',
    rolldownOptions: {
      output: {
        // Long-lived vendor chunks: they change far less often than the site's own code, so browsers keep them cached
        advancedChunks: {
          groups: [
            { name: 'react', test: /node_modules[\/](react|react-dom|react-router|scheduler)[\/]/ },
            { name: 'animation', test: /node_modules[\/](gsap|@gsap|lenis)[\/]/ },
          ],
        },
      },
    },
  },
})
