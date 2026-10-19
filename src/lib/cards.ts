export const CARD_BG = ['bg-card-1', 'bg-card-2', 'bg-card-3'] as const

export function cardIndex(i: number): number {
  return ((i % 3) + 3) % 3
}

export function cardBg(i: number): (typeof CARD_BG)[number] {
  return CARD_BG[cardIndex(i)]
}

export function cardVar(i: number): string {
  return `var(--color-card-${cardIndex(i) + 1})`
}
