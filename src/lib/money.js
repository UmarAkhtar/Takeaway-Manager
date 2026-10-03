export function formatPrice(pence) {
  return `£${(pence / 100).toFixed(2)}`;
}