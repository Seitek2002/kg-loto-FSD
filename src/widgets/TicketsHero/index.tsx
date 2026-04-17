"use client";

import Image from "next/image";

import { cn } from "@/shared/lib/utils";

interface TicketsHeroProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const TicketsHeroWidget = ({
  activeTab,
  onTabChange,
}: TicketsHeroProps) => {
  const tabs = [
    { id: "tickets", label: "Билеты" },
    { id: "rules", label: "Правила игры" },
    { id: "archive", label: "Архив тиражей" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mt-6">
      {/* ЛЕВАЯ КОЛОНКА: БОЛЬШОЙ БАННЕР */}
      <div className="lg:col-span-2 relative min-h-[260px] sm:min-h-[350px] lg:min-h-[420px] rounded-[24px] lg:rounded-[32px] overflow-hidden flex flex-col justify-between shadow-sm">
        <Image
          src="/images/draw-tickets/big-block-bg.png"
          alt="Background"
          fill
          unoptimized
          className="object-cover z-0"
          priority
        />

        <div className="relative z-10 flex flex-col items-center self-start pt-6 sm:pt-10 lg:pt-16 pl-4 sm:pl-8 lg:pl-16">
          <div className="relative w-[200px] h-[75px] sm:w-[280px] sm:h-[100px] lg:w-[400px] lg:h-[140px] mb-2 sm:mb-4">
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
            6 000 000 <span className="underline">С</span>
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
      <div className="flex flex-col gap-4 lg:gap-6">
        {/* КАРТОЧКА ТИРАЖА */}
        <div className="bg-white rounded-[24px] lg:rounded-[32px] p-6 lg:p-8 shadow-sm flex flex-col justify-center flex-1">
          <h2 className="text-[20px] lg:text-[26px] font-bold text-[#4B4B4B] text-center mb-6 lg:mb-8">
            Тираж №005034
          </h2>
          <div className="flex flex-col gap-4 text-[13px] lg:text-[16px]">
            <div className="flex justify-between items-center">
              <span className="text-[#737373] font-medium">Дата тиража:</span>
              <span className="text-[#4B4B4B] font-bold">4 апреля 2026</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#737373] font-medium">Суперприз от:</span>
              <span className="text-[#4B4B4B] font-bold">
                20 000 <span className="underline">С</span>
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#737373] font-medium">
                Место проведения:
              </span>
              <span className="text-[#4B4B4B] font-bold">Бишкек</span>
            </div>
          </div>
        </div>

        {/* БЛОК ТАЙМЕРА */}
        <div className="relative h-[130px] sm:h-[150px] lg:h-[180px] rounded-[24px] lg:rounded-[32px] overflow-hidden flex flex-col items-center justify-center shadow-sm">
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

            <div className="flex items-stretch gap-2 lg:gap-4 w-full">
              <div className="flex flex-col flex-[1] bg-white/10 backdrop-blur-md border border-white/40 rounded-[12px] lg:rounded-[16px] p-2 lg:p-3">
                <span className="text-white text-[11px] lg:text-[14px] font-medium mb-1">
                  Дней
                </span>
                <span className="text-white text-[28px] lg:text-[40px] font-black leading-none tracking-wide">
                  24
                </span>
              </div>
              <div className="flex flex-col flex-[1.8] lg:flex-[2] bg-white/10 backdrop-blur-md border border-white/40 rounded-[12px] lg:rounded-[16px] p-2 lg:p-3">
                <span className="text-white text-[11px] lg:text-[14px] font-medium mb-1">
                  Часов
                </span>
                <span className="text-white text-[28px] lg:text-[40px] font-black leading-none tracking-wide">
                  12:34:38
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
