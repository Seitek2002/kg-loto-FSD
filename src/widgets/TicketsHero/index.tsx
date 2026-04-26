"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

import { useCurrentDraw } from "@/entities/ticket/api";

import { cn } from "@/shared/lib/utils";
import { Skeleton } from "@/shared/ui/Skeleton";

interface TicketsHeroProps {
  lotteryId: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const TicketsHeroWidget = ({
  lotteryId,
  activeTab,
  onTabChange,
}: TicketsHeroProps) => {
  const tabs = [
    { id: "tickets", label: "Билеты" },
    { id: "rules", label: "Правила игры" },
    { id: "archive", label: "Архив тиражей" },
  ];

  const { data: currentDraw, isLoading } = useCurrentDraw(lotteryId);

  // --- ЛОГИКА ТАЙМЕРА ---
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!currentDraw) return;

    // Собираем полную дату тиража: "2026-04-10T20:00:00"
    const targetDate = new Date(
      `${currentDraw.drawDate}T${currentDraw.drawTime}`,
    );

    const updateTimer = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateTimer(); // Вызываем сразу
    const interval = setInterval(updateTimer, 1000); // И каждую секунду

    return () => clearInterval(interval);
  }, [currentDraw]);

  // Форматируем время с ведущими нулями (09:05:01)
  const formattedTime = `${String(timeLeft.hours).padStart(2, "0")}:${String(
    timeLeft.minutes,
  ).padStart(2, "0")}:${String(timeLeft.seconds).padStart(2, "0")}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mt-6">
      {/* ЛЕВАЯ КОЛОНКА: БОЛЬШОЙ БАННЕР */}
      <div className="lg:col-span-2 relative min-h-65 sm:min-h-87.5 lg:min-h-105 rounded-3xl lg:rounded-4xl overflow-hidden flex flex-col justify-between shadow-sm">
        <Image
          src="/images/draw-tickets/big-block-bg.png"
          alt="Background"
          fill
          unoptimized
          className="object-cover z-0"
          priority
        />

        <div className="relative z-10 flex flex-col items-center self-start pt-6 sm:pt-10 lg:pt-16 pl-4 sm:pl-8 lg:pl-16">
          <div className="relative w-50 h-18.75 sm:w-70 sm:h-25 lg:w-100 lg:h-35 mb-2 sm:mb-4">
            <Image
              src="/images/draw-tickets/super-jackpot-logo.png"
              alt="Супер Джекпот"
              fill
              unoptimized
              className="object-contain object-center"
              priority
            />
          </div>
          <div className="text-white text-[13px] sm:text-sm lg:text-xl font-bold mb-1 drop-shadow-md">
            Суперприз от
          </div>
          <div className="text-[#E2FF5A] text-[32px] sm:text-4xl lg:text-[64px] leading-none font-black font-benzin drop-shadow-[0_4px_10px_rgba(0,0,0,0.3)]">
            {isLoading ? (
              <Skeleton className="w-50 h-10 lg:h-17.5 bg-white/20 mt-2" />
            ) : (
              currentDraw?.jackpotAmountDisplay || "0 с"
            )}
          </div>
        </div>

        {/* ТАБЫ */}
        <div className="relative z-10 mx-3 sm:mx-4 mb-3 sm:mb-4 p-1.5 bg-white/20 backdrop-blur-md rounded-[14px] lg:rounded-[20px] border border-white/30 flex items-center justify-between gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex-1 py-2.5 sm:py-3.5 rounded-[10px] lg:rounded-[14px] text-[11px] sm:text-[13px] lg:text-[16px] font-bold transition-all",
                activeTab === tab.id
                  ? "bg-white text-[#4B4B4B] shadow-sm"
                  : "text-white hover:bg-white/10 active:scale-95",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ПРАВАЯ КОЛОНКА */}
      <div
        className={cn(
          "flex-col gap-4 lg:gap-6",
          // 🔥 Показываем на мобилке только если таб 'tickets', на ПК (lg) показываем всегда
          activeTab === "tickets" ? "flex" : "hidden lg:flex",
        )}
      >
        {/* КАРТОЧКА ТИРАЖА */}
        <div className="bg-white rounded-3xl lg:rounded-4xl p-6 lg:p-8 shadow-sm flex flex-col justify-center flex-1">
          <h2 className="text-[20px] lg:text-[26px] font-bold text-[#4B4B4B] text-center mb-6 lg:mb-8">
            {isLoading ? (
              <Skeleton className="h-8 w-3/4 mx-auto" />
            ) : (
              currentDraw?.title || "Тираж закрыт"
            )}
          </h2>

          <div className="flex flex-col gap-4 text-[13px] lg:text-[16px]">
            <div className="flex justify-between items-center">
              <span className="text-[#737373] font-medium">Дата тиража:</span>
              {isLoading ? (
                <Skeleton className="h-5 w-24" />
              ) : (
                <span className="text-[#4B4B4B] font-bold">
                  {currentDraw?.drawDateHuman || "-"}
                </span>
              )}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#737373] font-medium">Суперприз от:</span>
              {isLoading ? (
                <Skeleton className="h-5 w-24" />
              ) : (
                <span className="text-[#4B4B4B] font-bold">
                  {currentDraw?.jackpotAmountDisplay || "-"}
                </span>
              )}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#737373] font-medium">
                Место проведения:
              </span>
              {isLoading ? (
                <Skeleton className="h-5 w-20" />
              ) : (
                <span className="text-[#4B4B4B] font-bold">
                  {currentDraw?.location || "Бишкек"}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* БЛОК ТАЙМЕРА */}
        <div className="relative h-32.5 sm:h-37.5 lg:h-45 rounded-3xl lg:rounded-4xl overflow-hidden flex flex-col items-center justify-center shadow-sm">
          <Image
            src="/images/draw-tickets/timer-block-bg.png"
            alt="Timer Background"
            fill
            unoptimized
            className="object-cover z-0"
          />
          <div className="relative z-10 flex flex-col items-center w-full px-4 lg:px-6">
            <span className="text-white text-[16px] lg:text-[22px] font-bold mb-3 drop-shadow-md">
              <span className="lg:hidden">До старта:</span>
              <span className="hidden lg:inline">До розыгрыша</span>
            </span>

            <div className="flex items-stretch justify-center gap-2 lg:gap-4 w-full">
              <div className="flex flex-col bg-white/10 backdrop-blur-md border border-white/40 rounded-xl lg:rounded-2xl p-2 lg:p-3 w-17.5 lg:w-25 items-center">
                <span className="text-white text-[11px] lg:text-[14px] font-medium mb-1">
                  Дней
                </span>
                <span className="text-white text-[28px] lg:text-[40px] font-black leading-none tracking-wide">
                  {isLoading ? "-" : timeLeft.days}
                </span>
              </div>
              <div className="flex flex-col bg-white/10 backdrop-blur-md border border-white/40 rounded-xl lg:rounded-2xl py-2 px-4 lg:p-3 w-35 lg:w-50 items-center">
                <span className="text-white text-[11px] lg:text-[14px] font-medium mb-1">
                  Часов
                </span>
                <span className="text-white text-[28px] lg:text-[40px] font-black leading-none tracking-wide">
                  {isLoading ? "--:--:--" : formattedTime}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
