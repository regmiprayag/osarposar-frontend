export function roundTo(value: number, step = 5) {
  return Math.round(value / step) * step;
}

export function numberOrZero(v: string | number): number {
  const n = typeof v === "string" ? parseFloat(v) : v;
  return isFinite(n) ? n : 0;
}
