import { site } from '../data/site'

/*
  <head> tags for a page — rendered to a string by the pre-renderer (static HTML for crawlers and link previews)
  and applied to the live document when navigating client-side.
*/
const esc = (v) => String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

export function headTags(seo) {
  const tags = [
    `<title>${esc(seo.title)}</title>`,
    `<meta name="description" content="${esc(seo.description)}" />`,
    seo.noindex ? '<meta name="robots" content="noindex" />' : '<meta name="robots" content="index, follow, max-image-preview:large" />',
    seo.canonical && `<link rel="canonical" href="${esc(seo.canonical)}" />`,
    `<meta property="og:type" content="${seo.type ?? 'website'}" />`,
    `<meta property="og:locale" content="fr_FR" />`,
    `<meta property="og:site_name" content="${esc(site.name)}" />`,
    `<meta property="og:title" content="${esc(seo.title)}" />`,
    `<meta property="og:description" content="${esc(seo.description)}" />`,
    seo.canonical && `<meta property="og:url" content="${esc(seo.canonical)}" />`,
    seo.image && `<meta property="og:image" content="${esc(seo.image)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    ...(seo.jsonLd ?? []).map((d) => `<script type="application/ld+json">${JSON.stringify(d).replace(/</g, '\u003c')}</script>`),
  ]
  return tags.filter(Boolean).join('\n    ')
}

/** Client-side: sync the live <head> with the page being shown */
export function applyHead(seo) {
  document.title = seo.title
  const meta = (attr, key, content) => {
    let el = document.head.querySelector(`meta[${attr}="${key}"]`)
    if (!content) return el?.remove()
    if (!el) {
      el = document.createElement('meta')
      el.setAttribute(attr, key)
      document.head.appendChild(el)
    }
    el.setAttribute('content', content)
  }
  meta('name', 'description', seo.description)
  meta('name', 'robots', seo.noindex ? 'noindex' : 'index, follow, max-image-preview:large')
  meta('property', 'og:title', seo.title)
  meta('property', 'og:description', seo.description)
  meta('property', 'og:url', seo.canonical)
  meta('property', 'og:image', seo.image)
  let link = document.head.querySelector('link[rel="canonical"]')
  if (seo.canonical) {
    if (!link) {
      link = document.createElement('link')
      link.rel = 'canonical'
      document.head.appendChild(link)
    }
    link.href = seo.canonical
  } else link?.remove()
  document.head.querySelectorAll('script[type="application/ld+json"]').forEach((el) => el.remove())
  for (const d of seo.jsonLd ?? []) {
    const el = document.createElement('script')
    el.type = 'application/ld+json'
    el.textContent = JSON.stringify(d)
    document.head.appendChild(el)
  }
}
