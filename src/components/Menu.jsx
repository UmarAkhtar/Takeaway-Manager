import CategoryTabs from './CategoryTabs.jsx';
import MenuList from './MenuList.jsx';
import AddItemForm from './AddItemForm.jsx';
import { useState, useEffect } from 'react';



export default function Menu() {
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
  <MenuList
      items={visibleItems}
      onPriceUpdated={(updatedItem) =>
        setMenu(menu.map((item) => (item.id === updatedItem.id ? updatedItem : item)))
      }
    />
    <AddItemForm
  categories={categories}
  onItemAdded={(newItem) => setMenu([...menu, newItem])}
/>
  </div>
);
}