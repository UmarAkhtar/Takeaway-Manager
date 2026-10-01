import { useState, useEffect } from 'react';



function Test() {
    return <h1>Takeaway Manager</h1>;
  };


  function Button({text = "Click me"}) {
    return <button>{text}</button>;
  };

  function ShowMenu(){
    const [menu, setMenu] = useState([]);

    useEffect(() => {
      fetch('/api/menu')
        .then(response => response.json())
        .then(data => setMenu(data))
        .catch(error => console.error('Error fetching menu:', error));
    }, []);

      return (
  <ul>
    {menu.map((item) => (
      <li key={item.id}>{item.name}: £{(item.price_pence / 100).toFixed(2)}</li>
    ))}
  </ul>
);
}

  export {
    Test,
    Button,
    ShowMenu
  }