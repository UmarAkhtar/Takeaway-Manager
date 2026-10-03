import { useState } from 'react';
import { parsePrice } from '../lib/money.js';


export default function AddItemForm({ categories, onItemAdded }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState(1);
  const [error, setError] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();

    const pricePence = parsePrice(price);
    if (pricePence === null) {
      setError('Enter a price like 4.50');
      return;
    }

    const response = await fetch('/api/menu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, pricePence, categoryId }),
    });
    const data = await response.json();

    if (!response.ok) {
      setError(data.error);
      return;
    }

    onItemAdded(data);
    setName('');
    setPrice('');
    setError(null);
  }

  return (
    <form className="add-item-form" onSubmit={handleSubmit}>
      <h2>Add an item</h2>

      <label>
        Name
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </label>

      <label>
        Price
        <input
          value={price}
          placeholder="4.50"
          onChange={(event) => setPrice(event.target.value)}
        />
      </label>

      <label>
        Category
        <select
          value={categoryId}
          onChange={(event) => setCategoryId(Number(event.target.value))}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>

      <button type="submit">Add item</button>

      {error && <p className="form-error">{error}</p>}
    </form>
  );
}