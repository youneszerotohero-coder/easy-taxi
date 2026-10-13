import { useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { cx } from '../../lib/cx'
import { ChoiceCard, Chips, Dropzone, ErrorText, Field, Item, Label, Segmented, Stepper, Toggle } from './fields'
import { Bag, Bank, Card, Cash, Clock, Cross, Flag, Mail, Phone, Pin, Plane, Shield, User, Users, Wheelchair } from '../icons'

/*
  Booking steps. Each step is deliberately short (3–5 controls) so it fits inside the panel without
  scrolling, on laptops and phones alike — the user only ever clicks "Continuer".
*/

/* ──────────────────────────────── shared data ──────────────────────────────── */

export const emptyForm = {
  mode: 'private',
  // trip
  pickup: '',
  dropoff: '',
  tripType: 'oneway',
  asap: false,
  date: '',
  time: '',
  returnDate: '',
  returnTime: '',
  flight: '',
  // passengers
  passengers: 1,
  bags: 1,
  vehicle: 'berline',
  childSeat: false,
  wheelchair: false,
  // person
  lastName: '',
  firstName: '',
  dial: '+33',
  phone: '',
  email: '',
  payment: 'card',
  message: '',
  // medical
  ald: 'ald',
  reason: '',
  insurance: 'CPAM',
  ssn: '',
  doctor: '',
  roundTrip: true,
  prescription: null, // ordonnance médicale (File)
  consent: false,
}

const DIALS = ['+33', '+32', '+352', '+41', '+44', '+49', '+34', '+39', '+1']
const REASONS = ['Consultation', 'Hôpital de jour', 'Chirurgie ambulatoire', 'Chimiothérapie', 'Radiothérapie', 'Dialyse', 'Rééducation', 'Autre']
const INSURANCES = ['CPAM', 'MSA', 'MGEN', 'SSI', 'Autre']

export const today = () => new Date().toISOString().slice(0, 10)
const isAirport = (s) => /a[ée]roport|cdg|orly|roissy|tillé|bva/i.test(s || '')
const phoneOk = (p) => p.replace(/\D/g, '').length >= 9
const emailOk = (e) => !e || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)

/* ──────────────────────────────── shared pieces ──────────────────────────────── */

/** Pickup + destination with a swap button between them */
function Route({ form, set, errors, pickupLabel = 'Départ', dropoffLabel = 'Destination', dropoffIcon = Flag, dropoffPlaceholder = 'Où allez-vous ?' }) {
  const swapIcon = useRef(null)
  const swap = () => {
    gsap.fromTo(swapIcon.current, { rotate: 0 }, { rotate: 180, duration: 0.6, ease: 'osmo' })
    set({ pickup: form.dropoff, dropoff: form.pickup })
  }
  return (
    <Item className="relative grid gap-2">
      <Field label={pickupLabel} icon={Pin} placeholder="Adresse, gare, aéroport…" value={form.pickup} onChange={(e) => set({ pickup: e.target.value })} error={errors.pickup} autoComplete="street-address" />
      <Field label={dropoffLabel} icon={dropoffIcon} placeholder={dropoffPlaceholder} value={form.dropoff} onChange={(e) => set({ dropoff: e.target.value })} error={errors.dropoff} />
      <button
        type="button"
        onClick={swap}
        aria-label="Inverser départ et destination"
        className="absolute top-[4.375rem] right-3 z-10 flex size-10 items-center justify-center rounded-full bg-white text-ink-900 shadow-md ring-1 ring-ink-900/10 transition-colors hover:bg-amber"
      >
        <svg ref={swapIcon} viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M7 4v16m0 0-3-3m3 3 3-3M17 20V4m0 0-3 3m3-3 3 3" />
        </svg>
      </button>
    </Item>
  )
}

