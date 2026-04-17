import axios from 'axios';
import { useAuthStore } from '../model/auth';

// ==========================================
// УТИЛИТЫ ДЛЯ КОНВЕРТАЦИИ РЕГИСТРА (КЛЮЧЕЙ)
// ==========================================
const toCamelCase = (str: string) =>
  str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

const toSnakeCase = (str: string) =>
  str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

const isPlainObject = (obj: any): boolean => {
  return (
    obj !== null &&
    typeof obj === 'object' &&
    !Array.isArray(obj) &&
    !(obj instanceof FormData) &&
    !(obj instanceof File) &&
    !(obj instanceof Blob) &&
    !(obj instanceof Date)
  );
};

const keysToCamel = (obj: any): any => {
  if (isPlainObject(obj)) {
    const n: Record<string, any> = {};
    Object.keys(obj).forEach((k) => {
      n[toCamelCase(k)] = keysToCamel(obj[k]);
    });
    return n;
  } else if (Array.isArray(obj)) {
    return obj.map((i) => keysToCamel(i));
  }
  return obj;
};

const keysToSnake = (obj: any): any => {
  if (isPlainObject(obj)) {
    const n: Record<string, any> = {};
    Object.keys(obj).forEach((k) => {
      n[toSnakeCase(k)] = keysToSnake(obj[k]);
    });
    return n;
  } else if (Array.isArray(obj)) {
    return obj.map((i) => keysToSnake(i));
  }
  return obj;
};

// ==========================================
// НАСТРОЙКА AXIOS
// ==========================================
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://kgloto.com/api/v1',
  // Обрати внимание: я убрал жестко заданные заголовки Content-Type,
  // чтобы axios сам решал, когда отправлять JSON, а когда FormData (для файлов)
});

// 1. ПЕРЕХВАТЧИК ЗАПРОСОВ
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;

  // Добавляем токен
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Добавляем язык
  if (typeof document !== 'undefined') {
    const match = document.cookie.match(/(?:^|;\s*)NEXT_LOCALE=([^;]*)/);
    const locale = match ? match[1] : 'ru';
    config.headers['Accept-Language'] = locale;
  }

  // Конвертируем camelCase в snake_case перед отправкой
  if (config.data) {
    config.data = keysToSnake(config.data);
  }

  return config;
});

// 2. ПЕРЕХВАТЧИК ОТВЕТОВ (Конвертация + Авто-обновление токена)
api.interceptors.response.use(
  (response) => {
    // Успешный ответ: конвертируем snake_case в camelCase
    if (response.data) {
      response.data = keysToCamel(response.data);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 🔥 Логика обновления токена
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = useAuthStore.getState().refreshToken;

        if (!refreshToken) {
          useAuthStore.getState().logout();
          return Promise.reject(error);
        }

        // Важно: тут используем чистый axios, чтобы не сработали интерцепторы и конвертеры
        const refreshResponse = await axios.post(
          `${api.defaults.baseURL}/auth/token/refresh/`,
          {
            refresh: refreshToken,
          },
        );

        const newAccessToken =
          refreshResponse.data.data?.access || refreshResponse.data.access;
        const newRefreshToken =
          refreshResponse.data.data?.refresh || refreshResponse.data.refresh;

        useAuthStore.getState().updateTokens(newAccessToken, newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Сессия истекла', refreshError);
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    // Если это другая ошибка (не 401), конвертируем текст ошибки в camelCase для удобства на фронте
    if (error.response?.data) {
      error.response.data = keysToCamel(error.response.data);
    }

    return Promise.reject(error);
  },
);

export default api; // Не забудь экспортировать как default, если в других файлах импорт идет так
