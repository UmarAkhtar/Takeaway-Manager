export function formatPrice(pence) {
  return `£${(pence / 100).toFixed(2)}`;
}

export function parsePrice(text) {
  const trimmed = text.trim().replace(/^£/, '');

  if (!/^\d+(\.\d{1,2})?$/.test(trimmed)) {
    return null;
  }

  const pence = Math.round(Number(trimmed) * 100);

  if (pence === 0) {
    return null;
  }

  return pence;
}