import { latestPosts } from '../data/blog'
import { Reveal, SplitHeading } from '../components/anim'
import { TLink } from '../transition/PageTransition'
import { PostCard } from '../pages/BlogIndex'

/* Homepage teaser for the blog — internal links from the strongest page to the guides */
export default function BlogTeaser() {
  return (
    <section id="blog" className="bg-paper px-5 py-24 text-ink-900 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow text-amber-700">Conseils &amp; guides</p>
            <SplitHeading className="display mt-5 text-[clamp(2.4rem,5vw,4.6rem)]">
              Bien préparer
              <br />
              votre trajet.
            </SplitHeading>
          </div>
          <TLink to="/blog" className="text-[0.98rem] font-medium text-amber-700 hover:underline">
            Tous les guides →
          </TLink>
        </div>
        <Reveal as="ul" className="mt-12 grid gap-6 md:grid-cols-3">
          {latestPosts(3).map((p) => (
            <li data-reveal key={p.slug}>
              <PostCard post={p} compact />
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