/** Date + time side by side (also on phones — the native pickers carry their own icon) */
function DateTime({ dateLabel, timeLabel, date, time, onDate, onTime, errors, dateKey, timeKey, min = today(), className }) {
  return (
    <Item className={cx('grid grid-cols-2 gap-2 sm:gap-3', className)}>
      <Field label={dateLabel} type="date" min={min} value={date} onChange={(e) => onDate(e.target.value)} error={errors[dateKey]} />
      <Field label={timeLabel} type="time" value={time} onChange={(e) => onTime(e.target.value)} error={errors[timeKey]} />
    </Item>
  )
}

function Names({ form, set, errors, lastLabel = 'Nom' }) {
  return (
    <Item className="grid grid-cols-2 gap-2 sm:gap-3">
      <Field label={lastLabel} value={form.lastName} onChange={(e) => set({ lastName: e.target.value })} error={errors.lastName} autoComplete="family-name" />
      <Field label="Prénom" value={form.firstName} onChange={(e) => set({ firstName: e.target.value })} error={errors.firstName} autoComplete="given-name" />
    </Item>
  )
}

/* ──────────────────────────────── private steps ──────────────────────────────── */

function TripStep({ form, set, errors }) {
  const airport = isAirport(form.pickup) || isAirport(form.dropoff)
  return (
    <>
      <Route form={form} set={set} errors={errors} />
      <Item>
        <Label>Type de trajet</Label>
        <Segmented
          value={form.tripType}
          onChange={(v) => set({ tripType: v })}
          options={[
            { value: 'oneway', label: 'Aller simple' },
            { value: 'return', label: 'Aller-retour' },
          ]}
        />
      </Item>
      <Item>
        <Field
          label="Numéro de vol"
          hint={airport ? 'Recommandé — nous suivons votre vol' : 'Optionnel'}
          icon={Plane}
          placeholder="Ex. FR 1234"
          value={form.flight}
          onChange={(e) => set({ flight: e.target.value.toUpperCase() })}
        />
      </Item>
    </>
  )
}

function WhenStep({ form, set, errors }) {
  return (
    <>
      <Item>
        <Toggle checked={form.asap} onChange={(v) => set({ asap: v })} icon={Clock} title="Dès que possible" text="Un chauffeur part vers vous immédiatement" />
      </Item>
      <DateTime
        className={cx('transition-opacity duration-300', form.asap && 'pointer-events-none opacity-30')}
        dateLabel="Date"
        timeLabel="Heure"
        date={form.date}
        time={form.time}
        onDate={(v) => set({ date: v })}
        onTime={(v) => set({ time: v })}
        errors={errors}
        dateKey="date"
        timeKey="time"
      />
      {form.tripType === 'return' && (
        <DateTime
          dateLabel="Date du retour"
          timeLabel="Heure du retour"
          min={form.date || today()}
          date={form.returnDate}
          time={form.returnTime}
          onDate={(v) => set({ returnDate: v })}
          onTime={(v) => set({ returnTime: v })}
          errors={errors}
          dateKey="returnDate"
          timeKey="returnTime"
        />
      )}
    </>
  )
}

function PassengersStep({ form, set }) {
  const needsVan = form.passengers > 4 || form.bags > 4
  const update = (patch) => {
    const next = { ...form, ...patch }
    set(next.passengers > 4 || next.bags > 4 ? { ...patch, vehicle: 'van' } : patch)
  }
  const options = [form.childSeat && 'child', form.wheelchair && 'wheelchair'].filter(Boolean)
  return (
    <>
      <Item className="grid gap-2 lg:grid-cols-2">
        <Stepper label="Passagers" icon={Users} value={form.passengers} min={1} max={8} onChange={(v) => update({ passengers: v })} note="Jusqu’à 8" />
        <Stepper label="Bagages" icon={Bag} value={form.bags} min={0} max={8} onChange={(v) => update({ bags: v })} note="En soute" />
      </Item>
      <Item>
        <Label hint={needsVan ? 'Van conseillé pour votre groupe' : null}>Véhicule</Label>
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <ChoiceCard
            selected={form.vehicle === 'berline'}
            disabled={needsVan}
            onClick={() => set({ vehicle: 'berline' })}
            image="/images/mercedes-front.webp"
            imageClassName="aspect-[16/7] short:aspect-[16/4]"
            title="Berline"
            text="1–4 pers. · 3 valises"
          />
          <ChoiceCard
            selected={form.vehicle === 'van'}
            onClick={() => set({ vehicle: 'van' })}
            image="/images/van-headlights.webp"
            imageClassName="aspect-[16/7] short:aspect-[16/4]"
            title="Van 8 places"
            text="Jusqu’à 8 · 8 valises"
            badge={needsVan ? 'Conseillé' : null}
          />
        </div>
      </Item>
      <Item>
        <Label hint="Gratuit, sur demande">Options</Label>
        <Chips
          multi
          options={[
            { value: 'child', label: 'Siège enfant' },
            { value: 'wheelchair', label: 'Fauteuil roulant' },
          ]}
          value={options}
          onChange={(v) => set({ childSeat: v.includes('child'), wheelchair: v.includes('wheelchair') })}
        />
      </Item>
    </>
  )
}

