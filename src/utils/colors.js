export function darken(percent, hex) {
  const amt = Math.round(2.55 * percent * 100);
  return (
    '#' +
    hex
      .replace(/^#/, '')
      .match(/.{2}/g)
      .map((x) =>
        Math.max(0, parseInt(x, 16) - amt)
          .toString(16)
          .padStart(2, '0')
      )
      .join('')
  );
}
