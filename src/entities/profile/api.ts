import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import api from "@/shared/api/apiClient";
import { User, useAuthStore } from "@/shared/model/auth";

export const profileApi = {
  getMe: async () => {
    const { data } = await api.get<{ data: User }>("/profile/me/");
    return data.data;
  },

  updateProfile: async (formData: FormData) => {
    const { data } = await api.patch<{ data: User }>("/profile/me/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data.data;
  },
};

export const useProfile = () => {
  const token = useAuthStore((state) => state.accessToken);
  const updateUser = useAuthStore((state) => state.updateUser);

  return useQuery({
    queryKey: ["profile-me"],
    queryFn: async () => {
      const userData = await profileApi.getMe();
      updateUser(userData);
      return userData;
    },
    enabled: !!token,
  });
};

// 🔥 Добавляем хук мутации для обновления данных
export const useUpdateProfile = () => {
  const updateUser = useAuthStore((state) => state.updateUser);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: profileApi.updateProfile,
    onSuccess: (data) => {
      // При успехе сразу обновляем стор и кэш React Query
      updateUser(data);
      queryClient.invalidateQueries({ queryKey: ["profile-me"] });
    },
  });
};
