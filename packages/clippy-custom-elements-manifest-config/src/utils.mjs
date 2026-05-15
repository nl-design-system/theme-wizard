export function replace(string, terms) {
  let newString = '';

  if (typeof string !== 'undefined') {
    newString = string;
  }

  terms.forEach(({ from, to }) => {
    newString = newString.replace(from, to);
  });

  return newString;
}
