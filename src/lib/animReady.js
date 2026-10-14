import { useLayoutEffect, useState, useSyncExternalStore } from 'react'
import { flushSync } from 'react-dom'
import { useGSAP } from './gsap'
import { requestRefresh } from './scroll'

/*
  "Animations ready" switch. Sections below the hero don't build their scroll animations (SplitText, pins,
  ScrollTriggers…) until the hero's intro has finished — or the visitor starts interacting — so the first
  seconds after a load are spent only on the hero.
  When released, the waiting animations are then built ONE PER TASK (in page order, top to bottom), yielding to
  the browser in between, so the hand-over never turns into one long freeze either.
*/
let ready = false
const subs = new Set()
const queue = [] // enable-callbacks of the hooks waiting for their turn
let pumping = false

// Yield to the browser between two setups (MessageChannel: no 4ms setTimeout clamp)
// (browser only — an open MessageChannel would keep Node alive while pre-rendering)
const channel = typeof window !== 'undefined' && typeof MessageChannel !== 'undefined' ? new MessageChannel() : null
const nextTask = (fn) => {
  if (!channel) return setTimeout(fn, 0)
  channel.port1.onmessage = () => fn()
  channel.port2.postMessage(0)
}

function pump() {
  if (pumping || !ready) return
  pumping = true
  const step = () => {
    const enable = queue.shift()
    if (!enable) {
      pumping = false
      requestRefresh(120) // the new triggers/pins change the layout below the fold — measure once at the end
      return
    }
    enable()
    nextTask(step)
  }
  nextTask(step) // never inside React's commit (pump can be called from a layout effect)
}

export const isAnimReady = () => ready

export function markAnimReady() {
  if (ready) return
  ready = true
  subs.forEach((cb) => cb())
  pump()
}

export function useAnimReady() {
  return useSyncExternalStore(
    (cb) => (subs.add(cb), () => subs.delete(cb)),
    () => ready,
    () => false,
  )
}

/** useGSAP that waits for markAnimReady(), then for its turn in the queue (drop-in for below-the-fold animations) */
export function useLazyGSAP(callback, config = {}) {
  // Hooks mounting once everything is released (e.g. on another page) run straight away
  const [go, setGo] = useState(() => ready && !pumping && queue.length === 0)

  useLayoutEffect(() => {
    if (go) return
    const enable = () => flushSync(() => setGo(true)) // render + set up this one now, inside its own task
    queue.push(enable)
    pump()
    return () => {
      const i = queue.indexOf(enable)
      if (i !== -1) queue.splice(i, 1)
    }
  }, [go])

  return useGSAP((...args) => (go ? callback(...args) : undefined), { ...config, dependencies: [...(config.dependencies ?? []), go] })
}

if (typeof window !== 'undefined') {
  // Any interaction releases everything straight away; a timeout guarantees it in background tabs
  for (const type of ['wheel', 'touchstart', 'keydown', 'pointerdown']) window.addEventListener(type, markAnimReady, { once: true, passive: true })
  setTimeout(markAnimReady, 4000)
}
