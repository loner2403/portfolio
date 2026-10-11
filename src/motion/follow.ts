export function followX(
  pointerX: number,
  rowLeft: number,
  rowWidth: number,
  cardWidth: number,
): number {
  if (
    !Number.isFinite(pointerX) ||
    !Number.isFinite(rowLeft) ||
    !Number.isFinite(rowWidth) ||
    !Number.isFinite(cardWidth)
  ) {
    return 0
  }
  const offset = pointerX - rowLeft
  if (offset < 0) return 0
  const max = Math.max(0, rowWidth - cardWidth - 24)
  return Math.min(max, offset + 20) + 0
}
