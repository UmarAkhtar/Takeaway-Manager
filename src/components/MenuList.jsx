import { formatPrice } from '../lib/money.js';

export default function MenuList({items}) {
    return (
    <ul>
          {items.map((item) => (<li key={item.id}>{item.name}: {formatPrice(item.price_pence)}</li>
            ))}
        </ul>
    );
}