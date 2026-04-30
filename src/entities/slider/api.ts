import { useQuery } from "@tanstack/react-query";

import api from "@/shared/api/apiClient";

import { SliderItem } from "./types";

export const useHeroSlides = () => {
  return useQuery({
    queryKey: ["hero-slides"],
    queryFn: async () => {
      const { data } = await api.get<{ data: SliderItem[] }>("/slider/?webview=true");
      return data.data || [];
    },
    // Кэшируем на 5 минут, как договаривались
    staleTime: 1000 * 60 * 5,
  });
};
