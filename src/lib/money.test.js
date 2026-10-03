import { formatPrice } from './money.js';

describe('formatPrice', () => {
  it('formats 500 with two decimals', () => {
    expect(formatPrice(500)).toBe('£5.00');
    
  });


  it('formats 80 with two decimals', () => {
    expect(formatPrice(80)).toBe('£0.80');
    
  });



  it('formats 1000 with two decimals', () => {
    expect(formatPrice(1000)).toBe('£10.00');
    
  });



  it('formats 0 with two decimals', () => {
    expect(formatPrice(0)).toBe('£0.00');
    
  });



  it('formats 12345 with two decimals', () => {
    expect(formatPrice(12345)).toBe('£123.45');
    
  });
});