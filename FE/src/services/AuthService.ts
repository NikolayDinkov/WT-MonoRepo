import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/users`;

export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResult {
  token?: string;
  success: boolean;
  errorMessage?: string;
}

export const AuthService = {
  async login(payload: LoginPayload): Promise<AuthResult> {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, payload);
      if (response.status === 200 && response.data.token) {
        localStorage.setItem('token', response.data.token);
        return { token: response.data.token, success: true };
      }
      return {
        success: false,
        errorMessage: 'Login failed: Unexpected server response.',
      };
    } catch (error: any) {
      if (error.response) {
        const { data } = error.response;
        if (Array.isArray(data.errors)) {
          const messages = data.errors.map((err: any) => err.msg).join('\n');
          return { success: false, errorMessage: messages };
        } else if (data.message) {
          return { success: false, errorMessage: data.message };
        } else {
          return {
            success: false,
            errorMessage: 'Login failed: Unexpected server response.',
          };
        }
      } else {
        return {
          success: false,
          errorMessage: 'Login failed: Network error or server unavailable.',
        };
      }
    }
  },

  async register(payload: RegisterPayload): Promise<AuthResult> {
    try {
      const response = await axios.post(`${API_BASE_URL}/signup`, payload);
      if (response.status === 201 && response.data.token) {
        localStorage.setItem('token', response.data.token);
        return { token: response.data.token, success: true };
      }
      return {
        success: false,
        errorMessage: 'Unexpected error occurred during registration.',
      };
    } catch (error: any) {
      if (error.response) {
        const { data } = error.response;
        if (Array.isArray(data.errors)) {
          const messages = data.errors.map((err: any) => err.msg).join('\n');
          return { success: false, errorMessage: messages };
        } else if (data.message) {
          return { success: false, errorMessage: data.message };
        } else {
          return {
            success: false,
            errorMessage: 'Unexpected error occurred during registration.',
          };
        }
      } else {
        return {
          success: false,
          errorMessage: 'Network error or server not reachable.',
        };
      }
    }
  },
};

export default function getAuthToken() {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No auth token found');
  return token;
}
