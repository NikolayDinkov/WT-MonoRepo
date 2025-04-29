import { Link } from 'react-router-dom';
import './Login.css';
import { loginUser } from '../../LoginRegisterMock';

export default function Login() {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    const success = loginUser(username, password);
    if (success) {
      window.location.href = '/';
    } else {
      alert('Invalid login data.');
    }
  }

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h2>Login</h2>
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
