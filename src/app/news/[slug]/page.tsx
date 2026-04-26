"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

import { OtherMaterialsSlider } from "@/widgets/OtherMaterialsSlider";

// 🔥 Импортируем наши новые хуки
import { useNews, useNewsDetail } from "@/entities/news/api";

import "./style.css";

export default function NewsDetailsPage() {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();

  // 🔥 Запрашиваем данные через React Query
  const { data: article, isLoading: isArticleLoading } = useNewsDetail(slug);
  const { data: allNews = [], isLoading: isAllNewsLoading } = useNews();

  const isLoading = isArticleLoading || isAllNewsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex justify-center items-center pb-32">
        <Loader2 className="w-10 h-10 animate-spin text-[#FF7600]" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex flex-col items-center justify-center pb-32">
        <h1 className="text-2xl font-bold text-[#4B4B4B] mb-4">
          Новость не найдена
        </h1>
        <button
          onClick={() => router.back()}
          className="text-[#FF7600] font-bold hover:underline"
        >
          Вернуться назад
        </button>
      </div>
    );
  }

  // Фильтруем текущую новость из слайдера (проверяем и по ID, и по Slug)
  const otherArticles = allNews.filter(
    (item) =>
      String(item.id) !== String(slug) && String(item.slug) !== String(slug),
  );

  const formattedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  const htmlContent = article.content || article.shortText || "";

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-rubik">
      <main className="max-w-250 mx-auto px-4 lg:px-8 pt-6 lg:pt-10 pb-20 overflow-hidden">
        {/* КНОПКА НАЗАД (Мобилка) */}
        <nav className="flex lg:hidden items-center mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-[#4B4B4B] active:scale-95 transition-transform"
          >
            <ChevronLeft size={28} className="mr-1 -ml-2" />
            <span className="text-[18px] font-bold">Назад</span>
          </button>
        </nav>

        {/* ХЛЕБНЫЕ КРОШКИ (ПК) */}
        <nav className="hidden lg:flex items-center gap-2 text-[12px] font-bold text-gray-400 mb-8 uppercase overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-[#4B4B4B] transition-colors">
            Главная
          </Link>
          <ChevronRight size={14} className="shrink-0" />
          <Link href="/news" className="hover:text-[#4B4B4B] transition-colors">
            Новости
          </Link>
          <ChevronRight size={14} className="shrink-0" />
          <span className="text-[#4B4B4B] truncate max-w-75">
            {article.title}
          </span>
        </nav>

        {/* ЗАГОЛОВОК И ДАТА */}
        <h1 className="text-2xl sm:text-3xl lg:text-[40px] font-black font-benzin text-[#4B4B4B] uppercase leading-tight mb-4 max-w-4xl">
          {article.title}
        </h1>
        <div className="text-xs font-bold font-rubik text-[#737373] uppercase mb-8 lg:mb-12">
          {formattedDate}
        </div>

        {/* КОНТЕНТ НОВОСТИ */}
        <div className="w-full max-w-4xl bg-white rounded-3xl lg:rounded-4xl p-6 lg:p-10 shadow-sm border border-gray-100 mb-12">
          <div
            className="html-content text-[#4B4B4B]"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </div>

        {/* СЛАЙДЕР "ДРУГИЕ МАТЕРИАЛЫ" */}
        {otherArticles.length > 0 && (
          <OtherMaterialsSlider articles={otherArticles} />
        )}
      </main>
    </div>
  );
}
