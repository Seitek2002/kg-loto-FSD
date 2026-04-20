import { useMutation } from "@tanstack/react-query";

import api from "@/shared/api/apiClient";

// Интерфейс того, что ждет бэкенд (как на скрине)
export interface PurchaseItem {
  lotteryId: string;
  drawId: string;
  ticketId: string;
  price: string;
  currency: string;
}

export interface PurchasePayload {
  orderId: string;
  purchaseDatetime: string;
  items: PurchaseItem[];
}

export const ticketApi = {
  // Реальный запрос на покупку
  purchaseWithBalance: async (payload: PurchasePayload) => {
    const { data } = await api.post("/me/balance/purchases/", payload);
    return data;
  },
};

// Хук, который мы будем вызывать в Корзине
export const usePurchaseTickets = () => {
  return useMutation({
    mutationFn: ticketApi.purchaseWithBalance,
  });
};
