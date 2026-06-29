import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  login: (token: string, user: any) => void;
  logout: () => void;
}

const getInitialUser = () => {
  const userStr = localStorage.getItem('mock_user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
  return null;
};

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: !!localStorage.getItem('lokaal_token'),
  user: getInitialUser(),
  login: (token, user) => {
    localStorage.setItem('lokaal_token', token);
    localStorage.setItem('mock_user', JSON.stringify(user));
    set({ isAuthenticated: true, user });
  },
  logout: () => {
    localStorage.removeItem('lokaal_token');
    localStorage.removeItem('mock_user');
    set({ isAuthenticated: false, user: null });
  },
}));
