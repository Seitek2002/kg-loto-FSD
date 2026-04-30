import { useQuery } from "@tanstack/react-query";

import api from "@/shared/api/apiClient";

import { SliderItem } from "./types";

export const useHeroSlides = () => {
  return useQuery({
    queryKey: ["hero-slides"],
    queryFn: async () => {
      // 🔥 Слеш и параметр webview=true
      const { data } = await api.get<{ data: SliderItem[] }>(
        "/slider/?webview=true",
      );
      return data.data || [];
    },
    // Кэшируем на 5 минут
    staleTime: 1000 * 60 * 5,
  });
};
