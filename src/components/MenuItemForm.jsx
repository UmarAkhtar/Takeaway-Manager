import { useState } from 'react';
import { formatPrice, parsePrice } from '../lib/money.js';

export default function MenuItemRow({ item, onItemUpdated }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftPrice, setDraftPrice] = useState('');
  const [error, setError] = useState(null);

  function startEditing() {
    setDraftPrice((item.price_pence / 100).toFixed(2));
    setError(null);
    setIsEditing(true);
  }

  function cancelEditing() {
    setIsEditing(false);
    setError(null);
  }

  async function handleSave() {
    const pricePence = parsePrice(draftPrice);
    if (pricePence === null) {
      setError('Enter a price like 4.50');
      return;
    }

    const response = await fetch(`/api/menu/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pricePence }),
    });
    const data = await response.json();

    if (!response.ok) {
      setError(data.error);
      return;
    }

    onItemUpdated(data);
    setIsEditing(false);
  }

  async function handleToggleActive() {
    const response = await fetch(`/api/menu/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !item.active }),
    });
    const data = await response.json();

    if (!response.ok) {
      setError(data.error);
      return;
    }

    setError(null);
    onItemUpdated(data);
  }

  if (isEditing) {
    return (
      <li className="menu-item">
        <span className="menu-item-name">{item.name}</span>
        <span className="menu-item-actions">
          <input
            className="price-input"
            aria-label={`Price for ${item.name}`}
            value={draftPrice}
            onChange={(event) => setDraftPrice(event.target.value)}
          />
          <button type="button" onClick={handleSave}>Save</button>
          <button type="button" onClick={cancelEditing}>Cancel</button>
        </span>
        {error && <p className="form-error">{error}</p>}
      </li>
    );
  }

  return (
    <li className={item.active ? 'menu-item' : 'menu-item menu-item-off'}>
      <span className="menu-item-name">
        {item.name}
        {!item.active && <span className="off-label">Off</span>}
      </span>
      <span className="menu-item-actions">
        <span className="menu-item-price">{formatPrice(item.price_pence)}</span>
        <button type="button" onClick={startEditing}>Edit</button>
        <button type="button" onClick={handleToggleActive}>
          {item.active ? 'Turn off' : 'Turn on'}
        </button>
      </span>
      {error && <p className="form-error">{error}</p>}
    </li>
  );
}