// src/entities/draw/api.ts
import { useQuery } from "@tanstack/react-query";

import api from "@/shared/api/apiClient";

export interface CurrentDraw {
  drawId: string;
  lotteryId: string;
  drawNumber: number;
  drawDate: string;
  drawTime: string;
  salesStartAt: string;
  salesEndAt: string;
  status: "open" | "closed" | "completed" | "cancelled";
  winningCombination: number[] | null;
  jackpotAmount: number;
  currency: string;
}

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
