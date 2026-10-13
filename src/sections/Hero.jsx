import { useRef } from 'react'
import { img } from '../lib/img'
import { gsap, SplitText, useGSAP, prefersReducedMotion } from '../lib/gsap'
import { introDone } from '../lib/intro'
import { useBooking } from '../context/BookingContext'
import { site } from '../data/site'
import { ArrowRight } from '../components/icons'

/*
  Hero — exactly one screen: a wet night street under a TAXI roof light, the headline and one booking button.
  Waits for the preloader, then the image settles from a zoom, title chars roll up and the button rises;
  while scrolling away the image drifts and darkens and the copy lifts faster than the page.
*/
export default function Hero() {
  const { openBooking } = useBooking()
  const root = useRef(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const split = SplitText.create(q('[data-h-line]'), { type: 'lines,words,chars', mask: 'lines', linesClass: 'split-line' })
      gsap.set(q('[data-h-title]'), { autoAlpha: 1 })
      if (prefersReducedMotion()) return () => split.revert()

      const tl = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } })
      tl.fromTo(q('[data-h-img]'), { scale: 1.35 }, { scale: 1.08, duration: 2.6 }, 0)
        .from(split.chars, { yPercent: 120, rotate: 8, duration: 1.3, stagger: 0.016 }, 0.25)
        .from(q('[data-h-fade]'), { y: 30, autoAlpha: 0, duration: 1.2, stagger: 0.08 }, 0.7)
        .from(q('[data-h-bar]'), { y: 60, autoAlpha: 0, duration: 1.4 }, 0.85)
      introDone.then(() => tl.play())

      const st = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true }
      gsap.to(q('[data-h-img]'), { yPercent: 18, ease: 'none', scrollTrigger: st })
      gsap.to(q('[data-h-shade]'), { opacity: 0.85, ease: 'none', scrollTrigger: st })
      gsap.to(q('[data-h-copy]'), { yPercent: -25, ease: 'none', scrollTrigger: st })
      return () => split.revert()
    },
    { scope: root },
  )

  return (
    <section ref={root} data-nav-dark className="relative flex h-[100svh] flex-col overflow-hidden bg-black text-white">
      {/* Shading over the photo (sits above the car, below the copy) */}
      <div className="pointer-events-none absolute inset-0 z-[1]">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent max-lg:hidden" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/60" />
        <div data-h-shade className="absolute inset-0 bg-black opacity-0" />
      </div>

      {/* Phones & tablets: copy at the top, car below. Desktop (≥1024px): copy vertically centred on the left, car on the right */}
      <div data-h-copy className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-none flex-col justify-start px-5 pt-28 pb-4 tiny:pt-24 md:px-10 lg:flex-1 lg:justify-center lg:pb-12">
        <p data-h-fade className="eyebrow mb-[clamp(1rem,3vh,1.5rem)] flex items-center gap-2.5 text-white/80">
          <span className="relative flex size-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-care opacity-60" />
            <span className="relative size-2 rounded-full bg-care" />
          </span>
          Disponible 24h/24 · {site.city}
        </p>

        {/*
          Two block lines, each split separately: "Votre taxi, de jour" / "comme de nuit." from tablet up.
          On phones the first wraps before the no-wrap "de jour", giving three tidy lines.
        */}
        <h1 data-h-title className="display invisible text-[clamp(2.9rem,min(6.6vw,12vh),7.6rem)] lg:text-[clamp(3rem,min(5.2vw,11vh),6.4rem)] 2xl:text-[min(5.6rem,11vh)] max-lg:tiny:text-[2.6rem]">
          <span data-h-line className="block">
            Votre taxi, <span className="whitespace-nowrap text-amber">de jour</span>
          </span>
          <span data-h-line className="block">comme de nuit.</span>
        </h1>

        <p data-h-fade className="mt-[clamp(1rem,3vh,1.75rem)] max-w-lg lg:max-w-md text-[clamp(1rem,1.3vw,1.15rem)] leading-relaxed text-white/70">
          Conventionné CPAM, aéroports, Disneyland et longues distances — un prix annoncé à l’avance.
        </p>

        {/* Single call to action — the booking panel grows out of this button */}
        <button
          data-h-bar
          type="button"
          onClick={(e) => openBooking({ mode: 'private' }, e.currentTarget)}
          className="group mt-[clamp(1.5rem,4.5vh,2.75rem)] inline-flex h-16 items-center max-lg:tiny:mt-5 max-lg:tiny:h-14 gap-5 self-start rounded-full bg-amber pr-2 pl-8 text-[1.05rem] font-medium text-ink-900 shadow-[0_1rem_3rem_-0.5rem_rgb(255_179_26/0.45)] transition-colors hover:bg-amber-300"
        >
          Réserver ma course
          <span className="flex size-12 items-center justify-center rounded-full bg-ink-900 text-white transition-transform duration-500 ease-osmo group-hover:rotate-[-45deg]">
            <ArrowRight className="size-5" />
          </span>
        </button>
      </div>

      {/*
        Studio shot of a black luxury sedan on pure black — it melts into the section's black, so it reads as the
        hero's background. Phones: it's in the flow and fills only the space left between the button and the bottom
        bar (shrinking on short screens), so it can never slide under the copy. Very short phones hide it; desktop (≥1024px) shows it on the right.
      */}
      <div className="relative z-0 mb-24 min-h-0 flex-1 max-lg:tiny:hidden sm:mb-8 lg:absolute lg:inset-y-0 lg:right-0 lg:mb-0 lg:w-[52%] xl:w-[55%] 2xl:w-[48%]">
        <img
          data-h-img
          {...img('/images/hero-luxury-car.webp', '(min-width: 1024px) 55vw, (min-width: 640px) 100vw, (min-resolution: 2.5dppx) 85vw, 124vw')}
          alt="Berline de luxe noire éclairée dans la nuit"
          className="absolute inset-y-0 -left-[12%] h-full w-[124%] max-w-none object-contain sm:left-0 sm:w-full lg:object-right"
          fetchPriority="high"
        />
      </div>
    </section>
  )
}
