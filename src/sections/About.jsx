import { Counter, ParallaxImage, Reveal, ScrubText } from '../components/anim'
import { stats } from '../data/site'
import { Shield, Clock, Car } from '../components/icons'

export default function About() {
  return (
    <section className="relative bg-white px-5 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-12 lg:grid-cols-[0.42fr_1fr]">
          <Reveal className="flex flex-col gap-5">
            <p data-reveal className="eyebrow text-amber-700">
              (01) — Qui sommes-nous
            </p>
            <p data-reveal className="max-w-xs text-ink-500">
              Une entreprise de taxi indépendante, basée à Beauvais, qui roule pour l’Oise depuis plus de dix ans.
            </p>
          </Reveal>
          <ScrubText
            className="display text-[clamp(2rem,4.4vw,4.4rem)] !leading-[1.02]"
            text="Depuis Beauvais, on vous conduit partout : à l’hôpital, à l’aéroport, chez vos proches ou à l’autre bout de la France. Ponctuels, discrets, et toujours là quand vous en avez besoin."
            highlight={[5, 24, 25]}
          />
        </div>

        {/* Collage */}
        <div className="mt-20 grid gap-4 md:mt-28 md:grid-cols-12 md:gap-6">
          <ParallaxImage src="/images/woman-exit-car.webp" alt="Passagère descendant d’une berline" className="aspect-[4/5] rounded-[1.75rem] md:col-span-5 md:aspect-auto md:h-[44rem]" />
          <div className="flex flex-col gap-4 md:col-span-7 md:gap-6">
            <ParallaxImage src="/images/driver-hands.webp" alt="Chauffeur au volant" from="right" className="aspect-[16/10] rounded-[1.75rem] md:aspect-auto md:h-[26rem]" />
            <Reveal className="grid flex-1 gap-4 sm:grid-cols-3 md:gap-6">
              {[
                [Shield, 'Chauffeur certifié', 'Carte professionnelle, formation premiers secours.'],
                [Clock, 'Toujours à l’heure', 'Départ anticipé, suivi des vols et des retards.'],
                [Car, 'Véhicules récents', 'Climatisés, nettoyés après chaque course.'],
              ].map(([Icon, t, d]) => (
                <div key={t} data-reveal className="flex flex-col rounded-[1.5rem] bg-paper p-6 ring-1 ring-ink-900/[0.05]">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-amber/20 text-amber-700">
                    <Icon className="size-5" />
                  </span>
                  <p className="mt-auto pt-10 font-display text-[1.3rem] font-semibold tracking-tight">{t}</p>
                  <p className="mt-1.5 text-[0.92rem] text-ink-500">{d}</p>
                </div>
              ))}
            </Reveal>
          </div>
        </div>

        {/* Stats */}
        <Reveal className="mt-20 grid grid-cols-2 gap-x-6 gap-y-12 border-t border-ink-900/10 pt-12 md:mt-28 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} data-reveal>
              <Counter value={s.value} decimals={s.decimals} suffix={s.suffix} className="display block text-[clamp(3.5rem,7vw,6.5rem)] text-ink-900" />
              <p className="mt-3 max-w-[14rem] text-ink-500">{s.label}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
