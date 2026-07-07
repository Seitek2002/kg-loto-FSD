import { useMutation, useQuery } from "@tanstack/react-query";

import api from "@/shared/api/apiClient";

export interface LotteryMetaDto {
  backgroundImage?: string;
  timerBackgroundImage?: string;
  logo?: string;
  lotteryLogo?: string;
  drawCards?: DrawDto[];
}

export interface MyTicketDto {
  ticketId: string;
  lotteryId: string;
  // drawId теперь число (ltt_id)
  drawId: number;
  name: string;
  logo: string | null;
  purchaseDateDisplay: string;
  ticketNumber: string;
  // LTT-билеты не содержат пользовательской комбинации — поле опциональное
  combination?: number[];
  price: string;
  currency: string;
  status: "sold" | "winning" | "losing";
  purchaseDate: string;
  prizeAmount?: number | string;
  drawDate?: string;
  drawDateDisplay?: string;
  // Поля для печати/оформления билета (реальные LTT-билеты, купленные за баланс).
  // Для билетов через мок-биллинг combinations = [combination], barcodeValue/serial — пустые строки.
  combinations?: number[][];
  gridCount?: number | null;
  barcodeValue?: string;
  serial?: string;
  drawCode?: string;
  drawName?: string;
}

export interface DrawDto {
  drawId: number;
  title: string;
  drawNumber: number;
  drawNumberDisplay: string;
  drawDate: string;
  drawDateHuman: string;
  drawTime: string;
  drawTimeDisplay: string;
  // jackpotAmount у LTT-тиражей больше нет — оставлено опциональным
  jackpotAmount?: number;
  jackpotAmountDisplay?: string;
  location: string;
  // status — произвольная строка из LTT
  status: string;
  salesStartAt: string;
  salesStartAtDisplay: string;
  salesEndAt: string;
  salesEndAtDisplay: string;
}

// --- ИНТЕРФЕЙСЫ ДЛЯ ПОКУПКИ (POST) ---
// Путь C (legacy, billing-mock): POST /me/balance/purchases/
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

// Путь B (актуальный): покупка реального LTT-билета за баланс.
// POST /api/v1/me/balance/ltt-purchase/
export interface LttPurchasePayload {
  orderId: string; // уникальный ключ идемпотентности, генерируется на фронте
  tickets: string[]; // short_id билетов из LttTicket
  note?: string;
}

export interface LttPurchaseTicketResult {
  shortId: string;
  status: string;
}

export interface LttPurchaseResponse {
  orderId: string;
  status: "confirmed" | "rejected" | string;
  purchaseId: number;
  amount: string;
  balance: string;
  tickets: LttPurchaseTicketResult[];
}

// --- ИНТЕРФЕЙСЫ ДЛЯ ПОЛУЧЕНИЯ БИЛЕТОВ (GET) ---
export interface FetchTicketsParams {
  lotteryId: string;
  drawId: number | string;
  page?: number;
  limit?: number;
}

export interface TicketDto {
  ticketId: string;
  // short_id физического LTT-билета (нужен для покупки по пути B)
  shortId?: string;
  // Название лотереи — теперь дублируется в каждом билете (раньше было только на верхнем уровне ответа)
  name?: string;
  ticketNumber: string;
  // LTT-билеты не содержат пользовательской комбинации — поле опциональное
  combination?: number[];
  price: number;
  currency: string;
  status: string; // "available" | "sold" | "reserved" | "cancelled" | иные строки LTT
}

export interface TicketsResponseData {
  lotteryId: string;
  drawId: string | number;
  name?: string | null;
  page: number;
  limit: number;
  total: number;
  tickets: TicketDto[];
}

// Ответ v2-эндпоинта /api/v2/lottery/tickets/ (работает напрямую с LttTicket)
export interface LttTicketDto {
  shortId: string;
  ticketNumber?: string;
  price?: number | string;
  currency?: string;
  status?: string;
  wasSold?: boolean;
}

export interface FetchLttTicketsParams {
  // TODO(backend): уточнить, что именно передавать в draw_code (код тиража LTT).
  drawCode: string;
  status?: string;
  wasSold?: boolean;
}

// Статусы, при которых билет точно нельзя купить. Всё остальное
// (включая "at_web_service" — реальный статус доступного LTT-билета)
// считаем доступным: статусы у LTT произвольные, белый список ломается.
// Бэк с 07.07.2026 сам не отдаёт проданные билеты в GET /tickets/ по умолчанию —
// этот фильтр остаётся как подстраховка на случай явного ?status=... на бэке.
const UNAVAILABLE_TICKET_STATUSES = ["sold", "reserved", "cancelled"];

export const isTicketAvailable = (ticket: Pick<TicketDto, "status">) =>
  !UNAVAILABLE_TICKET_STATUSES.includes(ticket.status);

