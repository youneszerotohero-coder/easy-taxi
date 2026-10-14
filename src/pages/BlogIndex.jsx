import { img } from '../lib/img'
import { intro, TLink } from '../transition/PageTransition'
import { formatDate, latestPosts, posts } from '../data/blog'
import { Reveal, SplitHeading } from '../components/anim'
import { ArrowChip } from '../components/Button'
import Cta from '../sections/Cta'
import Footer from '../sections/Footer'

/** /blog — all guides, newest first */
export default function BlogIndex() {
  const delay = intro.delay
  const list = latestPosts(posts.length)
  return (
    <>
      <section className="relative overflow-hidden bg-white px-5 pt-36 pb-16 text-ink-900 md:px-10 md:pt-44">
        <div className="pointer-events-none absolute top-[-30%] left-[40%] size-[50rem] rounded-full bg-amber/15 blur-[140px]" />
        <div className="relative mx-auto max-w-[1440px]">
          <Reveal immediate delay={delay + 0.2}>
            <nav data-reveal aria-label="Fil d’Ariane" className="eyebrow flex items-center gap-3 text-amber-700">
              <TLink to="/" className="text-ink-400 hover:text-ink-900">
                Accueil
              </TLink>
              <span className="text-ink-300">/</span> <span aria-current="page">Blog</span>
            </nav>
          </Reveal>
          <SplitHeading as="h1" immediate delay={delay + 0.3} className="display mt-6 max-w-[16ch] text-[clamp(2.8rem,7vw,6.5rem)]">
            Conseils &amp; guides taxi à Beauvais
          </SplitHeading>
          <Reveal immediate delay={delay + 0.5}>
            <p data-reveal className="mt-6 max-w-2xl text-[1.1rem] leading-relaxed text-ink-500">
              Gare et aéroport de Beauvais, transport médical, prise en charge CPAM : nos guides pratiques pour vous déplacer sereinement dans l’Oise.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-white px-5 pb-28 text-ink-900 md:px-10">
        <Reveal as="ul" className="mx-auto grid max-w-[1440px] gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <li data-reveal key={p.slug}>
              <PostCard post={p} />
            </li>
          ))}
        </Reveal>
      </section>

      <Cta />
      <Footer />
    </>
  )
}

export function PostCard({ post, compact = false }) {
  return (
    <TLink to={`/blog/${post.slug}`} className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-paper ring-1 ring-ink-900/[0.05] transition-shadow duration-500 hover:shadow-[0_1.5rem_3rem_-1.5rem_rgba(11,11,12,0.3)]">
      <div className={compact ? 'relative aspect-[16/9] overflow-hidden' : 'relative aspect-[16/10] overflow-hidden'}>
        <img {...img(post.image, '(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw')} alt="" loading="lazy" decoding="async" className="size-full object-cover transition-transform duration-[1.2s] ease-osmo group-hover:scale-105" />
        <span className="eyebrow absolute top-4 left-4 rounded-full bg-white/90 px-3 py-2 text-ink-900 backdrop-blur">{post.category}</span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="eyebrow text-ink-400">
          {formatDate(post.date)} · {post.readingTime} min
        </p>
        <h2 className="mt-3 font-display text-[1.45rem] leading-tight font-semibold tracking-tight transition-colors group-hover:text-amber-700">{post.title}</h2>
        {!compact && <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-500">{post.excerpt}</p>}
        <div className="mt-auto flex items-center justify-between pt-6">
          <span className="text-[0.92rem] font-medium">Lire le guide</span>
          <ArrowChip className="bg-sky-600 text-white group-hover:bg-sky-700" />
        </div>
      </div>
    </TLink>
  )
}
