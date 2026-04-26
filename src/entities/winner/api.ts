import { useQuery } from "@tanstack/react-query";

import api from "@/shared/api/apiClient";

import { PaginatedResult, Winner } from "./types";

interface WinnersResponse {
  data: PaginatedResult<Winner>;
}

export const useWinners = (lotteryId?: string) => {
  return useQuery({
    queryKey: ["winners", lotteryId], // 🔥 Ключ кэша теперь зависит от ID
    queryFn: async (): Promise<Winner[]> => {
      const { data } = await api.get<WinnersResponse>("/winners/", {
        params: lotteryId ? { lotteryId } : undefined, // 🔥 Передаем параметр
      });
      return data?.data?.results || [];
    },
    staleTime: 1000 * 60 * 5,
  });
};
