import awaitElementComponent from './getElementComponent';

export async function getClosestComponentAsync<T>(
  element: HTMLElement,
  displayName: string,
): Promise<T | null> {
  const closestElement = element.closest<HTMLElement>(`[data-component="${displayName}"]`);
  if (!closestElement) {
    return null;
  }
  return awaitElementComponent<T>(closestElement);
}
