function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function magneticOffset(dx: number, dy: number, reach: number): { x: number; y: number } {
  if (!Number.isFinite(dx) || !Number.isFinite(dy) || Math.hypot(dx, dy) > reach) {
    return { x: 0, y: 0 }
  }
  return {
    x: clamp(dx * 0.3, -8, 8) + 0,
    y: clamp(dy * 0.3, -8, 8) + 0,
  }
}
