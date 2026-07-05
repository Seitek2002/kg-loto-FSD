// src/entities/draw/api.ts
import { useQuery } from "@tanstack/react-query";

import api from "@/shared/api/apiClient";

export interface CurrentDraw {
  // drawId теперь число (ltt_id), а не строка вида "draw-YYYYMMDD-NNN"
  drawId: number;
  // lotteryId — реальный код типа игры из LTT (game_type_code), строка
  lotteryId: string;
  drawNumber: number;
  drawDate: string;
  drawTime: string;
  salesStartAt: string;
  salesEndAt: string;
  // status — произвольная строка статуса из LTT ("finished", "printing", ...),
  // не фиксированный набор. Не делать строгий switch по значениям.
  status: string;
  // Полей winningCombination/jackpotAmount у LTT-тиражей больше нет — оставлены
  // опциональными для обратной совместимости отрисовки.
  winningCombination?: number[] | null;
  jackpotAmount?: number;
  currency: string;
  lotteryLogo?: string | null;
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
