import { useState } from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '../../contexts/authContext';

import './Register.css';

export default function Register() {
  const [errorMessage, setErrorMessage] = useState('');
  const { register } = useAuth();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const username = formData.get('username') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    const result = await register({
      firstName,
      lastName,
      username,
      email,
      password,
      confirmPassword,
    });
    if (!result.success) {
      setErrorMessage(result.errorMessage || 'Registration failed.');
      return;
    }
    // On success, context will update and redirect handled by App
  }

  return (
    <form className="register-form" onSubmit={handleSubmit}>
      <h2>Register</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <input type="text" name="firstName" placeholder="First Name" required />
      <input type="text" name="lastName" placeholder="Last Name" required />
      <input type="text" name="username" placeholder="Username" required />
      <input type="email" name="email" placeholder="Email" required />
      <input type="password" name="password" placeholder="Password" required />
      <input
        type="password"
        name="confirmPassword"
        placeholder="Confirm Password"
        required
      />
      <p>
        Already have an account? <Link to="/login">Click here to login</Link>
      </p>
      <button>Register</button>
    </form>
  );
}
