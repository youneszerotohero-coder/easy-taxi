import { useParams } from 'react-router'
import { img } from '../lib/img'
import { intro, TLink } from '../transition/PageTransition'
import { formatDate, latestPosts, postBySlug } from '../data/blog'
import { serviceBySlug, site } from '../data/site'
import { useBooking } from '../context/BookingContext'
import { Reveal, SplitHeading } from '../components/anim'
import Button from '../components/Button'
import { ArrowRight, Phone } from '../components/icons'
import Cta from '../sections/Cta'
import Footer from '../sections/Footer'
import { PostCard } from './BlogIndex'
import NotFound from './NotFound'

/** /blog/:slug — one guide: article body, booking box, links to the matching services and other guides */
export default function BlogPost() {
  const { slug } = useParams()
  const post = postBySlug(slug)
  const { openBooking } = useBooking()
  if (!post) return <NotFound />
  const delay = intro.delay
  const services = post.services.map(serviceBySlug).filter(Boolean)
  const medical = services[0]?.kind === 'medical'
  const others = latestPosts(4).filter((p) => p.slug !== post.slug).slice(0, 3)

  return (
    <>
      <article className="bg-white text-ink-900">
        <header className="relative overflow-hidden px-5 pt-36 pb-10 md:px-10 md:pt-44">
          <div className="pointer-events-none absolute top-[-30%] left-[30%] size-[50rem] rounded-full bg-amber/15 blur-[140px]" />
          <div className="relative mx-auto max-w-[56rem]">
            <Reveal immediate delay={delay + 0.2}>
              <nav data-reveal aria-label="Fil d’Ariane" className="eyebrow flex flex-wrap items-center gap-x-3 gap-y-1 text-amber-700">
                <TLink to="/" className="text-ink-400 hover:text-ink-900">
                  Accueil
                </TLink>
                <span className="text-ink-300">/</span>
                <TLink to="/blog" className="text-ink-400 hover:text-ink-900">
                  Blog
                </TLink>
                <span className="text-ink-300">/</span> <span aria-current="page">{post.category}</span>
              </nav>
            </Reveal>
            <SplitHeading as="h1" immediate delay={delay + 0.3} className="display mt-6 text-[clamp(2.3rem,5.2vw,4.4rem)] !leading-[1]">
              {post.title}
            </SplitHeading>
            <Reveal immediate delay={delay + 0.5}>
              <p data-reveal className="mt-6 text-[1.15rem] leading-relaxed text-ink-500">
                {post.excerpt}
              </p>
              <p data-reveal className="eyebrow mt-6 text-ink-400">
                Par {site.name} · <time dateTime={post.date}>{formatDate(post.date)}</time> · {post.readingTime} min de lecture
              </p>
            </Reveal>
          </div>
        </header>

        <div className="px-5 md:px-10">
          <div className="mx-auto aspect-[16/8] max-w-[72rem] overflow-hidden rounded-[2rem]">
            <img {...img(post.image, '(min-width: 1152px) 1152px, 100vw')} alt={post.title} fetchPriority="high" className="size-full object-cover" />
          </div>
        </div>

        <div className="mx-auto grid max-w-[72rem] gap-14 px-5 py-16 md:px-10 md:py-24 lg:grid-cols-[minmax(0,1fr)_20rem]">
          {/* Body */}
          <div className="max-w-[44rem] text-[1.08rem] leading-[1.75] text-ink-600">
            {post.body.map((b, i) =>
              b.h2 ? (
                <h2 key={i} className="mt-12 mb-4 font-display text-[clamp(1.6rem,2.6vw,2.1rem)] leading-tight font-semibold tracking-tight text-ink-900 first:mt-0">
                  {b.h2}
                </h2>
              ) : b.ul ? (
                <ul key={i} className="my-5 grid gap-2.5">
                  {b.ul.map((li) => (
                    <li key={li} className="flex gap-3">
                      <span className="mt-[0.7em] size-1.5 shrink-0 rounded-full bg-amber" />
                      <span>{li}</span>
                    </li>
                  ))}
                </ul>
              ) : b.tip ? (
                <p key={i} className="my-7 rounded-2xl bg-amber/15 px-5 py-4 text-[1rem] text-ink-900 ring-1 ring-amber/30">
                  {b.tip}
                </p>
              ) : (
                <p key={i} className="my-5">
                  {b.p}
                </p>
              ),
            )}

            {/* Services this guide is about (internal links) */}
            <div className="mt-14 border-t border-ink-900/10 pt-8">
              <h2 className="eyebrow text-ink-400">Nos services liés</h2>
              <ul className="mt-4 grid gap-1">
                {services.map((s) => (
                  <li key={s.slug}>
                    <TLink to={`/services/${s.slug}`} className="group flex items-center justify-between gap-4 border-b border-ink-900/10 py-3.5 text-ink-800 transition-colors hover:text-amber-700">
                      {s.title}
                      <ArrowRight className="size-4 shrink-0 text-ink-300 transition-[translate,color] duration-500 ease-osmo group-hover:translate-x-1 group-hover:text-amber-700" />
                    </TLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Booking box */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[1.75rem] bg-ink-900 p-7 text-white">
              <p className="eyebrow text-amber">{site.name}</p>
              <p className="display mt-4 text-[2rem]">{medical ? 'Besoin d’un transport médical ?' : 'Besoin d’un taxi ?'}</p>
              <p className="mt-3 text-[0.95rem] text-white/65">Réservation en ligne en une minute, confirmation par téléphone. 24h/24, 7j/7.</p>
              <Button size="lg" className="mt-6 w-full" onClick={(e) => openBooking({ mode: medical ? 'medical' : 'private' }, e.currentTarget)}>
                Réserver
              </Button>
              <a href={site.phoneHref} className="mt-3 flex h-12 items-center justify-center gap-2 rounded-full bg-white/10 text-[0.95rem] transition-colors hover:bg-white/20">
                <Phone className="size-4 text-amber" /> {site.phone}
              </a>
            </div>
          </aside>
        </div>
      </article>

      {/* Other guides */}
      <section className="bg-paper px-5 py-20 text-ink-900 md:px-10 md:py-28">
        <div className="mx-auto max-w-[72rem]">
          <div className="flex items-end justify-between gap-6">
            <h2 className="display text-[clamp(2rem,4vw,3.2rem)]">À lire aussi</h2>
            <TLink to="/blog" className="text-[0.95rem] font-medium text-amber-700 hover:underline">
              Tous les guides →
            </TLink>
          </div>
          <ul className="mt-10 grid gap-6 md:grid-cols-3">
            {others.map((p) => (
              <li key={p.slug}>
                <PostCard post={p} compact />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Cta />
      <Footer />
    </>
  )
}
