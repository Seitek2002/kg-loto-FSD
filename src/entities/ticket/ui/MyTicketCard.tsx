"use client";

import Image from "next/image";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/Button";

export interface MyTicketCardProps {
  prizeAmount: string;
  ticketName: string;
  price: number;
  date: string;
  logoSrc: string;
  status?: "winning" | "unchecked" | "losing";
  badge?: { text: string; variant: "success" | "waiting" | "processing" };
  showButton?: boolean;
  drawNumber?: string;
  combination?: number[]; // 🔥 Добавили пропс для комбинации
  onAction?: () => void;
}

export const MyTicketCard = ({
  prizeAmount,
  ticketName,
  price,
  date,
  logoSrc,
  status = "winning",
  badge,
  showButton = true,
  drawNumber,
  combination, // 🔥 Достаем из пропсов
  onAction,
}: MyTicketCardProps) => {
  const cleanAmount = prizeAmount.replace(/\s/g, "");
  const isNumeric = !isNaN(Number(cleanAmount)) && cleanAmount !== "";
  const numericValue = isNumeric ? Number(cleanAmount) : 0;

  // Оранжевый цвет, если это техника или сумма >= 10 000
  const isHighlighted = !isNumeric || numericValue >= 10000;

  return (
    <div className="flex flex-col h-fit bg-white border border-[#EAEAEA] rounded-3xl p-5 shadow-sm">
      {/* ВЕРХНЯЯ ЧАСТЬ: Приз и Бейджик */}
      {status !== "unchecked" && (
        <div className="mb-4 border-b border-[#EAEAEA] pb-4 flex justify-between items-center">
          <div>
            {status === "losing" ? (
              <span className="text-[15px] text-[#EB5757] font-bold block">
                Билет не выиграл
              </span>
            ) : (
              <>
                <span className="text-[12px] text-[#4B4B4B] font-bold mb-0.5 block">
                  Ваш приз
                </span>
                <span
                  className={cn(
                    "text-[24px] font-black whitespace-nowrap",
                    isHighlighted ? "text-[#FF7600]" : "text-[#4B4B4B]",
                  )}
                >
                  {prizeAmount}
                  {isNumeric && (
                    <>
                      {" "}
                      <span className="underline decoration-2 underline-offset-4 text-[20px]">
                        с
                      </span>
                    </>
                  )}
                </span>
              </>
            )}
          </div>

          {/* Бейджик статуса */}
          {badge && (
            <div
              className={cn(
                "px-4 py-1.5 rounded-full text-[13px] font-bold whitespace-nowrap",
                badge.variant === "success" && "bg-[#D1F5D3] text-[#1FAF38]",
                badge.variant === "waiting" && "bg-[#F3F4F6] text-[#4B4B4B]",
                badge.variant === "processing" && "bg-[#FFF0D4] text-[#F58220]",
              )}
            >
              {badge.text}
            </div>
          )}
        </div>
      )}

      {/* ИНФОРМАЦИЯ О БИЛЕТЕ */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-col flex-1 pr-2">
          <h3 className="text-[18px] sm:text-[20px] font-bold text-[#4B4B4B] mb-2 leading-tight">
            {ticketName}
          </h3>
          <div className="text-[13px] text-[#737373] flex flex-col gap-1 font-medium">
            {drawNumber && <span>Тираж №{drawNumber}</span>}
            <span>Стоимость: {price}</span>
            <span>Дата покупки: {date}</span>
          </div>
        </div>
        <div className="relative w-22.5 h-8.75 shrink-0 mt-1">
          <Image
            src={logoSrc}
            alt={ticketName}
            fill
            unoptimized
            className="object-contain object-right"
          />
        </div>
      </div>

      {/* 🔥 ОТРИСОВКА ВЫБРАННОЙ КОМБИНАЦИИ (Зеленые шарики) */}
      {combination && combination.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {combination.map((num, idx) => (
            <div
              key={idx}
              className="w-10 h-10 rounded-full bg-[#00C814] text-white flex items-center justify-center font-bold text-[16px] shadow-sm"
            >
              {num}
            </div>
          ))}
        </div>
      )}

      {/* КНОПКА ПОЛУЧИТЬ / ПРОВЕРИТЬ */}
      {status !== "losing" && showButton && (
        <Button
          onClick={onAction}
          className="w-full bg-[#4B4B4B] hover:bg-gray-800 text-white py-3.5 rounded-2xl text-[14px]"
        >
          {status === "unchecked" ? "ПРОВЕРИТЬ" : "ПОЛУЧИТЬ"}
        </Button>
      )}
    </div>
  );
};
