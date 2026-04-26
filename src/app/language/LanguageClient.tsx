"use client";

import { useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { useMounted } from "@/hooks/useMounted";
import { Check, ChevronLeft } from "lucide-react";

import { cn } from "@/shared/lib/utils";
// 🔥 1. Подключаем наш стор локализации
import { useLocaleStore } from "@/shared/model/localeStore";

const LANGUAGES = [
  { id: "ru", name: "Русский", icon: "/flags/ru.svg" },
  { id: "ky", name: "Кыргызча", icon: "/flags/kg.svg" }, // В JSON бэкенда кыргызский обозначен как "ky"
  { id: "en", name: "English", icon: "/flags/en.svg" },
];

const setLocaleCookie = (locale: string) => {
  document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000;`;
  localStorage.setItem("NEXT_LOCALE", locale);
};

export const LanguageClient = () => {
  const mounted = useMounted();

  // 🔥 2. Достаем функцию смены языка из Zustand
  const setGlobalLocale = useLocaleStore((state) => state.setLocale);

  const [activeLang, setActiveLang] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("NEXT_LOCALE") || "ru";
    }
    return "ru";
  });

  const handleLanguageChange = (newLocale: string) => {
    // 1. Меняем локальный стейт (для галочки в UI)
    setActiveLang(newLocale);
    // 2. Сохраняем в память (для API и будущих заходов)
    setLocaleCookie(newLocale);
    // 3. 🔥 Меняем глобальный стейт!
    // Это заставит LocaleProvider скачать новый словарь и перевести всё приложение на лету.
    setGlobalLocale(newLocale);
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col">
      <nav className="flex items-center mb-6">
        <Link
          href="/profile"
          className="flex items-center text-[#4B4B4B] hover:opacity-70 transition-opacity active:scale-95"
        >
          <ChevronLeft size={28} className="mr-1 -ml-2" />
          <span className="text-[20px] font-black">Выбор языка</span>
        </Link>
      </nav>

      <div className="bg-white rounded-3xl sm:rounded-4xl p-4 sm:p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col gap-3">
          {LANGUAGES.map((lang) => {
            const isActive = activeLang === lang.id;

            return (
              <button
                key={lang.id}
                onClick={() => handleLanguageChange(lang.id)}
                className={cn(
                  "flex items-center justify-between w-full border rounded-[20px] p-4 sm:p-5 transition-all active:scale-[0.98]",
                  isActive
                    ? "border-[#FF7600] bg-[#FFF8F3]"
                    : "border-[#EAEAEA] bg-white hover:border-gray-300",
                )}
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-[30px] h-[22px] overflow-hidden rounded-[4px] shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
                    <Image
                      src={lang.icon}
                      alt={lang.name}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                  <span className="text-[15px] sm:text-[16px] font-bold text-[#4B4B4B]">
                    {lang.name}
                  </span>
                </div>

                <div
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center transition-colors",
                    isActive
                      ? "bg-[#FF7600] border-transparent"
                      : "border-2 border-[#EAEAEA] bg-white",
                  )}
                >
                  {isActive && (
                    <Check size={14} className="text-white" strokeWidth={3.5} />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
