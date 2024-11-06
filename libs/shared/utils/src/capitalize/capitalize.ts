const initialisms = new Set(['cpm', 'cpr', 'usd']);

export function capitalize(string: string) {
  if (typeof string !== 'string') return '';
  return `${string.charAt(0).toUpperCase()}${string.slice(1)}`;
}

export function titleCase(string: string) {
  if (typeof string !== 'string') return '';
  return string
    .split(' ')
    .map((word) => {
      if (initialisms.has(word.toLowerCase())) {
        return word.toUpperCase();
      }
      return capitalize(word);
    })
    .join(' ');
}

export function spaceCase(string: string, deliminator = '_') {
  if (typeof string !== 'string') return '';
  return string.split(deliminator).join(' ');
}
