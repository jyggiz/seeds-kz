export function getLastPathnameFromUrl(url: string): string {
  const paths = url.split('/');
  return paths[paths.length - 1];
}
