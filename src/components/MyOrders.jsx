import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { formatPrice } from '../lib/money.js';
import { timePlaced, timeLeft } from '../lib/orderTime.js';

const REFRESH_EVERY_MS = 15000;

export default function MyOrders() {
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState(null);
  const [now, setNow] = useState(Date.now());

  // Check the orders straight away, then now and again in case staff mark one ready
  useEffect(() => {
    function loadOrders() {
      fetch('/api/my-orders')
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
        .catch(() => setError('Could not load your orders. Trying again...'));
    }

    loadOrders();
    const timer = setInterval(loadOrders, REFRESH_EVERY_MS);
    return () => clearInterval(timer);
  }, []);

  // Move the countdowns on every second
  useEffect(() => {
    const ticker = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(ticker);
  }, []);

  if (orders === null && !error) {
    return <p>Loading...</p>;
  }

  return (
    <div className="my-orders">
      <h2>My orders</h2>
      {error && <p className="form-error">{error}</p>}

      {orders?.length === 0 && (
        <p className="basket-empty">
          You haven't placed any orders yet. <Link to="/">See the menu</Link>
        </p>
      )}

      <ul className="kitchen-orders">
        {orders?.map(order => {
          const ready = order.status === 'ready' || new Date(order.readyAt) <= now;
          return (
            <li key={order.id} className="kitchen-order">
              <div className="kitchen-order-header">
                <h3>Order #{order.id}</h3>
                <span>{timePlaced(order.createdAt)}</span>
              </div>
              <p className={ready ? 'order-status order-status-ready' : 'order-status'}>
                {ready
                  ? 'Ready to collect'
                  : `Ready in ${timeLeft(new Date(order.readyAt) - now)}`}
              </p>
              <ul className="kitchen-order-items">
                {order.items.map((item, index) => (
                  <li key={index}>{item.quantity} × {item.name}</li>
                ))}
              </ul>
              <p className="basket-total">
                Total <span>{formatPrice(order.totalPence)}</span>
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
