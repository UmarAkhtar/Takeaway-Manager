import { Routes, Route, Link } from 'react-router';
import StaffPage from './components/StaffPage.jsx';
import CustomerMenu from './components/CustomerMenu.jsx';

export default function App() {

return(
    <div className="app">
      <header className="app-header">
        <h1>Takeaway Manager</h1>
        <nav className="app-nav">
          <Link to="/">Menu</Link>
          <Link to="/staff">Staff</Link>
        </nav>
      </header>
      <main className="app-main">
        <Routes>
          <Route path="/" element={<CustomerMenu />} />
          <Route path="/staff" element={<StaffPage />} />
        </Routes>
      </main>
    </div>

);

}
