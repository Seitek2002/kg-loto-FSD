import { useMutation, useQuery } from "@tanstack/react-query";

import api from "@/shared/api/apiClient";

export interface MyTicketDto {
  ticketId: string;
  lotteryId: string;
  drawId: string;
  name: string;
  logo: string | null;
  purchaseDateDisplay: string;
  ticketNumber: string;
  combination: number[];
  price: string;
  currency: string;
  status: "sold" | "winning" | "losing";
  purchaseDate: string;
  prizeAmount?: number | string;
}

export interface DrawDto {
  drawId: string;
  title: string;
  drawNumber: number;
  drawNumberDisplay: string;
  drawDate: string;
  drawDateHuman: string;
  drawTime: string;
  drawTimeDisplay: string;
  jackpotAmount: number;
  jackpotAmountDisplay: string;
  location: string;
  status: "open" | "closed" | "completed";
  salesStartAt: string;
  salesStartAtDisplay: string;
  salesEndAt: string;
  salesEndAtDisplay: string;
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

export interface LotteryRuleDto {
  id: number;
  image: string;
  text: string;
  order: number;
}

export interface LotteryUiDto {
  backgroundImage: string | null;
  logo: string | null;
  rules: LotteryRuleDto[];
}

export interface RawDrawDto extends Omit<DrawDto, "title"> {
  winningCombination: number[] | null;
  currency: string;
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
    // 🔥 Теперь всё строго типизировано, никаких any!
    const response = await api.get<{
      success: boolean;
      data: RawDrawDto[];
      meta: {
        drawCards?: DrawDto[];
        lotteryUi?: LotteryUiDto;
      };
    }>("/draws/current", {
      params: { lotteryId },
    });

    const drawCards = response.data?.meta?.drawCards || [];

    // Ищем открытый тираж среди карточек
    const openDraw = drawCards.find((draw) => draw.status === "open");

    return openDraw || null;
  },

  getMyTickets: async () => {
    const { data } = await api.get<{ data: MyTicketDto[] }>(
      "/me/balance/tickets/",
    );
    return data.data;
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
    queryKey: ["currentDraw", lotteryId],
    queryFn: () => ticketApi.getCurrentDraw(lotteryId),
    enabled: !!lotteryId,
  });
};

export const useMyTickets = () => {
  return useQuery({
    queryKey: ["myTickets"],
    queryFn: ticketApi.getMyTickets,
  });
};
