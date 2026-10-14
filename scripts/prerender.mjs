/*
  Static pre-rendering (SEO). Runs after `vite build` + the SSR build of src/entry-server.jsx:
    - renders every route (home, each service, 404) to real HTML inside #root, so crawlers and link previews
      see the full content without running JavaScript; the browser then hydrates it,
    - injects each page's <title>, meta description, canonical URL, Open Graph tags and JSON-LD,
    - writes sitemap.xml and robots.txt.
  Output: dist/index.html, dist/services/<slug>/index.html, dist/404.html
*/
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const ssrDir = path.join(root, 'dist-ssr')

const { render, allRoutes, site } = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href)
const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')

const routes = [...allRoutes(), '/404']
for (const url of routes) {
  const { html, head } = await render(url)
  let page = template
    .replace('<!--app-head-->', head)
    .replace(/<!--dev-head-->[\s\S]*?<!--\/dev-head-->/, '')
    .replace('<!--app-html-->', html)
  // The hero photo preload only makes sense on the homepage
  page = url === '/' ? page.replace(/<!--\/?home-preload-->/g, '') : page.replace(/<!--home-preload-->[\s\S]*?<!--\/home-preload-->/, '')

  const file = url === '/' ? 'index.html' : url === '/404' ? '404.html' : path.join(url.slice(1), 'index.html')
  fs.mkdirSync(path.dirname(path.join(dist, file)), { recursive: true })
  fs.writeFileSync(path.join(dist, file), page)
  console.log(`  ✓ ${url.padEnd(48)} → dist/${file.replaceAll('\\', '/')}  (${(page.length / 1024).toFixed(0)} KB)`)
}

// sitemap.xml — every indexable page
const today = new Date().toISOString().slice(0, 10)
const urls = allRoutes()
  .map((u) => `  <url><loc>${site.url}${u === '/' ? '/' : u}</loc><lastmod>${today}</lastmod><changefreq>${u === '/' ? 'weekly' : 'monthly'}</changefreq><priority>${u === '/' ? '1.0' : '0.8'}</priority></url>`)
  .join('\n')
fs.writeFileSync(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`)
fs.writeFileSync(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`)
console.log(`  ✓ sitemap.xml (${allRoutes().length} URLs), robots.txt`)

fs.rmSync(ssrDir, { recursive: true, force: true })
