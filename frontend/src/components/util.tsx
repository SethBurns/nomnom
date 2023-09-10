export function toTitleCase(str: string) {
  const words = str.split(' ');
  const titleCaseWords = words.map(function(word) {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
  return titleCaseWords.join(' ');
}