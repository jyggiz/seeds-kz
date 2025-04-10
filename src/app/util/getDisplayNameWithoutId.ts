export function getDisplayNameWithoutId(displayName: string): string {
  const idParts = displayName.split('-');

  if (idParts.length >= 1) {
    idParts.shift();
    return idParts.join('-');
  }

  return displayName;
}
