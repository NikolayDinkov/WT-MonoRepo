import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';
import axios from 'axios';

export default function Login() {
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    try {
      const response = await axios.post('http://localhost:3000/users/login', {
        username,
        password,
      });

      if (response.status === 200) {
        const token = response.data.token;
        localStorage.setItem('token', token);
        window.location.href = '/';
      }
    } catch (error: any) {
      if (error.response) {
        const { data } = error.response;

        if (Array.isArray(data.errors)) {
          const messages = data.errors.map((err: any) => err.msg).join('\n');
          setErrorMessage(messages);
        } else if (data.message) {
          setErrorMessage(data.message);
        } else {
          setErrorMessage('Login failed: Unexpected server response.');
        }
      } else {
        setErrorMessage('Login failed: Network error or server unavailable.');
      }
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
