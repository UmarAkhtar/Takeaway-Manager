import { useState, useEffect } from 'react';
import { timePlaced, timeLeft } from '../lib/orderTime.js';

const REFRESH_EVERY_MS = 5000;

export default function KitchenScreen() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [now, setNow] = useState(Date.now());

  // Move the countdowns on every second
  useEffect(() => {
    const ticker = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(ticker);
  }, []);

  // Check for new orders straight away, then every few seconds
  useEffect(() => {
    function loadOrders() {
      fetch('/api/orders')
        .then(response => {
          if (!response.ok) {
            throw new Error('Could not load orders');
          }
          return response.json();
        })
        .then(data => {
          setOrders(data);
          setError(null);
        })
        .catch(() => setError('Could not load orders. Trying again...'));
    }

    loadOrders();
    const timer = setInterval(loadOrders, REFRESH_EVERY_MS);
    return () => clearInterval(timer);
  }, []);

  async function handleReady(id) {
    const response = await fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'ready' }),
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data.error);
      return;
    }

    setOrders(current => current.filter(order => order.id !== id));
  }

  // Once its time is up an order is ready, so take it off the screen straight away
  const waitingOrders = orders.filter(order => new Date(order.readyAt) > now);

  return (
    <div className="kitchen">
      <h2>Kitchen</h2>
      {error && <p className="form-error">{error}</p>}
      {waitingOrders.length === 0 && <p className="kitchen-empty">No orders waiting</p>}

      <ul className="kitchen-orders">
        {waitingOrders.map(order => (
          <li key={order.id} className="kitchen-order">
            <div className="kitchen-order-header">
              <h3>Order #{order.id}</h3>
              <span>{timePlaced(order.createdAt)}</span>
            </div>
            <p className="kitchen-countdown">
              Ready in {timeLeft(new Date(order.readyAt) - now)}
            </p>
            <ul className="kitchen-order-items">
              {order.items.map((item, index) => (
                <li key={index}>{item.quantity} × {item.name}</li>
              ))}
            </ul>
            <button type="button" onClick={() => handleReady(order.id)}>
              Ready
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
