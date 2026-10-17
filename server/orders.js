const MAX_QUANTITY = 50;

// Checks the basket the browser sent. It should only hold item ids and quantities.
// Gives back either { error } or { items } with any repeated items joined together.
function checkOrderItems(items) {
    if (!Array.isArray(items) || items.length === 0) {
        return { error: 'Your basket is empty' };
    }

    const quantities = new Map();
    for (const item of items) {
        if (!item || !Number.isInteger(item.menuItemId)) {
            return { error: 'Each item needs a menu item id' };
        }
        if (!Number.isInteger(item.quantity) || item.quantity < 1) {
            return { error: 'Each quantity must be a whole number of at least 1' };
        }

        const total = (quantities.get(item.menuItemId) || 0) + item.quantity;
        if (total > MAX_QUANTITY) {
            return { error: `You can order at most ${MAX_QUANTITY} of one item` };
        }
        quantities.set(item.menuItemId, total);
    }

    return {
        items: [...quantities].map(([menuItemId, quantity]) => ({ menuItemId, quantity })),
    };
}

module.exports = { checkOrderItems, MAX_QUANTITY };
