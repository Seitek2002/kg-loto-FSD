import { useQuery } from "@tanstack/react-query";

import api from "@/shared/api/apiClient";

import { PaginatedResult, Winner } from "./types";

interface WinnersResponse {
  data: PaginatedResult<Winner>;
}

export const useWinners = () => {
  return useQuery({
    queryKey: ["winners"],
    queryFn: async (): Promise<Winner[]> => {
      const { data } = await api.get<WinnersResponse>("/winners/");
      return data?.data?.results || [];
    },
    staleTime: 1000 * 60 * 5,
  });
};
