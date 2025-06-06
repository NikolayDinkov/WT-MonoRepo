import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { jwtDecode } from 'jwt-decode';
import JwtPayload from '../interfaces/JwtPayload';
import {
  AuthService,
  LoginPayload,
  RegisterPayload,
  AuthResult,
} from '../services/AuthService';

interface AuthContextType {
  isLoggedIn: boolean;
  userId: string | null;
  login: (payload: LoginPayload) => Promise<AuthResult>;
  register: (payload: RegisterPayload) => Promise<AuthResult>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        setUserId(decoded.userId);
        setIsLoggedIn(true);
      } catch {
        setIsLoggedIn(false);
        setUserId(null);
      }
    } else {
      setIsLoggedIn(false);
      setUserId(null);
    }
  }, []);

  const login = async (payload: LoginPayload) => {
    const result = await AuthService.login(payload);
    if (result.success && result.token) {
      try {
        const decoded = jwtDecode<JwtPayload>(result.token);
        setUserId(decoded.userId);
        setIsLoggedIn(true);
      } catch {
        setIsLoggedIn(false);
        setUserId(null);
      }
    }
    return result;
  };

  const register = async (payload: RegisterPayload) => {
    const result = await AuthService.register(payload);
    if (result.success && result.token) {
      try {
        const decoded = jwtDecode<JwtPayload>(result.token);
        setUserId(decoded.userId);
        setIsLoggedIn(true);
      } catch {
        setIsLoggedIn(false);
        setUserId(null);
      }
    }
    return result;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserId(null);
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, userId, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
