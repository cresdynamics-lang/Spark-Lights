import { create } from 'zustand';

function readStoredUser(): Record<string, unknown> | null {
  try {
    const raw = localStorage.getItem('sparklights_admin_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function hasStoredToken(): boolean {
  return !!localStorage.getItem('sparklights_admin_token');
}

interface AuthState {
  user: Record<string, unknown> | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (user: Record<string, unknown>, token: string, refreshToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: readStoredUser(),
  token: localStorage.getItem('sparklights_admin_token'),
  refreshToken: localStorage.getItem('sparklights_admin_refresh_token'),
  isAuthenticated: hasStoredToken(),
  login: (user, token, refreshToken) => {
    localStorage.setItem('sparklights_admin_user', JSON.stringify(user));
    localStorage.setItem('sparklights_admin_token', token);
    localStorage.setItem('sparklights_admin_refresh_token', refreshToken);
    set({ user, token, refreshToken, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('sparklights_admin_user');
    localStorage.removeItem('sparklights_admin_token');
    localStorage.removeItem('sparklights_admin_refresh_token');
    set({ user: null, token: null, refreshToken: null, isAuthenticated: false });
  },
}));
