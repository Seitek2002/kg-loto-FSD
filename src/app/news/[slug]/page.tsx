import { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { OtherMaterialsSlider } from "@/widgets/OtherMaterialsSlider";

import { getNewsData, getNewsDetail } from "@/entities/news/api";

import "./style.css";

interface NewsDetailsPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: NewsDetailsPageProps): Promise<Metadata> {
  const { slug } = await params;

  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "ru";

  const article = await getNewsDetail(slug, locale);

  if (!article) {
    return { title: "Новость не найдена | KGLOTO" };
  }

  return {
    title: `${article.title} | KGLOTO`,
    description: article.shortText || article.title,
  };
}

export default async function NewsDetailsPage({
  params,
}: NewsDetailsPageProps) {
  const { slug } = await params;

  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "ru";

  const [article, allNews] = await Promise.all([
    getNewsDetail(slug, locale),
    getNewsData(locale),
  ]);

  if (!article) {
    return notFound();
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
      <main className="max-w-300 mx-auto px-4 lg:px-8 pt-6 lg:pt-10 pb-20 overflow-hidden">
        {/* КНОПКА НАЗАД (Мобилка) */}
        <nav className="flex lg:hidden items-center mb-6">
          <Link
            href="/news"
            className="flex items-center text-[#4B4B4B] active:scale-95 transition-transform"
          >
            <ChevronLeft size={28} className="mr-1 -ml-2" />
            <span className="text-[18px] font-bold">Назад</span>
          </Link>
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
          <span className="text-[#4B4B4B] truncate">{article.title}</span>
        </nav>

        {/* ЗАГОЛОВОК И ДАТА */}
        <h1 className="text-2xl sm:text-3xl lg:text-[40px] font-black font-benzin text-[#4B4B4B] uppercase leading-tight mb-4 max-w-4xl">
          {article.title}
        </h1>
        <div className="text-xs font-bold font-rubik text-[#737373] uppercase mb-8 lg:mb-12">
          {formattedDate}
        </div>

        {/* КОНТЕНТ НОВОСТИ (Используем твои классы .html-content) */}
        <div className="w-full max-w-4xl bg-white rounded-4xl p-6 lg:p-10 shadow-sm border border-gray-100">
          <div
            className="html-content text-[#4B4B4B]"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </div>

        {/* СЛАЙДЕР "ДРУГИЕ МАТЕРИАЛЫ" */}
        <OtherMaterialsSlider articles={otherArticles} />
      </main>
    </div>
  );
}
