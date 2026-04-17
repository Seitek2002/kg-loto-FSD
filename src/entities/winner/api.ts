import { useQuery } from "@tanstack/react-query";

import api from "@/shared/api/apiClient";

// import { PaginatedResult, Winner } from './types';

export const useWinners = () => {
  return useQuery({
    queryKey: ["winners"],
    queryFn: async () => {
      // Подставь правильный тип ответа согласно твоему бэкенду
      const { data } = await api.get<any>("/winners/");
      return data?.data?.results || [];
    },
    staleTime: 1000 * 60 * 5,
  });
};
