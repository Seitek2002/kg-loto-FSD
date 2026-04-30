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
  // 1. Получение баланса
  getBalance: async () => {
    // 🔥 Добавлен слеш в конце
    const { data } = await api.get<BalanceResponse>("/profile/balance/");
    return data.data;
  },

  // 2. Создание ссылки на оплату
  createPaylink: async (amount: string) => {
    const bodyString = `amount=${encodeURIComponent(amount)}`;

    // 🔥 Добавлен слеш в конце
    const { data } = await api.post<PaylinkResponse>(
      "/balance/paylink/",
      bodyString,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

    return data.data;
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
