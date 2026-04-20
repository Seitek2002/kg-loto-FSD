"use client";

import Link from "next/link";

import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";

import type { NewsItem } from "@/entities/news/api";
import { ArticleCard } from "@/entities/news/ui/ArticleCard";

import { Description } from "@/shared/ui/Description";
import { Title } from "@/shared/ui/Title";

interface OtherMaterialsSliderProps {
  articles: NewsItem[];
}

export const OtherMaterialsSlider = ({
  articles,
}: OtherMaterialsSliderProps) => {
  if (!articles || articles.length === 0) return null;

  return (
    <section className="mt-16 w-full relative overflow-hidden">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-8">
        <div className="max-w-2xl">
          <Title>ДРУГИЕ МАТЕРИАЛЫ</Title>
          <Description>
            Следите за последними событиями, улучшениями и нововведениями — мы
            регулярно рассказываем о том, что важно знать.
          </Description>
        </div>

        <Link
          href="/news"
          className="hidden lg:inline-flex items-center justify-center px-6 py-3 bg-white border border-gray-200 rounded-full text-xs font-bold font-benzin uppercase text-[#4B4B4B] hover:bg-gray-50 transition-colors shadow-sm shrink-0 ml-4"
        >
          Все материалы
        </Link>
      </div>

      <Swiper
        spaceBetween={16}
        slidesPerView={1.1}
        breakpoints={{
          640: { slidesPerView: 2.2 },
          1024: { slidesPerView: 3.2 },
        }}
        className="overflow-visible!"
      >
        {articles.map((article) => (
          <SwiperSlide key={article.id} className="h-auto">
            <ArticleCard
              id={article.id}
              title={article.title}
              description={article.shortText}
              imageSrc={article.image}
              theme={
                article.theme === "dark" ||
                article.theme === "light" ||
                article.theme === "blue"
                  ? article.theme
                  : "dark"
              }
              buttonText="ПОДРОБНЕЕ"
              buttonAlign="left"
              href={`/news/${article.slug || article.id}`}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="mt-8 lg:hidden">
        <Link
          href="/news"
          className="flex w-full items-center justify-center py-4 bg-white rounded-full text-xs font-bold font-benzin uppercase text-[#4B4B4B] shadow-md active:scale-95 transition-transform"
        >
          Все материалы
        </Link>
      </div>
    </section>
  );
};
