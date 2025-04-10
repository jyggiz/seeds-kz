export function removeHtmlExtension(linkUrl: string) {
  return linkUrl.replace(/\.html$/, '');
}
