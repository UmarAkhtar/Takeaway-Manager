import MenuItemRow from './MenuItemForm.jsx';

export default function MenuList({ items, onPriceUpdated }) {
  return (
    <ul className="menu-list">
      {items.map((item) => (
        <MenuItemRow
          key={item.id}
          item={item}
          onPriceUpdated={onPriceUpdated}
        />
      ))}
    </ul>
  );
}