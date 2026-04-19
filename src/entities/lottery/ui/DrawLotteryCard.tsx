"use client";

import Image from "next/image";
import Link from "next/link";

import { CountdownTimer } from "@/shared/ui/CountdownTimer";

import { CurrentLottery } from "../api";

export const DrawLotteryCard = ({ lottery }: { lottery: CurrentLottery }) => {
  // Заглушки, пока бэкенд не добавит эти поля
  const fallbackImage =
    "https://images.unsplash.com/photo-1621360841013-c76831f1dbce?q=80&w=600&auto=format&fit=crop";
  const fallbackPrize = "6 000 000";

  return (
    <Link
      href={`/lottery/${lottery.lotteryId}`} // 🔥 Ведем на нашу детальную страницу
      className="group relative w-full aspect-video sm:aspect-4/2.5 rounded-3xl overflow-hidden block active:scale-[0.98] transition-transform duration-200"
    >
      <Image
        src={fallbackImage}
        alt={lottery.name}
        fill
        unoptimized // 🔥 Обязательно для WebView статики
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-black/10" />

      <CountdownTimer targetDate={lottery.saleEndAt} />

      <div className="absolute bottom-5 left-5 md:bottom-6 md:left-6 flex flex-col gap-1 md:gap-2 z-10">
        <span className="text-white font-bold text-[14px] md:text-[18px]">
          {lottery.name}
        </span>

        <div className="text-[#FFD600] font-black text-[28px] md:text-[40px] leading-none drop-shadow-md flex items-end gap-2">
          {fallbackPrize}
          <span className="text-white text-[20px] md:text-[28px] underline decoration-2 underline-offset-4 mb-1">
            с
          </span>
        </div>

        <button className="mt-2 bg-white text-[#2D2D2D] rounded-full px-5 py-2 md:py-2.5 text-[12px] md:text-[14px] font-black uppercase tracking-wide w-max shadow-md transition-colors duration-300">
          Играть • {lottery.ticketPrice} СОМ
        </button>
      </div>
    </Link>
  );
};

export const DrawLotteryCardSkeleton = () => (
  <div className="relative w-full aspect-video sm:aspect-4/2.5 rounded-3xl overflow-hidden bg-gray-200 animate-pulse">
    <div className="absolute top-4 left-4 bg-gray-300 rounded-full w-32 h-8" />
    <div className="absolute bottom-5 left-5 md:bottom-6 md:left-6 flex flex-col gap-3 z-10 w-full">
      <div className="bg-gray-300 rounded-md w-3/4 h-5 md:h-6" />
      <div className="bg-gray-300 rounded-md w-1/2 h-8 md:h-10" />
      <div className="bg-gray-300 rounded-full w-40 h-9 md:h-10 mt-1" />
    </div>
  </div>
);
