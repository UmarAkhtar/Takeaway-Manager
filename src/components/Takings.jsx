import { useState, useEffect } from 'react';
import { formatPrice } from '../lib/money.js';

export default function Takings() {
  // No date picked yet means the server uses today
  const [date, setDate] = useState(null);
  const [takings, setTakings] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const url = date ? `/api/takings?date=${date}` : '/api/takings';
    fetch(url)
      .then(async response => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Could not load takings');
        }
        return data;
      })
      .then(data => {
        setTakings(data);
        setError(null);
      })
      .catch(err => setError(err.message));
  }, [date]);

  return (
    <div className="takings">
      <div className="takings-header">
        <h2>End of day takings</h2>
        <label>
          Day
          <input
            type="date"
            value={takings?.date || ''}
            onChange={event => event.target.value && setDate(event.target.value)}
          />
        </label>
      </div>

      {error && <p className="form-error">{error}</p>}
      {!takings && !error && <p>Loading...</p>}

      {takings && (
        <>
          <div className="takings-summary">
            <div>
              <span>Orders</span>
              <strong>{takings.orderCount}</strong>
            </div>
            <div>
              <span>Total taken</span>
              <strong>{formatPrice(takings.totalPence)}</strong>
            </div>
          </div>

          {takings.items.length === 0 ? (
            <p className="basket-empty">No orders on this day</p>
          ) : (
            <table className="takings-table">
              <thead>
                <tr>
                  <th scope="col">Item</th>
                  <th scope="col">Sold</th>
                  <th scope="col">Taken</th>
                </tr>
              </thead>
              <tbody>
                {takings.items.map(item => (
                  <tr key={item.name}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>{formatPrice(item.totalPence)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}
