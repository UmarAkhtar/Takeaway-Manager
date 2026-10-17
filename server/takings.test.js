const { isValidDate } = require('./takings.js');

describe('isValidDate', () => {
  it('accepts a real date', () => {
    expect(isValidDate('2026-10-17')).toBe(true);
    expect(isValidDate('2024-02-29')).toBe(true);
  });

  it('turns down days that do not exist', () => {
    expect(isValidDate('2026-02-30')).toBe(false);
    expect(isValidDate('2025-02-29')).toBe(false);
    expect(isValidDate('2026-13-01')).toBe(false);
  });

  it('turns down anything not written like 2026-10-17', () => {
    for (const text of ['17/10/2026', '2026-1-7', 'today', '', undefined, 20261017]) {
      expect(isValidDate(text)).toBe(false);
    }
  });
});
