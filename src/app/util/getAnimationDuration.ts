export function getAnimationDuration(duration: number): number {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : duration;
}
