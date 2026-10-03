import { formatPrice } from '../lib/money.js';

export default function MenuList({items}) {
    return (
    <ul className="menu-list">
          {items.map((item) => (
            <li key={item.id} className="menu-item">
              <span className="menu-item-name">{item.name}</span>
              <span className="menu-item-price">{formatPrice(item.price_pence)}</span>
            </li>
            ))}
        </ul>
    );
}