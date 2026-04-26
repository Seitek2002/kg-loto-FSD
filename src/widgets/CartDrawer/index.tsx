"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { TopUpModal } from "@/features/top-up/ui/TopUpModal";

import { useCartStore } from "@/entities/cart/model";
import { useBalance } from "@/entities/finance/api";
import { usePurchaseTickets } from "@/entities/ticket/api";

import { cn } from "@/shared/lib/utils";
import { useAuthStore } from "@/shared/model/auth";
import { Button } from "@/shared/ui/Button";
import { ErrorModal } from "@/shared/ui/ErrorModal";

// Проверь путь к модалке пополнения

export const CartDrawer = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();

  // Сторы
  const { items, clearCart } = useCartStore();
  const user = useAuthStore((state) => state.user);

  // API
  const { mutate: purchase, isPending } = usePurchaseTickets();
  const { refetch: refetchBalance } = useBalance();

  // Модалки
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);

  if (items.length === 0) return null;

  const superCount = items.filter((t) => t.type === "super").length;
  const otherCount = items.filter((t) => t.type === "other").length;
  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = () => {
    // 1. Проверяем баланс перед запросом
    const currentBalance = Number(user?.balance || 0);

    if (currentBalance < totalPrice) {
      // Денег не хватает -> открываем модалку пополнения
      setIsTopUpOpen(true);
      return;
    }

    // 2. Денег хватает -> Формируем Payload
    const payload = {
      orderId: `ORD-${Date.now()}`,
      purchaseDatetime: new Date().toISOString(),
      items: items.map((t) => ({
        lotteryId: t.lotteryId,
        drawId: t.drawId,
        ticketId: t.id,
        price: String(t.price),
        currency: "KGS",
      })),
    };

    // 3. Отправляем запрос на покупку
    purchase(payload, {
      onSuccess: () => {
        clearCart();
        refetchBalance();
        setIsExpanded(false);
        alert("Билеты успешно приобретены!"); // Позже заменим на красивый SuccessModal
        router.push("/tickets");
      },
      onError: (error) => {
        console.error("Ошибка при покупке:", error);
        setIsErrorOpen(true); // Билет уже кто-то купил или сбой сервера
      },
    });
  };

  return (
    <>
      <div
        className={cn(
          "fixed left-0 right-0 bg-[#F9F9F9] rounded-t-3xl z-40 shadow-[0_-15px_40px_-10px_rgba(245,130,32,0.2)] transition-all duration-300 flex flex-col overflow-hidden",
          // В WebView мы приподнимаем корзину над BottomNav
          isExpanded ? "bottom-20" : "bottom-20",
        )}
      >
        <div
          className="w-full pt-3 pb-2 flex justify-center cursor-pointer active:bg-gray-100"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        <div className="px-5 pb-5 flex items-center justify-between">
          <div
            className="flex flex-col cursor-pointer"
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

          <Button
            onClick={handleCheckout}
            isLoading={isPending}
            className="w-auto bg-[#F58220] hover:bg-[#E56A00] text-white px-6 py-3.5 text-[13px] rounded-2xl"
          >
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
            <div className="border border-gray-200 rounded-2xl p-4 bg-white flex flex-col gap-3.5 shadow-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-[13px] font-medium">
                  Суперджекпот:
                </span>
                <span className="text-[#4B4B4B] font-bold text-[14px]">
                  {superCount} шт
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-[13px] font-medium">
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

      {/* Модалки рендерятся поверх всего */}
      <TopUpModal isOpen={isTopUpOpen} onClose={() => setIsTopUpOpen(false)} />

      <ErrorModal
        isOpen={isErrorOpen}
        onClose={() => setIsErrorOpen(false)}
        title="Сбой при оплате"
        message="Возможно, выбранные вами билеты уже были выкуплены другим участником. Пожалуйста, обновите список и попробуйте снова."
      />
    </>
  );
};
