import { Routes, Route, Link } from 'react-router';
import StaffPage from './components/StaffPage.jsx';
import CustomerMenu from './components/CustomerMenu.jsx';
import KitchenScreen from './components/KitchenScreen.jsx';
import MyOrders from './components/MyOrders.jsx';
import StaffOnly from './components/StaffOnly.jsx';

export default function App() {

return(
    <div className="app">
      <header className="app-header">
        <h1>Takeaway Manager</h1>
        <nav className="app-nav">
          <Link to="/">Menu</Link>
          <Link to="/my-orders">My orders</Link>
          <Link to="/staff">Staff</Link>
          <Link to="/kitchen">Kitchen</Link>
        </nav>
      </header>
      <main className="app-main">
        <Routes>
          <Route path="/" element={<CustomerMenu />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/staff" element={<StaffPage />} />
          <Route path="/kitchen" element={<StaffOnly><KitchenScreen /></StaffOnly>} />
        </Routes>
      </main>
    </div>

);

}
