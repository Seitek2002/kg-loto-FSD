import { useMutation, useQuery } from "@tanstack/react-query";

import api from "@/shared/api/apiClient";

export interface DrawDto {
  drawId: string;
  lotteryId: string;
  drawNumber: number;
  status: string;
  jackpotAmount: number;
}

// --- ИНТЕРФЕЙСЫ ДЛЯ ПОКУПКИ (POST) ---
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

// --- ИНТЕРФЕЙСЫ ДЛЯ ПОЛУЧЕНИЯ БИЛЕТОВ (GET) ---
export interface FetchTicketsParams {
  lotteryId: string;
  drawId: string;
  page?: number;
  limit?: number;
}

export interface TicketDto {
  ticketId: string;
  ticketNumber: string;
  combination: number[];
  price: number;
  currency: string;
  status: "available" | "sold" | "reserved" | "cancelled";
}

export interface TicketsResponseData {
  lottery_id: string;
  draw_id: string;
  page: number;
  limit: number;
  total: number;
  tickets: TicketDto[];
}

// --- API ОБЪЕКТ ---
export const ticketApi = {
  // Получение доступных билетов
  getTickets: async (params: FetchTicketsParams) => {
    const { data } = await api.get<{
      success: boolean;
      data: TicketsResponseData;
    }>("/tickets", { params });
    return data.data;
  },

  // Покупка билетов с баланса
  purchaseTickets: async (payload: PurchasePayload) => {
    const { data } = await api.post("/me/balance/purchases/", payload);
    return data;
  },

  getCurrentDraw: async (lotteryId: string) => {
    const { data } = await api.get<{ data: DrawDto[] }>('/draws/current', {
      params: { lotteryId, status: 'open' }
    });
    // Бэкенд возвращает массив, берем первый открытый тираж
    return data.data[0] || null;
  },
};

// --- ХУКИ ---
export const useTickets = (
  params: FetchTicketsParams,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: ["tickets", params.lotteryId, params.drawId, params.page],
    queryFn: () => ticketApi.getTickets(params),
    enabled: enabled && !!params.lotteryId && !!params.drawId,
  });
};

export const usePurchaseTickets = () => {
  return useMutation({
    mutationFn: ticketApi.purchaseTickets,
  });
};

export const useCurrentDraw = (lotteryId: string) => {
  return useQuery({
    queryKey: ['currentDraw', lotteryId],
    queryFn: () => ticketApi.getCurrentDraw(lotteryId),
    enabled: !!lotteryId,
  });
};
