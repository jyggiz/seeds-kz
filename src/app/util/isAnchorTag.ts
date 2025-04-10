const ANCHOR_TAG = 'a';

export function isAnchorTag(element: HTMLElement | null): element is HTMLAnchorElement {
  return element?.tagName.toLowerCase() === ANCHOR_TAG;
}
