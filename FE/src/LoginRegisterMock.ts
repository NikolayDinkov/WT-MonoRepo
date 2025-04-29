interface User {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

export function registerUser(user: User): boolean {
  const usersJSON = localStorage.getItem('users');
  const users: User[] = usersJSON ? JSON.parse(usersJSON) : [];

  if (users.find((u) => u.username === user.username)) {
    alert('Username already exists!');
    return false;
  }

  users.push(user);
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('currentUser', user.username);
  return true;
}

export function loginUser(username: string, password: string): boolean {
  const usersJSON = localStorage.getItem('users');
  const users: User[] = usersJSON ? JSON.parse(usersJSON) : [];

  const found = users.find(
    (u) => u.username === username && u.password === password
  );
  if (!found) return false;

  localStorage.setItem('currentUser', username);
  return true;
}

export function getCurrentUser(): string | null {
  return localStorage.getItem('currentUser');
}

export function logoutUser() {
  localStorage.removeItem('currentUser');
}
