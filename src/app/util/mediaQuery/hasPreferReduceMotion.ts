export function hasPreferReduceMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
