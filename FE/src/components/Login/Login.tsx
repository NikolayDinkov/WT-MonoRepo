import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import { useAuth } from '../../contexts/authContext';

export default function Login() {
  const [errorMessage, setErrorMessage] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    const result = await login({ username, password });
    if (result.success) {
      navigate('/my-drive');
    } else {
      setErrorMessage(result.errorMessage || 'Login failed.');
    }
  }

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h2>Login</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <input type="text" name="username" placeholder="Username" required />
      <input
        type="password"
        name="password"
        placeholder="Password"
        required
        minLength={6}
      />
      <button type="submit">Login</button>
      <p>
        Don't have an account?{' '}
        <Link to="/register">Click here to register</Link>
      </p>
    </form>
  );
}
