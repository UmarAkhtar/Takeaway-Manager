import { formatPrice, parsePrice } from './money.js';

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

describe('parsePrice', () => {
  it('5.00 is parsed as 500', () => {
    expect(parsePrice('£5.00')).toBe(500);
  });

   it('5.50 is parsed as 550', () => {
    expect(parsePrice('£5.50')).toBe(550);
  });

   it('4 is parsed as 400', () => {
    expect(parsePrice('£4.00')).toBe(400);
  });

   it('4.10 is parsed as 410', () => {
    expect(parsePrice('£4.10')).toBe(410);
  });

   it('0.80 is parsed as 80', () => {
    expect(parsePrice('£0.80')).toBe(80);
  });

   it('abc is parsed as Null', () => {
    expect(parsePrice('abc')).toBeNull();
  });

   it('4.555 is formatted as null', () => {
    expect(parsePrice('£4.555')).toBeNull();
  });

   it('-2 is formatted as null', () => {
    expect(parsePrice('£-2.00')).toBeNull();
  });

   it('0 is formatted as Null', () => {
    expect(parsePrice('£0.00')).toBeNull();
  });
});