import { Metadata } from "next";
import { cookies } from "next/headers";

import type { NewsItem } from "@/entities/news/api";

import api from "@/shared/api/apiClient";

import { NewsListContent } from "./NewsListContent";

export const metadata: Metadata = {
  title: "KGLOTO | Новости",
};

async function getAllNews(): Promise<NewsItem[]> {
  try {
    // В Next.js 15 cookies() вызывается асинхронно
    const cookieStore = await cookies();
    const locale = cookieStore.get("NEXT_LOCALE")?.value || "ru";

    const { data } = await api.get("/news/", {
      headers: { "Accept-Language": locale },
    });

    console.log(data);

    return data?.data?.results || [];
  } catch (error) {
    console.error("Error fetching news:", error);

    // 🔥 Возвращаем моковые данные, если бэкенд недоступен, чтобы страница не падала
    return [
      {
        id: 1,
        title: "Запуск новой лотереи!",
        slug: "new-loto",
        shortText: "Мы запустили новую супер лотерею с невероятным джекпотом.",
        image: null,
        publishedAt: null,
        theme: "blue",
        descriptionPosition: "bottom",
      },
      {
        id: 2,
        title: "Победитель забрал машину",
        slug: "winner-car",
        shortText: "Счастливчик из Бишкека забрал свой приз.",
        image: null,
        publishedAt: null,
        theme: "dark",
        descriptionPosition: "bottom",
      },
      {
        id: 3,
        title: "Изменения в правилах",
        slug: "rules-update",
        shortText: "Важное обновление для всех участников тиражных лотерей.",
        image: null,
        publishedAt: null,
        theme: "light",
        descriptionPosition: "top",
      },
    ];
  }
}

export default async function NewsPage() {
  const news = await getAllNews();
  return <NewsListContent initialNews={news} />;
}
