import MenuItemRow from './MenuItemForm.jsx';

export default function MenuList({ items, onItemUpdated, onItemRemoved }) {
  return (
    <ul className="menu-list">
      {items.map((item) => (
        <MenuItemRow
          key={item.id}
          item={item}
          onItemUpdated={onItemUpdated}
          onItemRemoved={onItemRemoved}
        />
      ))}
    </ul>
  );
}