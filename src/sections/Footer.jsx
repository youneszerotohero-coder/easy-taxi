import { useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '../lib/gsap'
import { serviceCategories, services, site, zones } from '../data/site'
import { TLink } from '../transition/PageTransition'
import { LogoMark } from '../components/Logo'
import { Mail, Phone, Whatsapp } from '../components/icons'

/*
  Footer — the page "parks" into it: the oversized wordmark rises letter by letter from below
  as you reach the bottom, revealed under the content like a garage door.
*/
export default function Footer() {
  const root = useRef(null)
  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.from('[data-f-letter]', { yPercent: 100, ease: 'expo.out', stagger: 0.04, duration: 1.4, scrollTrigger: { trigger: '[data-f-word]', start: 'top 98%', once: true } })
    },
    { scope: root },
  )

  const year = new Date().getFullYear()
  return (
    <footer ref={root} className="relative overflow-hidden bg-paper px-5 pt-24 pb-8 text-ink-900 md:px-10">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-12 border-b border-ink-900/10 pb-16 md:grid-cols-2 lg:grid-cols-[1.2fr_1.1fr_1.1fr_1fr_0.8fr]">
          <div>
            <LogoMark className="h-9 text-ink-900" />
            <p className="mt-6 max-w-xs text-ink-500">Taxi conventionné et transport privé à Beauvais et dans toute l’Oise. {site.hours}.</p>
            <div className="mt-6 grid gap-2 text-[0.95rem]">
              <a href={site.phoneHref} className="flex items-center gap-3 text-ink-700 hover:text-amber-700">
                <Phone className="size-4" /> {site.phone}
              </a>
              <a href={`mailto:${site.email}`} className="flex items-center gap-3 text-ink-700 hover:text-amber-700">
                <Mail className="size-4" /> {site.email}
              </a>
              <a href={site.whatsapp} className="flex items-center gap-3 text-ink-700 hover:text-amber-700">
                <Whatsapp className="size-4" /> WhatsApp
              </a>
            </div>
          </div>
          {/* Services grouped like the client's menu: Médical | Aéroports & loisirs + Autres services */}
          {[['medical'], ['airports', 'other']].map((keys) => (
            <div key={keys[0]} className="grid content-start gap-10">
              {keys.map((key) => (
                <div key={key}>
                  <p className="eyebrow text-ink-400">{serviceCategories.find((c) => c.key === key).label}</p>
                  <ul className="mt-5 grid gap-2.5">
                    {services
                      .filter((s) => s.category === key)
                      .map((s) => (
                        <li key={s.slug}>
                          <TLink to={`/services/${s.slug}`} className="text-ink-700 transition-colors hover:text-amber-700">
                            {s.title}
                          </TLink>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
          <div>
            <p className="eyebrow text-ink-400">Zones</p>
            <ul className="mt-5 grid gap-2.5 text-ink-700">
              {zones.slice(0, 10).map((z) => (
                <li key={z}>{z}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow text-ink-400">Infos</p>
            <ul className="mt-5 grid gap-2.5 text-ink-700">
              <li>
                <TLink to="/#faq" className="hover:text-amber-700">
                  FAQ
                </TLink>
              </li>
              <li>
                <TLink to="/#medical" className="hover:text-amber-700">
                  Conventionné CPAM
                </TLink>
              </li>
              <li>Mentions légales</li>
              <li>Politique de confidentialité</li>
            </ul>
          </div>
        </div>

        <div data-f-word className="overflow-hidden pt-10" aria-hidden="true">
          <p className="display text-[clamp(4rem,22.5vw,24rem)] !leading-[0.8] whitespace-nowrap text-ink-900">
            {/* Brand wordmark — the last word ("Taxi") in amber */}
            {site.short.split(' ').map((word, w, words) => (
              <span key={w} className={w === words.length - 1 ? 'text-amber-600' : undefined}>
                {(w ? ' ' + word : word).split('').map((c, i) => (
                  <span key={i} data-f-letter className="inline-block whitespace-pre">
                    {c}
                  </span>
                ))}
              </span>
            ))}
          </p>
        </div>

        <div className="mt-8 flex flex-col justify-between gap-3 text-[0.85rem] text-ink-400 md:flex-row">
          <p>
            © {year} {site.name}. Tous droits réservés.
          </p>
          <p>Photos : Unsplash</p>
        </div>
      </div>
    </footer>
  )
}
