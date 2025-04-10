export function kebabToUpperCase(value: string): string {
  const words = value.split('-');
  const upperCasedWords = words.map((word) => word.toUpperCase());

  return upperCasedWords.join(' ');
}
