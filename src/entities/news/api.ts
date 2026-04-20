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

// Получение списка новостей
export async function getNewsData(locale: string = "ru"): Promise<NewsItem[]> {
  try {
    const { data } = await api.get<ApiResponse<PaginatedResult<NewsItem>>>(
      "/news/",
      {
        headers: { "Accept-Language": locale },
      },
    );
    return data.data.results || [];
  } catch (error) {
    console.error("News Error:", error);
    return [];
  }
}

// Получение детальной новости
export async function getNewsDetail(
  slugOrId: string,
  locale: string = "ru",
): Promise<NewsItem | null> {
  try {
    const { data } = await api.get<ApiResponse<NewsItem>>(
      `/news/${slugOrId}/`,
      {
        headers: { "Accept-Language": locale },
      },
    );
    return data.data;
  } catch (error) {
    console.error(`Error fetching news ${slugOrId}:`, error);
    return null;
  }
}
