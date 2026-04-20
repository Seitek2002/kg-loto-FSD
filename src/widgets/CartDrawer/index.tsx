"use client";

import { useState } from "react";

import { useCartStore } from "@/entities/cart/model";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/Button";

export const CartDrawer = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { items } = useCartStore();

  if (items.length === 0) return null;

  const superCount = items.filter((t) => t.type === "super").length;
  const otherCount = items.filter((t) => t.type === "other").length;
  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div
      className={cn(
        "fixed left-0 right-0 bg-[#F9F9F9] rounded-t-3xl z-100 shadow-[0_-15px_40px_-10px_rgba(245,130,32,0.2)] transition-all duration-300 flex flex-col overflow-hidden",
        // В WebView мы приподнимаем корзину над BottomNav (которая высотой около 80px)
        isExpanded ? "bottom-0" : "bottom-0",
      )}
    >
      <div
        className="w-full pt-3 pb-2 flex justify-center cursor-pointer active:bg-gray-100"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="w-12 h-1.5 bg-gray-400 rounded-full" />
      </div>

      <div className="px-5 pb-5 flex items-center justify-between">
        <div
          className="flex flex-col"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span className="text-[#737373] text-[12px] font-medium mb-1">
            Итого:
          </span>
          <span className="text-[#4B4B4B] font-black text-[16px] leading-none">
            {items.length} шт &bull; {totalPrice}{" "}
            <span className="underline text-sm">с</span>
          </span>
        </div>
        <Button className="w-auto bg-[#F58220] text-white px-6 py-3.5 text-[13px]">
          Оплатить
        </Button>
      </div>

      <div
        className={cn(
          "transition-all duration-300 ease-in-out border-gray-200",
          isExpanded
            ? "max-h-72 opacity-100 border-t"
            : "max-h-0 opacity-0 border-transparent",
        )}
      >
        <div className="p-5 pt-4 bg-[#F9F9F9]">
          <div className="border border-gray-300 rounded-2xl p-4 bg-white flex flex-col gap-3.5 shadow-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-[13px] font-medium">
                Суперджекпот:
              </span>
              <span className="text-[#4B4B4B] font-bold text-[14px]">
                {superCount} шт
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-[13px] font-medium">
                Другой джекпот:
              </span>
              <span className="text-[#4B4B4B] font-bold text-[14px]">
                {otherCount} шт
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
