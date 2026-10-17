export function timePlaced(createdAt) {
  return new Date(createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

// Turns milliseconds into minutes and seconds, e.g. 23:05
export function timeLeft(ms) {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}
