export function getCurrentLanguageCode(): string {
  const paths = window.location.href.split('/');
  return (paths[3] || 'en-us').substring(0, 2);
}
