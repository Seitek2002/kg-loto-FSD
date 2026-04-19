import { useQuery } from "@tanstack/react-query";

import api from "@/shared/api/apiClient";

import { LotteryItem } from "./types";

export interface CurrentLottery {
  lotteryId: string;
  code: string;
  name: string;
  description: string;
  currency: string;
  ticketPrice: number;
  minNumbers: number;
  maxNumbers: number;
  fieldSize: number;
  saleStatus: string;
  saleStartAt: string;
  saleEndAt: string;
}

export const useLotteries = () => {
  return useQuery({
    queryKey: ["lotteries"],
    queryFn: async () => {
      const { data } = await api.get<{ data: LotteryItem[] }>("/lotteries/");
      return data.data || [];
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useCurrentLotteries = () => {
  return useQuery({
    queryKey: ["lotteries-current"],
    queryFn: async (): Promise<CurrentLottery[]> => {
      const { data } = await api.get("/lotteries/current");
      return data.data;
    },
    staleTime: 1 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
};
