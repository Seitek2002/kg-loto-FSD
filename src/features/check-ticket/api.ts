import { useMutation } from '@tanstack/react-query';
import api from '@/shared/api/apiClient';

export interface CheckTicketResponse {
  isWinning: boolean;
  combinationId: number;
  message: string;
  prizeType: string;
  prizeAmount: string | null;
  prizeProduct: string | null;
}

export const useCheckTicket = () => {
  return useMutation({
    mutationFn: async (code: string) => {
      const { data } = await api.post<{ data: CheckTicketResponse }>('/me/combination/check/', { code });
      return data.data;
    },
  });
};