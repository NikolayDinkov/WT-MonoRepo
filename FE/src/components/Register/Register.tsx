import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import './Register.css';

interface RegisterProps {
  onRegisterSuccess: () => void;
}

export default function Register({ onRegisterSuccess }: RegisterProps) {
  const [errorMessage, setErrorMessage] = useState('');

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

    try {
      const response = await axios.post(
        'https://wt-monorepo.onrender.com/users/signup',
        {
          firstName,
          lastName,
          username,
          email,
          password,
          confirmPassword,
        }
      );

      if (response.status === 201) {
        const token = response.data.token;
        localStorage.setItem('token', token);
        //the alert could be removed, but since we dont have email confirmation will keep it for now
        alert('Registration successful!');
        onRegisterSuccess();
      }
    } catch (error: any) {
      if (error.response) {
        const { data } = error.response;
        //express-validator errors
        if (Array.isArray(data.errors)) {
          const messages = data.errors.map((err: any) => err.msg).join('\n');
          setErrorMessage(messages);
        } else if (data.message) {
          //custom backend errors
          setErrorMessage(data.message);
        } else {
          setErrorMessage('Unexpected error occurred during registration.');
        }
      } else {
        setErrorMessage('Network error or server not reachable.');
      }
    }
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