function ContactStep({ form, set, errors }) {
  return (
    <>
      <Names form={form} set={set} errors={errors} />
      <Item>
        <Label>Téléphone</Label>
        <div className="flex gap-2">
          <div className="relative rounded-2xl bg-ink-900/[0.035] ring-1 ring-ink-900/10 focus-within:ring-2 focus-within:ring-amber">
            <select value={form.dial} onChange={(e) => set({ dial: e.target.value })} aria-label="Indicatif" className="h-14 appearance-none bg-transparent pr-8 pl-4 text-ink-900 outline-none [color-scheme:light]">
              {DIALS.map((d) => (
                <option key={d} value={d} className="bg-white">
                  {d}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-ink-400">▾</span>
          </div>
          <Field className="flex-1" icon={Phone} type="tel" inputMode="tel" placeholder="6 12 34 56 78" value={form.phone} onChange={(e) => set({ phone: e.target.value })} aria-invalid={!!errors.phone} autoComplete="tel-national" />
        </div>
        <ErrorText>{errors.phone}</ErrorText>
      </Item>
      <Item>
        <Field label="E-mail" hint="Pour recevoir la confirmation" icon={Mail} type="email" value={form.email} onChange={(e) => set({ email: e.target.value })} error={errors.email} autoComplete="email" />
      </Item>
    </>
  )
}

function PaymentStep({ form, set }) {
  return (
    <>
      <Item>
        <Label>Moyen de paiement</Label>
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <ChoiceCard stacked selected={form.payment === 'card'} onClick={() => set({ payment: 'card' })} icon={Card} title="Carte" text="TPE à bord" />
          <ChoiceCard stacked selected={form.payment === 'cash'} onClick={() => set({ payment: 'cash' })} icon={Cash} title="Espèces" text="En euros" />
          <ChoiceCard stacked selected={form.payment === 'transfer'} onClick={() => set({ payment: 'transfer' })} icon={Bank} title="Virement" text="SEPA" />
        </div>
      </Item>
      <Item>
        <Field as="textarea" label="Message au chauffeur" hint="Optionnel" placeholder="Code portail, étage, poussette…" value={form.message} onChange={(e) => set({ message: e.target.value })} />
      </Item>
    </>
  )
}

/* ──────────────────────────────── medical steps ──────────────────────────────── */

function CoverageStep({ form, set, errors }) {
  return (
    <>
      <Item>
        <Label>Type de prise en charge</Label>
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <ChoiceCard stacked selected={form.ald === 'ald'} onClick={() => set({ ald: 'ald' })} icon={Shield} title="ALD" text="Affection longue durée, 100 %" />
          <ChoiceCard stacked selected={form.ald === 'non-ald'} onClick={() => set({ ald: 'non-ald' })} icon={Cross} title="Non ALD" text="Selon votre prescription" />
        </div>
      </Item>
      <Item>
        <Label>Motif du transport</Label>
        <Chips options={REASONS} value={form.reason} onChange={(v) => set({ reason: v })} />
        <ErrorText>{errors.reason}</ErrorText>
      </Item>
    </>
  )
}

function PatientStep({ form, set, errors }) {
  return (
    <>
      <Names form={form} set={set} errors={errors} lastLabel="Nom du patient" />
      <Item>
        <Field label="Téléphone" icon={Phone} type="tel" inputMode="tel" placeholder="06 12 34 56 78" value={form.phone} onChange={(e) => set({ phone: e.target.value })} error={errors.phone} autoComplete="tel" />
      </Item>
      <Item>
        <Field label="E-mail" hint="Optionnel" icon={Mail} type="email" value={form.email} onChange={(e) => set({ email: e.target.value })} error={errors.email} autoComplete="email" />
      </Item>
    </>
  )
}

function InsuranceStep({ form, set, errors }) {
  return (
    <>
      <Item>
        <Field
          label="N° de sécurité sociale"
          hint="13 ou 15 chiffres"
          icon={Shield}
          inputMode="numeric"
          placeholder="1 85 05 78 006 084 36"
          value={form.ssn}
          onChange={(e) => set({ ssn: e.target.value.replace(/[^\d ]/g, '') })}
          error={errors.ssn}
        />
      </Item>
      <Item>
        <Label>Caisse d’assurance maladie</Label>
        <Segmented size="sm" value={form.insurance} onChange={(v) => set({ insurance: v })} options={INSURANCES.map((v) => ({ value: v, label: v }))} />
      </Item>
      <Item>
        <Toggle checked={form.wheelchair} onChange={(v) => set({ wheelchair: v })} icon={Wheelchair} title="Patient en fauteuil roulant" text="Nous adaptons le véhicule" />
      </Item>
    </>
  )
}

function AppointmentStep({ form, set, errors }) {
  return (
    <>
      <Route
        form={form}
        set={set}
        errors={errors}
        pickupLabel="Adresse de prise en charge"
        dropoffLabel="Établissement de soins"
        dropoffIcon={Cross}
        dropoffPlaceholder="Hôpital, clinique, cabinet…"
      />
      <DateTime
        dateLabel="Date du RDV"
        timeLabel="Heure du RDV"
        date={form.date}
        time={form.time}
        onDate={(v) => set({ date: v })}
        onTime={(v) => set({ time: v })}
        errors={errors}
        dateKey="date"
        timeKey="time"
      />
      <Item>
        <Segmented
          value={form.roundTrip ? 'return' : 'oneway'}
          onChange={(v) => set({ roundTrip: v === 'return' })}
          options={[
            { value: 'return', label: 'Aller-retour' },
            { value: 'oneway', label: 'Aller simple' },
          ]}
        />
      </Item>
    </>
  )
}

function PrescriptionStep({ form, set, errors }) {
  return (
    <>
      <Item>
        <Label hint="Optionnel — ou remise au chauffeur">Ordonnance médicale</Label>
        <Dropzone file={form.prescription} error={errors.prescription} onChange={(f, err) => set({ prescription: f }, err ? { prescription: err } : null)} />
        <p className="mt-2 flex items-start gap-2 text-[0.8rem] leading-snug text-ink-500">
          <Shield className="mt-px size-4 shrink-0 text-care-700" />
          Document confidentiel, réservé à votre caisse.
        </p>
      </Item>
      <Item>
        <Field label="Médecin prescripteur" hint="Optionnel" icon={User} placeholder="Dr …" value={form.doctor} onChange={(e) => set({ doctor: e.target.value })} />
      </Item>
      <Item>
        <Field label="Message au chauffeur" hint="Optionnel" placeholder="Accès, aide à la marche, accompagnant…" value={form.message} onChange={(e) => set({ message: e.target.value })} />
      </Item>
    </>
  )
}

/* ──────────────────────────────── recap ──────────────────────────────── */

const fmtDate = (d) => (d ? new Date(d + 'T12:00').toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }) : '—')
const PAY = { card: 'Carte bancaire', cash: 'Espèces', transfer: 'Virement' }

function RecapStep({ form, set, errors }) {
  const medical = form.mode === 'medical'
  const rows = medical
    ? [
        ['Patient', `${form.firstName} ${form.lastName}`],
        ['Prise en charge', `${form.ald === 'ald' ? 'ALD' : 'Non ALD'} · ${form.reason} · ${form.insurance}`],
        ['Rendez-vous', `${fmtDate(form.date)} à ${form.time} · ${form.roundTrip ? 'aller-retour' : 'aller simple'}`],
        ['Ordonnance', form.prescription ? form.prescription.name : 'Remise au chauffeur'],
      ]
    : [
        ['Passager', `${form.firstName} ${form.lastName}`],
        ['Quand', form.asap ? 'Dès que possible' : `${fmtDate(form.date)} à ${form.time}`],
        ['Groupe', `${form.passengers} pers. · ${form.bags} bagage${form.bags > 1 ? 's' : ''} · ${form.vehicle === 'van' ? 'Van' : 'Berline'}`],
        ['Trajet', form.tripType === 'return' ? `Aller-retour · ${fmtDate(form.returnDate)} ${form.returnTime}` : 'Aller simple'],
        ['Paiement', PAY[form.payment]],
      ]
  if (!medical && form.flight) rows.splice(2, 0, ['Vol', form.flight])

  return (
    <>
      <Item>
        {/* Ticket */}
        <div className="relative overflow-hidden rounded-3xl bg-paper text-ink-900 ring-1 ring-ink-900/[0.06]">
          <div className="p-4 sm:p-5 short:py-3">
            <div className="flex items-center justify-between short:hidden">
              <span className="eyebrow text-ink-400">{medical ? 'Transport médical' : 'Course privée'}</span>
              <span className={cx('eyebrow rounded-full px-2.5 py-1.5 !text-[0.6rem]', medical ? 'bg-care/30 text-ink-900' : 'bg-amber text-ink-900')}>{medical ? 'Conventionné' : 'Devis offert'}</span>
            </div>
            <div className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 short:mt-0">
              <div className="flex flex-col items-center pt-1.5">
                <span className="size-3 rounded-full border-[3px] border-ink-900" />
                <span className="my-1 w-px flex-1 text-ink-300" style={{ backgroundImage: 'linear-gradient(180deg, currentColor 55%, transparent 0)', backgroundSize: '100% 0.6rem' }} />
                <span className="size-3 rounded-full bg-amber ring-[3px] ring-ink-900" />
              </div>
              <div className="min-w-0 space-y-3 short:space-y-1.5">
                <div>
                  <p className="text-[0.72rem] text-ink-400">Départ</p>
                  <p className="truncate font-display text-[1.15rem] leading-tight font-semibold tracking-tight">{form.pickup || '—'}</p>
                </div>
                <div>
                  <p className="text-[0.72rem] text-ink-400">{medical ? 'Établissement' : 'Destination'}</p>
                  <p className="truncate font-display text-[1.15rem] leading-tight font-semibold tracking-tight">{form.dropoff || '—'}</p>
                </div>
              </div>
            </div>
          </div>
          {/* perforation */}
          <div className="relative h-0">
            <span className="absolute -top-3 -left-3 size-6 rounded-full bg-white" />
            <span className="absolute -top-3 -right-3 size-6 rounded-full bg-white" />
            <span className="absolute inset-x-5 top-0 h-px text-ink-300 road-dash" style={{ backgroundSize: '0.8rem 100%' }} />
          </div>
          <dl className="grid gap-2 p-4 sm:p-5 short:gap-1 short:py-3">
            {rows.map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between gap-4 text-[0.88rem]">
                <dt className="shrink-0 text-ink-400">{k}</dt>
                <dd className="min-w-0 truncate text-right font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Item>
      <Item>
        <label className="flex cursor-pointer items-start gap-3 rounded-2xl p-1">
          <input type="checkbox" checked={form.consent} onChange={(e) => set({ consent: e.target.checked })} className="peer sr-only" />
          <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md ring-1 ring-ink-900/30 transition-colors peer-checked:bg-amber peer-checked:ring-amber peer-focus-visible:ring-2 peer-focus-visible:ring-amber">
            <svg viewBox="0 0 24 24" className={cx('size-3.5 text-ink-900 transition-transform duration-300 ease-osmo', form.consent ? 'scale-100' : 'scale-0')} fill="none" stroke="currentColor" strokeWidth="3">
              <path d="m5 12.5 4.5 4.5L19 7.5" />
            </svg>
          </span>
          <span className="text-[0.85rem] leading-relaxed text-ink-700">J’accepte d’être recontacté(e) pour confirmer ma réservation et que mes données soient utilisées pour la traiter.</span>
        </label>
        <ErrorText>{errors.consent}</ErrorText>
      </Item>
    </>
  )
}

/* ──────────────────────────────── flows ──────────────────────────────── */

const required = (form, keys) => Object.fromEntries(keys.filter((k) => !String(form[k] ?? '').trim()).map((k) => [k, 'Champ requis']))

const validatePerson = (form) => {
  const e = required(form, ['lastName', 'firstName', 'phone'])
  if (form.phone.trim() && !phoneOk(form.phone)) e.phone = 'Numéro invalide'
  if (!emailOk(form.email)) e.email = 'E-mail invalide'
  return e
}
const validateConsent = (form) => (form.consent ? {} : { consent: 'Merci de cocher cette case pour confirmer.' })

export const flows = {
  private: [
    { key: 'trip', title: 'Votre trajet', short: 'Trajet', desc: 'D’où partez-vous, où allez-vous ?', Component: TripStep, validate: (f) => required(f, ['pickup', 'dropoff']) },
    {
      key: 'when',
      title: 'Date & heure',
      short: 'Horaire',
      desc: 'Maintenant ou plus tard, on s’adapte.',
      Component: WhenStep,
      validate: (f) => ({
        ...(f.asap ? {} : required(f, ['date', 'time'])),
        ...(f.tripType === 'return' ? required(f, ['returnDate', 'returnTime']) : {}),
      }),
    },
    { key: 'group', title: 'Passagers & véhicule', short: 'Passagers', desc: 'Combien êtes-vous à bord ?', Component: PassengersStep, validate: () => ({}) },
    { key: 'contact', title: 'Vos coordonnées', short: 'Contact', desc: 'Pour que le chauffeur puisse vous joindre.', Component: ContactStep, validate: validatePerson },
    { key: 'payment', title: 'Paiement', short: 'Paiement', desc: 'Réglez à bord, comme vous préférez.', Component: PaymentStep, validate: () => ({}) },
    { key: 'recap', title: 'Récapitulatif', short: 'Confirmer', desc: 'Vérifiez, c’est presque parti.', Component: RecapStep, validate: validateConsent },
  ],
  medical: [
    { key: 'coverage', title: 'Prise en charge', short: 'Prise en charge', desc: 'Votre situation auprès de l’Assurance Maladie.', Component: CoverageStep, validate: (f) => required(f, ['reason']) },
    { key: 'patient', title: 'Le patient', short: 'Patient', desc: 'Pour vous joindre avant le trajet.', Component: PatientStep, validate: validatePerson },
    {
      key: 'insurance',
      title: 'Assurance maladie',
      short: 'Assurance',
      desc: 'Les informations nécessaires à la facturation.',
      Component: InsuranceStep,
      validate: (f) => {
        const e = required(f, ['ssn'])
        const digits = f.ssn.replace(/\D/g, '').length
        if (f.ssn && digits !== 13 && digits !== 15) e.ssn = '13 ou 15 chiffres attendus'
        return e
      },
    },
    { key: 'appointment', title: 'Rendez-vous', short: 'Rendez-vous', desc: 'Où et quand devons-nous vous emmener ?', Component: AppointmentStep, validate: (f) => required(f, ['pickup', 'dropoff', 'date', 'time']) },
    { key: 'prescription', title: 'Ordonnance', short: 'Ordonnance', desc: 'L’ordonnance médicale de votre médecin.', Component: PrescriptionStep, validate: () => ({}) },
    { key: 'recap', title: 'Récapitulatif', short: 'Confirmer', desc: 'Vérifiez avant l’envoi.', Component: RecapStep, validate: validateConsent },
  ],
}
