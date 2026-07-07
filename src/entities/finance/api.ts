import { useMutation, useQuery } from "@tanstack/react-query";

import api from "@/shared/api/apiClient";
import { useAuthStore } from "@/shared/model/auth";

interface BalanceResponse {
  data: {
    amount: string;
    currency: string;
  };
}

// Реальный ответ POST /balance/paylink/ обёрнут: { data: { paylinkUrl }, meta: {} }
interface PaylinkResponse {
  data: { paylinkUrl: string };
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
  // 1. Получение баланса — подтверждено бэком: актуальный путь — /profile/balance/
  getBalance: async () => {
    const { data } = await api.get<BalanceResponse>("/profile/balance/");
    return data.data;
  },

  // 2. Создание ссылки на оплату — подтверждено бэком (июль 2026): эндпоинт
  // снова включён на старом пути POST /balance/paylink/ (не /me/balance/paylink/),
  // ответ обёрнут в data
  createPaylink: async (amount: string) => {
    // 🔥 Формируем динамический URL для возврата пользователя
    const redirectUrl = `${window.location.origin}/wallet`;

    const { data } = await api.post<PaylinkResponse>("/balance/paylink/", {
      amount: amount,
      redirectUrl,
    });
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
