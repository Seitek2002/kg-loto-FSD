import { useQuery } from "@tanstack/react-query";

import api from "@/shared/api/apiClient";

import { PaginatedResult, Winner, WinnerLotteryOption } from "./types";

interface WinnersResponse {
  data: PaginatedResult<Winner>;
}

// Максимум страниц, которые пройдём вслед за курсором next — просто защита
// от зацикливания при некорректном ответе бэка, реальных данных сильно меньше
const MAX_PAGES = 50;

// Лотереи, по которым есть отмеченные победители — источник фильтра на
// экране /winners. Не пагинируется, авторизация не нужна.
export const useWinnerLotteries = () => {
  return useQuery({
    queryKey: ["winners-lotteries"],
    queryFn: async () => {
      const { data } = await api.get<
        WinnerLotteryOption[] | { data: WinnerLotteryOption[] }
      >("/winners/lotteries/");
      // На всякий случай поддерживаем и голый массив, и обёртку { data }
      return Array.isArray(data) ? data : data.data;
    },
  });
};

export const useWinners = (
  lotteryId?: string | number | (string | number)[],
) => {
  const ids = Array.isArray(lotteryId)
    ? lotteryId
    : lotteryId !== undefined
      ? [lotteryId]
      : [];

  return useQuery({
    queryKey: ["winners", ids], // 🔥 Ключ кэша теперь зависит от ID
    queryFn: async (): Promise<Winner[]> => {
      // 🔥 /winners/ отдаёт результаты постранично (по 10 на страницу).
      // Фильтр по лотерее передаём только в первом запросе — `next` уже
      // несёт его в query-строке для последующих страниц.
      const results: Winner[] = [];
      let nextUrl: string | null = "/winners/";
      let isFirst = true;

      for (let page = 0; page < MAX_PAGES; page++) {
        if (!nextUrl) break;
        const params =
          isFirst && ids.length > 0
            ? ids.length === 1
              ? { lotteryId: ids[0] }
              : { lotteryIds: ids.join(",") }
            : undefined;
        isFirst = false;
        const response: WinnersResponse = (
          await api.get<WinnersResponse>(nextUrl, { params })
        ).data;
        results.push(...(response?.data?.results || []));
        nextUrl = response?.data?.next ?? null;
      }

      return results;
    },
    staleTime: 1000 * 60 * 5,
  });
};
