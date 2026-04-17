import { useQuery } from "@tanstack/react-query";

import api from "@/shared/api/apiClient";

import { QAItem } from "./types";

export const useFAQ = () => {
  return useQuery({
    queryKey: ["faq"],
    queryFn: async () => {
      const { data } = await api.get<{ data: QAItem[] }>("/qa/");
      return data.data || [];
    },
    staleTime: 1000 * 60 * 60, // FAQ меняется редко, можно кэшировать на час
  });
};
