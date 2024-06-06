export function capitalizeFirstLetter(word: string) {
  if (word.length === 0) return word
  return word.charAt(0).toUpperCase() + word.slice(1)
}
