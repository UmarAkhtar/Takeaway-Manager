import { useState, useEffect } from 'react';
import CategoryTabs from './CategoryTabs.jsx';
import Basket from './Basket.jsx';
import { formatPrice } from '../lib/money.js';

export default function CustomerMenu() {
const [menu, setMenu] = useState([]);
const [categories, setCategories] = useState([]);
const [selectedCategory, setSelectedCategory] = useState(1);
const [basket, setBasket] = useState([]);
const [placing, setPlacing] = useState(false);
const [orderError, setOrderError] = useState(null);
const [placedOrder, setPlacedOrder] = useState(null);

useEffect(() => {
  fetch('/api/menu')
    .then(response => response.json())
    .then(data => setMenu(data))
    .catch(error => console.error('Error fetching menu:', error));

  fetch('/api/categories')
    .then(response => response.json())
    .then(data => setCategories(data))
    .catch(error => console.error('Error fetching categories:', error));
}, []);

function addToBasket(item) {
  setBasket((current) => {
    const existing = current.find((line) => line.id === item.id);
    if (existing) {
      return current.map((line) =>
        line.id === item.id ? { ...line, quantity: line.quantity + 1 } : line
      );
    }
    return [...current, { id: item.id, name: item.name, pricePence: item.pricePence, quantity: 1 }];
  });
}

function takeAwayFromBasket(id) {
  setBasket((current) =>
    current
      .map((line) => (line.id === id ? { ...line, quantity: line.quantity - 1 } : line))
      .filter((line) => line.quantity > 0)
  );
}

async function placeOrder() {
  setPlacing(true);
  setOrderError(null);

  // Only send which items and how many. The server works out the prices.
  const response = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: basket.map((line) => ({ menuItemId: line.id, quantity: line.quantity })),
    }),
  });
  const data = await response.json();
  setPlacing(false);

  if (!response.ok) {
    setOrderError(data.error);
    return;
  }

  setPlacedOrder(data);
  setBasket([]);
}

if (placedOrder) {
  return (
    <div className="order-placed">
      <h2>Thanks! Your order number is {placedOrder.id}</h2>
      <p>Total to pay when you collect: {formatPrice(placedOrder.totalPence)}</p>
      <button onClick={() => setPlacedOrder(null)}>Start a new order</button>
    </div>
  );
}

const visibleItems = menu.filter((item) => item.category_id === selectedCategory);

return(
  <div>
    <CategoryTabs
      categories={categories}
      selectedCategory={selectedCategory}
      onSelectCategory={setSelectedCategory}
    />
    <ul className="menu-list">
      {visibleItems.map((item) => (
        <li key={item.id} className="menu-item">
          <span className="menu-item-name">{item.name}</span>
          <span className="menu-item-actions">
            <span className="menu-item-price">{formatPrice(item.price_pence)}</span>
            <button onClick={() => addToBasket({ id: item.id, name: item.name, pricePence: item.price_pence })}>
              Add
            </button>
          </span>
        </li>
      ))}
    </ul>
    <Basket
      basket={basket}
      onAdd={addToBasket}
      onTakeAway={takeAwayFromBasket}
      onPlaceOrder={placeOrder}
      placing={placing}
      error={orderError}
    />
  </div>
);
}
