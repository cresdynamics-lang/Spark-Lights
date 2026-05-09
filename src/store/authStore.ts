import { create } from 'zustand';

interface AuthState {
  user: any | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (user: any, token: string, refreshToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem('marigold_admin_user') || 'null'),
  token: localStorage.getItem('marigold_admin_token'),
  refreshToken: localStorage.getItem('marigold_admin_refresh_token'),
  isAuthenticated: !!localStorage.getItem('marigold_admin_token'),
  login: (user, token, refreshToken) => {
    localStorage.setItem('marigold_admin_user', JSON.stringify(user));
    localStorage.setItem('marigold_admin_token', token);
    localStorage.setItem('marigold_admin_refresh_token', refreshToken);
    set({ user, token, refreshToken, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('marigold_admin_user');
    localStorage.removeItem('marigold_admin_token');
    localStorage.removeItem('marigold_admin_refresh_token');
    set({ user: null, token: null, refreshToken: null, isAuthenticated: false });
  },
}));
