/*
  Booking API — stubbed until the backend lands.
  Swap the body of `submitBooking` for a real `fetch('/api/bookings', …)` once the server exists;
  the modal only relies on the promise resolving to `{ reference }` or rejecting with an Error.
*/

const delay = (ms) => new Promise((r) => setTimeout(r, ms))

export function toPayload(form) {
  const { prescription, ...rest } = form
  return { ...rest, prescriptionName: prescription?.name ?? null, createdAt: new Date().toISOString() }
}

export async function submitBooking(form) {
  await delay(1400)
  const stamp = Date.now().toString(36).slice(-5).toUpperCase()
  const reference = `${form.mode === 'medical' ? 'MED' : 'CT'}-${stamp}`
  if (import.meta.env.DEV) console.info('[booking] payload', toPayload(form))
  return { reference }
}
