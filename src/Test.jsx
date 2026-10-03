import { useState, useEffect } from 'react';



function Test() {
    return <h1>Takeaway Manager</h1>;
  };


  function Button({text = "Click me"}) {
    return <button>{text}</button>;
  };

  function ShowMenu(){
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

    return (
      <div>
        <div className="tabs">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={category.id === selectedCategory ? 'active' : ''}
            >
              {category.name}
            </button>
          ))}
        </div>

        <ul>
          {menu
            .filter((item) => item.category_id === selectedCategory)
            .map((item) => (
              <li key={item.id}>{item.name}: £{(item.price_pence / 100).toFixed(2)}</li>
            ))}
        </ul>
      </div>
    );
}

  export {
    Test,
    Button,
    ShowMenu
  }