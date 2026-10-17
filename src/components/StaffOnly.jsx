import { useState, useEffect } from 'react';
import LoginForm from './LoginForm.jsx';

// Shows the login form until staff are logged in, then the page inside it
export default function StaffOnly({ children }) {
  const [staff, setStaff] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch('/api/me')
      .then(response => (response.ok ? response.json() : null))
      .then(data => setStaff(data))
      .catch(() => setStaff(null))
      .finally(() => setChecking(false));
  }, []);

  async function handleLogout() {
    await fetch('/api/logout', { method: 'POST' });
    setStaff(null);
  }

  if (checking) {
    return <p>Loading...</p>;
  }

  if (!staff) {
    return <LoginForm onLoggedIn={setStaff} />;
  }

  return (
    <div>
      <div className="staff-bar">
        <span>Logged in as {staff.username}</span>
        <button type="button" onClick={handleLogout}>Log out</button>
      </div>
      {children}
    </div>
  );
}
