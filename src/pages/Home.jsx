import { Suspense } from 'react'
import Hero from '../sections/Hero'
import Marquee from '../sections/Marquee'
import About from '../sections/About'
import Services from '../sections/Services'
import Medical from '../sections/Medical'
import Process from '../sections/Process'
import Fleet from '../sections/Fleet'
import Destinations from '../sections/Destinations'
import Testimonials from '../sections/Testimonials'
import BlogTeaser from '../sections/BlogTeaser'
import Faq from '../sections/Faq'
import Cta from '../sections/Cta'
import Footer from '../sections/Footer'

const BandMarquee = () => <Marquee className="-my-px" />
const below = [BandMarquee, About, Services, Medical, Process, Fleet, Destinations, Testimonials, BlogTeaser, Faq, Cta, Footer]

/*
  Every section is in the HTML from the start (pre-rendered for search engines).
  - Each section below the hero sits in its own <Suspense> boundary: React then hydrates them one by one,
    yielding to the browser in between, instead of in one long block.
  - Their animations are only built once the hero intro has finished (lib/animReady), one section at a time.
*/
export default function Home() {
  return (
    <>
      <Hero />
      {below.map((Section, i) => (
        <Suspense key={i} fallback={null}>
          <Section />
        </Suspense>
      ))}
    </>
  )
}
