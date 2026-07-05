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

// 🔥 ИНТЕРФЕЙСЫ ДЛЯ ТРАНЗАКЦИЙ
export interface TransactionDto {
  date: string;
  amount: string;
  currency: string;
  paymentMethod: string;
  paymentStatus: string;
}

export interface TransactionsResponse {
  data: {
    page: number;
    limit: number;
    total: number;
    items: TransactionDto[];
  };
}

export const financeApi = {
  // 1. Получение баланса — актуальный контракт: GET /api/v1/me/balance/.
  // Пока он не задеплоен (404), откатываемся на старый /profile/balance/.
  getBalance: async () => {
    try {
      const { data } = await api.get<BalanceResponse>("/me/balance/");
      return data.data;
    } catch (error) {
      if (
        (error as { response?: { status?: number } })?.response?.status !== 404
      )
        throw error;
      const { data } = await api.get<BalanceResponse>("/profile/balance/");
      return data.data;
    }
  },

  // 2. Создание ссылки на оплату — POST /api/v1/me/balance/paylink/.
  // Пока он не задеплоен (404), откатываемся на старый /balance/paylink/.
  createPaylink: async (amount: string) => {
    // 🔥 Формируем динамический URL для возврата пользователя
    const redirectUrl = `${window.location.origin}/wallet`;
    // redirectUrl -> redirect_url через интерцептор
    const body = { amount: amount, redirectUrl };

    try {
      const { data } = await api.post<PaylinkResponse>(
        "/me/balance/paylink/",
        body,
      );
      return data.data;
    } catch (error) {
      if (
        (error as { response?: { status?: number } })?.response?.status !== 404
      )
        throw error;
      const { data } = await api.post<PaylinkResponse>(
        "/balance/paylink/",
        body,
      );
      return data.data;
    }
  },

  // 3. История транзакций
  getTransactions: async () => {
    const { data } = await api.get<TransactionsResponse>(
      "/me/balance/transactions/",
    );
    return data.data.items; // Возвращаем массив items
  },
};

// Хук для баланса
export const useBalance = () => {
  const token = useAuthStore((state) => state.accessToken);
  const updateUser = useAuthStore((state) => state.updateUser);

  return useQuery({
    queryKey: ["balance"],
    queryFn: async () => {
      const data = await financeApi.getBalance();
      updateUser({ balance: Number(data.amount) });

      return data;
    },
    enabled: !!token,
    refetchInterval: 30000,
  });
};

export const useTopUp = () => {
  return useMutation({
    mutationFn: financeApi.createPaylink,
  });
};

export const useTransactions = () => {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: financeApi.getTransactions,
  });
};
