'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Агрессивное кэширование для WebView
            staleTime: 1000 * 60 * 5, // Данные свежие 5 минут
            gcTime: 1000 * 60 * 30, // Храним в кэше 30 минут
            refetchOnWindowFocus: false, // В WebView это часто глючит при сворачивании приложения
            refetchOnMount: false, // Не делаем запрос при каждом маунте, если данные свежие
            retry: 1, // При ошибке сети пробуем еще 1 раз (для мобильного интернета)
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Devtools можно будет отключить перед билдом для продакшена */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}