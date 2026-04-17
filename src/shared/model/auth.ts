import { create } from 'zustand';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isAuth: boolean;
  updateTokens: (access: string, refresh: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  // Для тестов WebView ставим isAuth: true и моковый токен (потом заменим на логику моста)
  accessToken: 'mock_token', 
  refreshToken: null,
  isAuth: true, 
  updateTokens: (access, refresh) => set({ accessToken: access, refreshToken: refresh, isAuth: true }),
  logout: () => set({ accessToken: null, refreshToken: null, isAuth: false }),
}));