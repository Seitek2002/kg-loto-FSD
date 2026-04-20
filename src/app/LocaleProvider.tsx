"use client";

import { useEffect } from "react";

import api from "@/shared/api/apiClient";
import { useLocaleStore } from "@/shared/model/localeStore";

interface PageTextResponse {
  data: {
    results: Array<{ key: string; text: string }>;
  };
}

export const LocaleProvider = ({ children }: { children: React.ReactNode }) => {
  const setDictionary = useLocaleStore((state) => state.setDictionary);
  const locale = useLocaleStore((state) => state.locale);

  useEffect(() => {
    const fetchDictionary = async () => {
      try {
        // Читаем текущий язык из кук/локалстораджа, если нужно
        const currentLocale = localStorage.getItem("NEXT_LOCALE") || "ru";
        useLocaleStore.getState().setLocale(currentLocale);

        // Запрашиваем словарь
        const { data } = await api.get<PageTextResponse>("/page-texts/", {
          headers: { "Accept-Language": currentLocale },
        });

        // Преобразуем массив [{key: "...", text: "..."}] в объект {"key": "text"}
        const dict: Record<string, string> = {};
        data.data.results.forEach((item) => {
          if (item.key && item.text) {
            dict[item.key] = item.text;
          }
        });

        setDictionary(dict);
      } catch (error) {
        console.error("Failed to load dictionary:", error);
      }
    };

    fetchDictionary();
  }, [locale, setDictionary]);

  return <>{children}</>;
};
