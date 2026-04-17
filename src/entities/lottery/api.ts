import { useQuery } from "@tanstack/react-query";

import api from "@/shared/api/apiClient";

import { LotteryItem } from "./types";

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
