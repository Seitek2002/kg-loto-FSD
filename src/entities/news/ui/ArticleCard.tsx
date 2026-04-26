"use client";

import Image from "next/image";
import Link from "next/link";

import { FileText } from "lucide-react";

import { cn } from "@/shared/lib/utils";

import type { NewsItem } from "../api";

export interface ArticleCardProps {
  id?: number | string;
  title: string;
  description?: string;
  buttonText: string;
  imageSrc?: string | null;
  theme: NewsItem["theme"];
  buttonAlign?: "center" | "left";
  descriptionPosition?: "top" | "bottom" | "none";
  href?: string;
}

export const ArticleCard = ({
  title,
  description,
  buttonText,
  imageSrc,
  theme,
  buttonAlign = "left",
  descriptionPosition = "bottom",
  href = "#",
}: ArticleCardProps) => {
  const isDarkText = theme === "dark";
  const titleColor = isDarkText ? "text-[#1F1F1F]" : "text-white";
  const descColor = isDarkText ? "text-[#4B4B4B]" : "text-white/90";

  const btnClass = isDarkText
    ? "bg-[#F0F0F0] text-black hover:bg-[#E5E5E5]"
    : "bg-white text-black hover:bg-white/90";

  const hasImage = imageSrc && imageSrc.length > 0;

  return (
    <Link
      href={href}
      className={cn(
        "relative w-full h-[400px] sm:h-[460px] rounded-4xl p-8 flex flex-col justify-between overflow-hidden border border-gray-100/50 shadow-sm transition-transform hover:scale-[1.01] group cursor-pointer",
        !hasImage && theme === "dark" && "bg-white",
        !hasImage && theme === "light" && "bg-[#4B4B4B]",
        !hasImage && theme === "blue" && "bg-[#6F51FF]",
      )}
    >
      {/* ФОН */}
      <div className="absolute inset-0 z-0">
        {hasImage ? (
          <>
            <Image
              src={imageSrc!}
              alt={title}
              fill
              unoptimized // 🔥 Обязательно для WebView
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            {theme !== "dark" && (
              <div className="absolute inset-0 bg-black/20" />
            )}
          </>
        ) : (
          <div
            className={cn(
              "w-full h-full flex items-center justify-center",
              theme === "dark" && "bg-gradient-to-br from-gray-50 to-gray-100",
              theme === "light" &&
                "bg-gradient-to-br from-[#4B4B4B] to-[#1F1F1F]",
              theme === "blue" &&
                "bg-gradient-to-br from-[#6F51FF] to-[#5842CC]",
            )}
          >
            <FileText
              size={80}
              strokeWidth={1}
              className={cn(
                "opacity-20",
                theme === "dark" ? "text-black" : "text-white",
              )}
            />
          </div>
        )}
      </div>

      {/* КОНТЕНТ */}
      <div className="relative z-10 flex flex-col gap-4">
        <h3
          className={cn(
            "text-xl font-black uppercase leading-tight",
            titleColor,
          )}
        >
          {title}
        </h3>

        {description && descriptionPosition === "top" && (
          <p
            className={cn(
              "text-sm font-medium font-rubik leading-relaxed max-w-[90%]",
              descColor,
            )}
          >
            {description}
          </p>
        )}
      </div>

      <div
        className={cn(
          "relative z-10 flex flex-col gap-6",
          buttonAlign === "center" ? "items-center" : "items-start",
        )}
      >
        {description && descriptionPosition === "bottom" && (
          <p
            className={cn(
              "text-sm font-medium font-rubik leading-relaxed",
              descColor,
            )}
          >
            {description}
          </p>
        )}

        <div
          className={cn(
            "px-8 py-4 rounded-full font-bold text-xs uppercase tracking-wider shadow-lg transition-all group-active:scale-95 text-center",
            btnClass,
            "w-full sm:w-auto",
          )}
        >
          {buttonText}
        </div>
      </div>
    </Link>
  );
};
