const { checkOrderItems, MAX_QUANTITY } = require('./orders.js');

describe('checkOrderItems', () => {
  it('turns down an empty basket', () => {
    expect(checkOrderItems([])).toEqual({ error: 'Your basket is empty' });
  });

  it('turns down a basket that is not a list', () => {
    expect(checkOrderItems(undefined)).toEqual({ error: 'Your basket is empty' });
  });

  it('turns down an item without an id', () => {
    expect(checkOrderItems([{ quantity: 1 }]).error).toBe('Each item needs a menu item id');
  });

  it('turns down a quantity of 0, below 0 or with a decimal', () => {
    for (const quantity of [0, -1, 2.5, '2']) {
      expect(checkOrderItems([{ menuItemId: 1, quantity }]).error)
        .toBe('Each quantity must be a whole number of at least 1');
    }
  });

  it('turns down too many of one item', () => {
    expect(checkOrderItems([{ menuItemId: 1, quantity: MAX_QUANTITY + 1 }]).error)
      .toBe(`You can order at most ${MAX_QUANTITY} of one item`);
  });

  it('joins repeated items together', () => {
    expect(checkOrderItems([
      { menuItemId: 1, quantity: 2 },
      { menuItemId: 4, quantity: 1 },
      { menuItemId: 1, quantity: 1 },
    ])).toEqual({ items: [{ menuItemId: 1, quantity: 3 }, { menuItemId: 4, quantity: 1 }] });
  });

  it('ignores a price sent by the browser', () => {
    expect(checkOrderItems([{ menuItemId: 1, quantity: 1, pricePence: 1 }]))
      .toEqual({ items: [{ menuItemId: 1, quantity: 1 }] });
  });
});
