"use client";

import { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { useMounted } from "@/hooks/useMounted";
import { ChevronLeft, Loader2 } from "lucide-react";

import "@/app/news/[slug]/style.css";

import {
  type AboutCompanyData,
  getAboutCompanyData,
} from "@/entities/company/api";
import { type NewsItem, getNewsData } from "@/entities/news/api";
import { ArticleCard } from "@/entities/news/ui/ArticleCard";

export const AboutClient = () => {
  const mounted = useMounted();
  const [aboutData, setAboutData] = useState<AboutCompanyData | null>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const savedLocale = localStorage.getItem("NEXT_LOCALE") || "ru";

      const [aboutRes, newsRes] = await Promise.all([
        getAboutCompanyData(savedLocale),
        getNewsData(savedLocale),
      ]);

      setAboutData(aboutRes);
      setNews(newsRes.slice(0, 3));
      setIsLoading(false);
    };

    fetchData();
  }, []);

  if (!mounted) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#FF7600]" />
      </div>
    );
  }

  const displayTitle = aboutData?.title || "О компании";
  const htmlContent = aboutData?.content || "";

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-rubik pb-24">
      <div className="max-w-[1200px] mx-auto pt-6 px-4 sm:px-6 lg:px-8">
        {/* КНОПКА НАЗАД */}
        <nav className="flex items-center mb-6 lg:mb-10">
          <Link
            href="/profile"
            className="flex items-center text-[#4B4B4B] hover:opacity-70 transition-opacity active:scale-95"
          >
            <ChevronLeft size={28} className="mr-1 -ml-2" />
            <span className="text-[20px] font-black">{displayTitle}</span>
          </Link>
        </nav>

        {/* ГЛАВНОЕ ФОТО (Баннер) */}
        {aboutData?.image && (
          <div className="w-full aspect-video sm:aspect-[21/9] min-h-[200px] relative rounded-[32px] overflow-hidden mb-8 lg:mb-12 shadow-sm">
            <Image
              src={aboutData.image}
              alt={displayTitle}
              fill
              unoptimized
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* ОСНОВНОЙ КОНТЕНТ (2 КОЛОНКИ НА ПК) */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          {/* ЛЕВАЯ КОЛОНКА: ДИНАМИЧЕСКИЙ HTML */}
          <div className="w-full lg:w-[65%] bg-white rounded-[32px] p-6 lg:p-10 shadow-sm border border-gray-100 text-[#4B4B4B]">
            <div
              className="html-content leading-relaxed"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </div>

          {/* ПРАВАЯ КОЛОНКА: НОВОСТИ (Сайдбар) */}
          {news.length > 0 && (
            <div className="w-full lg:w-[35%] flex flex-col lg:sticky lg:top-8">
              <h2 className="text-[20px] font-black uppercase text-[#4B4B4B] mb-6">
                Последние новости
              </h2>

              <div className="flex flex-col gap-4">
                {news.map((item) => (
                  // 🔥 ИСПРАВЛЕНИЕ: Убрал h-[300px], теперь карточка не будет вылезать за края обертки
                  <div key={item.id} className="w-full">
                    <ArticleCard
                      id={item.id}
                      title={item.title}
                      description={item.shortText}
                      imageSrc={item.image}
                      buttonText="ЧИТАТЬ"
                      theme={
                        item.theme === "dark" ||
                        item.theme === "light" ||
                        item.theme === "blue"
                          ? item.theme
                          : "dark"
                      }
                      href={`/news/${item.slug}`}
                      descriptionPosition={item.descriptionPosition || "bottom"}
                    />
                  </div>
                ))}
              </div>

              <Link
                href="/news"
                className="mt-6 text-center w-full py-4 rounded-full border-2 border-[#EAEAEA] text-[#4B4B4B] font-bold text-[14px] uppercase active:scale-95 transition-all hover:bg-white"
              >
                Все новости
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
