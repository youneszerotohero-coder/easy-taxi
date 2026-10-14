import { StrictMode } from 'react'
import { prerenderToNodeStream } from 'react-dom/static'
import { StaticRouter } from 'react-router'
import { AppShell } from './App'
import { getSeo, allRoutes } from './data/seo'
import { headTags } from './lib/head'
import { services, site } from './data/site'

/** Render one route to static HTML (waits for lazy pages), plus its <head> tags */
export async function render(url) {
  const { prelude } = await prerenderToNodeStream(
    <StrictMode>
      <StaticRouter location={url}>
        <AppShell />
      </StaticRouter>
    </StrictMode>,
  )
  let html = ''
  for await (const chunk of prelude) html += chunk
  return { html, head: headTags(getSeo(url)) }
}

export { allRoutes, services, site }
