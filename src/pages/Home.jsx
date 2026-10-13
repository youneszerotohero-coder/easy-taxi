import { useEffect, useState } from 'react'
import { requestRefresh } from '../lib/scroll'
import Hero from '../sections/Hero'
import Marquee from '../sections/Marquee'
import About from '../sections/About'
import Services from '../sections/Services'
import Medical from '../sections/Medical'
import Process from '../sections/Process'
import Fleet from '../sections/Fleet'
import Destinations from '../sections/Destinations'
import Testimonials from '../sections/Testimonials'
import Faq from '../sections/Faq'
import Cta from '../sections/Cta'
import Footer from '../sections/Footer'

const BandMarquee = () => <Marquee className="-my-px" />
const below = [BandMarquee, About, Services, Medical, Process, Fleet, Destinations, Testimonials, Faq, Cta, Footer]
const PER_TICK = 2

/*
  The hero renders straight away; the sections below mount a couple at a time on the following ticks.
  Each section sets up its own animations when it mounts, so spreading them out turns one long
  main-thread block into short tasks (the intro stays smooth). Arriving on an anchor (/#faq) mounts everything at once.
*/
export default function Home() {
  const [count, setCount] = useState(() => (window.location.hash ? below.length : 0))

  useEffect(() => {
    if (count >= below.length) return requestRefresh()
    const id = setTimeout(() => setCount((c) => Math.min(below.length, c + PER_TICK)), 16)
    return () => clearTimeout(id)
  }, [count])

  return (
    <>
      <Hero />
      {below.slice(0, count).map((Section, i) => (
        <Section key={i} />
      ))}
    </>
  )
}
