import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { CustomEase } from 'gsap/CustomEase'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase, useGSAP)

// Signature curve used across the site (same as the CSS --ease-osmo token)
CustomEase.create('osmo', '0.625, 0.05, 0, 1')

// No automatic full re-measure on page load (it lands in the middle of the hero intro on a big DOM);
// lib/animReady re-measures once the below-the-fold animations exist. Resize & tab switches still refresh.
if (typeof window !== 'undefined') ScrollTrigger.config({ autoRefreshEvents: 'visibilitychange,resize' }) // (not while pre-rendering in Node)

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export { gsap, ScrollTrigger, SplitText, useGSAP }
