"use client";

import { useEffect, useRef } from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { authApi } from "@/entities/auth/api";

import { useAuthStore } from "@/shared/model/auth";

export const AutoLoginHandler = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const setTokens = useAuthStore((state) => state.setTokens);
  const setUser = useAuthStore((state) => state.setUser);
  // 🔥 Достаем новый метод из стора
  const setAppSource = useAuthStore((state) => state.setAppSource);

  const isProcessed = useRef(false);

  useEffect(() => {
    // Ищем номер и так, и так (на случай, если банк пришлет по-другому)
    const phoneNumber =
      searchParams.get("phoneNumber") || searchParams.get("phone_number");
    const appSource = searchParams.get("appSource");

    // 🔥 Сохраняем appSource, если он есть в URL
    if (appSource) {
      setAppSource(appSource);
    }

    if (phoneNumber && !isProcessed.current) {
      isProcessed.current = true;

      const performLogin = async () => {
        try {
          // Отправляем запрос на бэк (там внутри application/json)
          const result = await authApi.webviewAutoLogin(phoneNumber, appSource);

          // Сохраняем токены в Zustand (а он сам запишет их в localStorage)
          setTokens(result.accessToken, result.refreshToken);

          // Записываем телефон в стейт, чтобы юзер увидел его в профиле
          setUser({ phone: phoneNumber });

          // Очищаем URL от ВСЕХ вариантов параметров
          const params = new URLSearchParams(searchParams.toString());
          params.delete("phoneNumber");
          params.delete("phone_number");
          params.delete("appSource");

          const newUrl = params.toString()
            ? `${pathname}?${params.toString()}`
            : pathname;

          router.replace(newUrl);
        } catch (error) {
          console.error("Ошибка автоматического входа (Auto-Login):", error);
        }
      };

      performLogin();
    }
  }, [searchParams, pathname, router, setTokens, setUser, setAppSource]);

  return null;
};
