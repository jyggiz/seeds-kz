export function updateHash(newHash: string): void {
  const url = new URL(window.location.href);

  if (url.hash === newHash) {
    return;
  }

  url.hash = newHash;
  history.pushState({}, '', url.href);
}

export function getElementAbsoluteYCoordinate({
  element,
  extraOffset = 0,
}: {
  element: HTMLElement;
  extraOffset: number;
}): number {
  return element.getBoundingClientRect().top + window.pageYOffset - extraOffset;
}
