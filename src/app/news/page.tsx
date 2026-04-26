"use client";

import { useState } from "react";

import Link from "next/link";

import { ChevronLeft, Loader2 } from "lucide-react";

import { useNews } from "@/entities/news/api";
import { ArticleCard } from "@/entities/news/ui/ArticleCard";

import { Button } from "@/shared/ui/Button";
import { Description } from "@/shared/ui/Description";
import { Title } from "@/shared/ui/Title";

const ITEMS_PER_PAGE = 6;

export default function NewsPage() {
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  // 🔥 Вызываем наш новый хук
  const { data: news = [], isLoading } = useNews();

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  };

  const visibleNews = news.slice(0, visibleCount);
  const hasMore = visibleCount < news.length;

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-24">
      <div className="max-w-250 mx-auto pt-6 px-4 sm:px-6 lg:px-8">
        {/* НАВИГАЦИЯ НАЗАД */}
        <nav className="flex items-center mb-6 lg:mb-10">
          <Link
            href="/profile"
            className="flex items-center text-[#4B4B4B] hover:opacity-70 transition-opacity active:scale-95"
          >
            <ChevronLeft size={28} className="mr-1 -ml-2" />
            <span className="text-[20px] font-black">Новости</span>
          </Link>
        </nav>

        <div className="mb-10 max-w-3xl">
          <Title>ВСЕ МАТЕРИАЛЫ</Title>
          <Description>
            Следите за последними событиями, улучшениями и нововведениями — мы
            регулярно рассказываем о том, что важно знать.
          </Description>
        </div>

        {/* СОСТОЯНИЕ ЗАГРУЗКИ И КОНТЕНТ */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-[#FF7600]" />
          </div>
        ) : news.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500 font-medium bg-white rounded-3xl shadow-sm">
            Новостей пока нет
          </div>
        ) : (
          <>
            {/* СЕТКА КАРТОЧЕК */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
              {visibleNews.map((article) => (
                <div key={article.id} className="h-full">
                  <ArticleCard
                    id={article.id}
                    title={article.title}
                    description={article.shortText}
                    imageSrc={article.image}
                    theme={article.theme}
                    buttonText="ЧИТАТЬ"
                    buttonAlign="left"
                    descriptionPosition={article.descriptionPosition}
                    href={`/news/${article.slug}`}
                  />
                </div>
              ))}
            </div>

            {/* КНОПКА ЗАГРУЗИТЬ ЕЩЕ */}
            {hasMore && (
              <div className="mt-12 flex justify-center">
                <Button
                  variant="outline"
                  onClick={handleLoadMore}
                  className="bg-white text-[#4B4B4B] uppercase text-xs py-4 px-12 rounded-full border-transparent shadow-md hover:bg-gray-50"
                >
                  Загрузить еще
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
