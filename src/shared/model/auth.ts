import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface PhoneData {
  countryCode: string;
  dialCode: string;
  flag: string;
  number: string;
}

export interface KgLotteryProfile {
  email?: string | null;
  // Если с бэка приходят еще какие-то специфичные поля, добавишь их сюда
}

export interface User {
  id?: number | string;
  phone?: string | PhoneData; // Может быть строкой при логине, а потом объектом с бэка
  balance?: number | string; // Бэк возвращает строку "340.00"
  avatar?: string | null;

  // Новые поля от бэка
  firstName?: string | null;
  lastName?: string | null;
  middleName?: string | null;
  birthDate?: string | null;
  inn?: string | null;
  passportFront?: string | null;
  passportBack?: string | null;
  email?: string | null;
  isAccountApproved?: boolean;
  isAccountActive?: boolean;

  // Оставляем на случай, если есть вложенный профиль, хотя кажется бэк отдает плоским списком
  kglotteryProfile?: KgLotteryProfile;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isAuth: boolean;
  user: User | null;

  updateTokens: (newAccessToken: string, newRefreshToken?: string) => void;
  setTokens: (access: string, refresh: string) => void;
  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      isAuth: false,
      user: null,

      updateTokens: (newAccessToken, newRefreshToken) =>
        set((state) => ({
          accessToken: newAccessToken,
          ...(newRefreshToken && { refreshToken: newRefreshToken }),
        })),

      setTokens: (access, refresh) =>
        set({ accessToken: access, refreshToken: refresh, isAuth: true }),

      setUser: (user) => set({ user }),

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
      name: "auth-storage",
    },
  ),
);
