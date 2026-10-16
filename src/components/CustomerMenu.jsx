import { useState, useEffect } from 'react';
import CategoryTabs from './CategoryTabs.jsx';
import { formatPrice } from '../lib/money.js';

export default function CustomerMenu() {
const [menu, setMenu] = useState([]);
const [categories, setCategories] = useState([]);
const [selectedCategory, setSelectedCategory] = useState(1);

useEffect(() => {
  fetch('/api/menu')
    .then(response => response.json())
    .then(data => setMenu(data))
    .catch(error => console.error('Error fetching menu:', error));

  fetch('/api/categories')
    .then(response => response.json())
    .then(data => setCategories(data))
    .catch(error => console.error('Error fetching categories:', error));
}, []);

const visibleItems = menu.filter((item) => item.category_id === selectedCategory);

return(
  <div>
    <CategoryTabs
      categories={categories}
      selectedCategory={selectedCategory}
      onSelectCategory={setSelectedCategory}
    />
    <ul className="menu-list">
      {visibleItems.map((item) => (
        <li key={item.id} className="menu-item">
          <span className="menu-item-name">{item.name}</span>
          <span className="menu-item-price">{formatPrice(item.price_pence)}</span>
        </li>
      ))}
    </ul>
  </div>
);
}