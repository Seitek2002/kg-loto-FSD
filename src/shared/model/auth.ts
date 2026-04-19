import { create } from "zustand";
import { persist } from "zustand/middleware";

// 1. Четко описываем интерфейс пользователя
export interface User {
  id?: number | string;
  name?: string;
  phone?: string;
  balance?: number;
  kglotteryProfile?: any; // Можно типизировать позже, если потребуется
}

// 2. Интерфейс стора
interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isAuth: boolean;
  user: User | null;

  // Экшены
  updateTokens: (newAccessToken: string, newRefreshToken?: string) => void;
  setTokens: (access: string, refresh: string) => void;
  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void; // 🔥 Добавили метод для частичного обновления (например, только баланса)
  logout: () => void;
}

// 3. Создаем стор с persist
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // --- Начальное состояние ---
      accessToken: "mock_token", // Временно мок для тестов WebView
      refreshToken: null,
      isAuth: true,
      user: {
        name: "Сейтек",
        phone: "+996 555 123 456",
        balance: 150,
      },

      // --- Экшены ---
      updateTokens: (newAccessToken, newRefreshToken) =>
        set((state) => ({
          accessToken: newAccessToken,
          ...(newRefreshToken && { refreshToken: newRefreshToken }),
        })),

      setTokens: (access, refresh) =>
        set({ accessToken: access, refreshToken: refresh, isAuth: true }),

      setUser: (user) => set({ user }),

      // 🔥 Идеально для обновления баланса из React Query
      updateUser: (updates) =>
        set((state) => ({
          user: state.user
            ? { ...state.user, ...updates }
            : ({ ...updates } as User),
        })),

      logout: () =>
        set({
          accessToken: null,
          refreshToken: null,
          isAuth: false,
          user: null,
        }),
    }),
    {
      name: "auth-storage", // Ключ в localStorage
      // Указываем, какие поля НЕ нужно сохранять (по желанию)
      // partialize: (state) => Object.fromEntries(Object.entries(state).filter(([key]) => !['какоеТоПоле'].includes(key))),
    },
  ),
);
