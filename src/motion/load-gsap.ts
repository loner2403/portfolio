import type { gsap as GsapType } from 'gsap'

let pending: Promise<typeof GsapType> | null = null

export function loadGsap(): Promise<typeof GsapType> {
  if (!pending) pending = import('gsap').then((mod) => mod.gsap ?? mod.default)
  return pending
}
