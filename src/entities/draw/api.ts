// src/entities/draw/api.ts
import { useQuery } from "@tanstack/react-query";

import api from "@/shared/api/apiClient";

export const useCurrentDraws = (lotteryId?: string) => {
  return useQuery({
    queryKey: ["draws", lotteryId],
    queryFn: async () => {
      const { data } = await api.get("/draws/current", {
        params: { lotteryId },
      });
      return data.data;
    },
    enabled: !!lotteryId,
    staleTime: 1 * 60 * 1000,
  });
};
