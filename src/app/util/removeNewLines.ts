export function removeNewlinesAndNumbers(inputString: string) {
  return inputString.replace(/^\d+\s*|\s+/g, ' ').trim();
}
