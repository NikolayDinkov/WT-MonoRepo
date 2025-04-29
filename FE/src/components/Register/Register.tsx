import { Link } from 'react-router-dom';
import './Register.css';
import { registerUser } from '../../LoginRegisterMock';

export default function Register() {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const username = formData.get('username') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const success = registerUser({
      firstName,
      lastName,
      username,
      email,
      password,
    });
    if (success) {
      window.location.href = '/';
    }
  }

  return (
    <form className="register-form" onSubmit={handleSubmit}>
      <h2>Register</h2>
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
