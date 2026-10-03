export default function MenuList({items}) {
    return (
    <ul>
          {items.map((item) => (<li key={item.id}>{item.name}: £{(item.price_pence / 100).toFixed(2)}</li>
            ))}
        </ul>
    );
}