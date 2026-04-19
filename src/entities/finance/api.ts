import { useMutation, useQuery } from "@tanstack/react-query";

import { useAuthStore } from "@/shared/model/auth";

// Заглушка API-методов (чтобы код работал)
const financeApi = {
  getBalance: async () => {
    // В реальном проекте: const { data } = await api.get('/me/balance/'); return data;
    return { amount: 150 };
  },
  getWithdrawals: async () => {
    // const { data } = await api.get('/me/withdrawals/'); return data;
    return [
      {
        id: 1,
        createdAt: "2026-04-02T12:00:00Z",
        amount: 500,
        method: "mbank",
        status: "completed",
      },
      {
        id: 2,
        createdAt: "2026-04-01T10:00:00Z",
        amount: 1000,
        method: "visa",
        status: "pending",
      },
    ];
  },
  createPaylink: async (amount: string) => {
    // const { data } = await api.post('/me/paylink/', { amount }); return data;
    return { paylinkUrl: "https://mbank.kg/pay" };
  },
};

export const useBalance = () => {
  const token = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: ["balance"],
    queryFn: async () => {
      const data = await financeApi.getBalance();
      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
        // useAuthStore.setState({ user: { ...currentUser, balance: data.amount } });
      }
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

export const useWithdrawals = () => {
  return useQuery({
    queryKey: ["withdrawals"],
    queryFn: financeApi.getWithdrawals,
  });
};
