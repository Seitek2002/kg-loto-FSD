import { useQuery } from "@tanstack/react-query";

import api from "@/shared/api/apiClient";

export interface PaginatedResult<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiResponse<T> {
  data: T;
  meta: Record<string, unknown>;
  errors?: unknown[];
}

export interface NewsItem {
  id: number | string;
  title: string;
  slug: string;
  shortText: string;
  content?: string;
  image: string | null;
  publishedAt: string | null;
  theme: "dark" | "light" | "blue";
  descriptionPosition: "none" | "top" | "bottom";
}

export const newsApi = {
  // Получение списка новостей
  getNews: async (): Promise<NewsItem[]> => {
    // Язык подхватится автоматически перехватчиками axios или браузером
    const { data } =
      await api.get<ApiResponse<PaginatedResult<NewsItem>>>("/news/");
    return data.data.results || [];
  },

  // Получение детальной новости
  getNewsDetail: async (slugOrId: string): Promise<NewsItem | null> => {
    const { data } = await api.get<ApiResponse<NewsItem>>(`/news/${slugOrId}/`);
    return data.data;
  },
};

// --- ХУКИ ---
export const useNews = () => {
  return useQuery({
    queryKey: ["news"],
    queryFn: newsApi.getNews,
    initialData: [], // Чтобы при первой отрисовке не было undefined
  });
};

export const useNewsDetail = (slugOrId: string) => {
  return useQuery({
    queryKey: ["news", slugOrId],
    queryFn: () => newsApi.getNewsDetail(slugOrId),
    enabled: !!slugOrId, // Запрос не пойдет, если нет slug
  });
};