// При покупке уже проданного билета бэк отвечает 400 с телом вида
// { tickets: ["Билет <ticketId> уже продан"] } — показывать пользователю
// сырой текст с id билета нельзя, поэтому вырезаем понятную часть
export const getSoldTicketErrorMessage = (error: unknown): string | null => {
  const tickets = (
    error as { response?: { data?: { tickets?: unknown } } }
  )?.response?.data?.tickets;

  if (
    Array.isArray(tickets) &&
    tickets.some((t) => typeof t === "string" && /продан/i.test(t))
  ) {
    return "Этот билет уже продан";
  }

  return null;
};

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
  winningCombination?: number[] | null;
  currency: string;
}

// База для v2-эндпоинтов (apiClient настроен на /api/v1)
const V2_BASE = (
  process.env.NEXT_PUBLIC_API_URL || "https://kgloto.com/api/v1"
).replace(/\/v1\/?$/, "/v2");

// --- API ОБЪЕКТ ---
export const ticketApi = {
  // Получение доступных билетов
  getTickets: async (params: FetchTicketsParams) => {
    // 🔥 Добавлен слеш в конце
    const { data } = await api.get<{
      success: boolean;
      data: TicketsResponseData;
    }>("/tickets/", { params });
    return data.data;
  },

  // Получение short_id доступных LTT-билетов (v2, напрямую из LttTicket)
  getLttTickets: async (params: FetchLttTicketsParams) => {
    const { data } = await api.get<{ data: LttTicketDto[] } | LttTicketDto[]>(
      "/lottery/tickets/",
      {
        baseURL: V2_BASE,
        params: {
          drawCode: params.drawCode,
          status: params.status,
          wasSold: params.wasSold ?? false,
        },
      },
    );
    return Array.isArray(data) ? data : data.data;
  },

  // Путь C (legacy, billing-mock): покупка за баланс
  purchaseTickets: async (payload: PurchasePayload) => {
    const { data } = await api.post("/me/balance/purchases/", payload);
    return data;
  },

  // Путь B (актуальный): покупка реального LTT-билета за баланс
  lttPurchase: async (
    payload: LttPurchasePayload,
  ): Promise<LttPurchaseResponse> => {
    const { data } = await api.post<
      { data: LttPurchaseResponse } | LttPurchaseResponse
    >("/me/balance/ltt-purchase/", payload);
    return "data" in data ? data.data : data;
  },

  getCurrentDraw: async (lotteryId: string) => {
    const response = await api.get<{
      success: boolean;
      data: RawDrawDto[];
      meta: LotteryMetaDto; // Используем новый интерфейс
    }>("/draws/current/", {
      params: { lottery_id: lotteryId },
    });

    const meta = response.data?.meta || {};
    const drawCards = meta.drawCards || [];
    // status у LTT-тиражей — произвольная строка (активный тираж на проде имеет
    // статус "printing"), поэтому не полагаемся строго на "open": берём открытый
    // по статусу, иначе тираж с ещё не завершёнными продажами, иначе первый.
    const openDraw =
      drawCards.find((draw) => draw.status === "open") ||
      drawCards.find(
        (draw) =>
          !!draw.salesEndAt && new Date(draw.salesEndAt).getTime() > Date.now(),
      ) ||
      drawCards[0];

    if (!openDraw) return null;

    // 🔥 Возвращаем сам тираж И прикрепляем к нему объект meta
    return {
      ...openDraw,
      meta,
    };
  },

  getMyTickets: async () => {
    const { data } = await api.get<{ data: MyTicketDto[] }>(
      "/me/balance/tickets/",
    );
    return data.data;
  },

  // Скачивание PDF купленного за баланс LTT-билета (лицевая + оборотная сторона)
  downloadTicketPdf: async (ticketId: string): Promise<Blob> => {
    const { data } = await api.get<Blob>(
      `/me/balance/tickets/${ticketId}/pdf/`,
      { responseType: "blob" },
    );
    return data;
  },
};

// Инициирует скачивание Blob-файла браузером под заданным именем
const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
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
    // Доступность билетов — быстро меняющиеся данные (несколько человек могут
    // покупать одновременно), поэтому не полагаемся на общий 5-минутный кэш
    // и запрет рефетча при маунте из глобального QueryClient
    staleTime: 15 * 1000,
    refetchOnMount: "always",
  });
};

export const usePurchaseTickets = () => {
  return useMutation({
    mutationFn: ticketApi.purchaseTickets,
  });
};

// Путь B: покупка реального LTT-билета за баланс
export const useLttPurchase = () => {
  return useMutation({
    mutationFn: ticketApi.lttPurchase,
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

export const useDownloadTicketPdf = () => {
  return useMutation({
    mutationFn: async (ticketId: string) => {
      const blob = await ticketApi.downloadTicketPdf(ticketId);
      downloadBlob(blob, `kgloto_ticket_${ticketId}.pdf`);
    },
  });
};
