export function removeAnchorIdFromPathname(pathname: string): string {
  var indexOfHash = pathname.indexOf('#'); // Find the index of the '#' character

  if (indexOfHash !== -1) {
    // If '#' is found, remove everything from that index onwards
    return pathname.substring(0, indexOfHash);
  }

  // If '#' is not found, return the original pathname
  return pathname;
}
