import { formatPrice } from '../lib/money.js';

export default function Basket({ basket, onAdd, onTakeAway, onPlaceOrder, placing, error }) {
  const totalPence = basket.reduce((sum, line) => sum + line.pricePence * line.quantity, 0);

  if (basket.length === 0) {
    return (
      <section className="basket" aria-label="Basket">
        <h2>Your basket</h2>
        <p className="basket-empty">Your basket is empty</p>
      </section>
    );
  }

  return (
    <section className="basket" aria-label="Basket">
      <h2>Your basket</h2>
      <ul className="basket-list">
        {basket.map((line) => (
          <li key={line.id} className="basket-line">
            <span className="basket-line-name">{line.quantity} × {line.name}</span>
            <span className="basket-line-actions">
              <button onClick={() => onTakeAway(line.id)} aria-label={`One less ${line.name}`}>−</button>
              <button onClick={() => onAdd(line)} aria-label={`One more ${line.name}`}>+</button>
              <span className="menu-item-price">{formatPrice(line.pricePence * line.quantity)}</span>
            </span>
          </li>
        ))}
      </ul>
      <p className="basket-total">
        Total <span>{formatPrice(totalPence)}</span>
      </p>
      {error && <p className="form-error">{error}</p>}
      <button className="place-order-button" onClick={onPlaceOrder} disabled={placing}>
        {placing ? 'Placing order…' : 'Place order'}
      </button>
    </section>
  );
}
