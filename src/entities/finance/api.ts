import { useMutation, useQuery } from "@tanstack/react-query";

import api from "@/shared/api/apiClient";
import { useAuthStore } from "@/shared/model/auth";

interface BalanceResponse {
  data: {
    amount: string;
    currency: string;
  };
}

interface PaylinkResponse {
  data: {
    paylinkUrl: string;
  };
}

// 🔥 Реальные запросы к API
export const financeApi = {
  // 1. Получение баланса
  getBalance: async () => {
    const { data } = await api.get<BalanceResponse>("/profile/balance");
    return data.data; // Возвращает { amount: "7", currency: "KGS" }
  },

  // 2. Создание ссылки на оплату
  createPaylink: async (amount: string) => {
    // 🔥 Явно формируем строку, чтобы избежать проблем с сериализацией в apiClient
    const bodyString = `amount=${encodeURIComponent(amount)}`;

    const { data } = await api.post<PaylinkResponse>(
      "/balance/paylink",
      bodyString,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

    return data.data; // Возвращает { paylinkUrl: "https://..." }
  },

  // 3. История выводов (пока оставляем заглушку, если апи для истории еще нет)
  getWithdrawals: async () => {
    return [];
  },
};

// 🔥 Хук для баланса (Синхронизирует сервер с Zustand)
export const useBalance = () => {
  const token = useAuthStore((state) => state.accessToken);
  const updateUser = useAuthStore((state) => state.updateUser);

  return useQuery({
    queryKey: ["balance"],
    queryFn: async () => {
      const data = await financeApi.getBalance();

      // Синхронизируем баланс с Zustand, чтобы он обновился в шапке и кошельке.
      // Бэкенд отдает строку (например, "7"), мы можем хранить ее как есть.
      updateUser({ balance: data.amount });

      return data;
    },
    // Запрашиваем только если есть токен (юзер авторизован)
    enabled: !!token,
    // Обновляем раз в 30 секунд (полезно для WebView)
    refetchInterval: 30000,
  });
};

// 🔥 Хук для пополнения
export const useTopUp = () => {
  return useMutation({
    mutationFn: financeApi.createPaylink,
  });
};

export const useWithdrawals = () => {
  return useQuery({
    queryKey: ["withdrawals"],
    queryFn: financeApi.getWithdrawals,
  });
};
