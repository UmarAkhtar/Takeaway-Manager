import { useState } from 'react';

export default function LoginForm({ onLoggedIn }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();

    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();

    if (!response.ok) {
      setError(data.error);
      return;
    }

    onLoggedIn(data);
  }

  return (
    <form className="add-item-form" onSubmit={handleSubmit}>
      <h2>Staff login</h2>

      <label>
        Username
        <input
          value={username}
          autoComplete="username"
          onChange={(event) => setUsername(event.target.value)}
        />
      </label>

      <label>
        Password
        <input
          type="password"
          value={password}
          autoComplete="current-password"
          onChange={(event) => setPassword(event.target.value)}
        />
      </label>

      {error && <p className="form-error">{error}</p>}

      <button type="submit">Log in</button>
    </form>
  );
}
