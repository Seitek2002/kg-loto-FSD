"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { useQueryClient } from "@tanstack/react-query";

import { TopUpModal } from "@/features/top-up/ui/TopUpModal";

import { useCartStore } from "@/entities/cart/model";
import { useBalance } from "@/entities/finance/api";
import { getSoldTicketErrorMessage, useLttPurchase } from "@/entities/ticket/api";

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
  const { mutate: purchase, isPending } = useLttPurchase();
  const { refetch: refetchBalance } = useBalance();
  const queryClient = useQueryClient();

  // Модалки
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>(
    "Возможно, выбранные вами билеты уже были выкуплены другим участником. Пожалуйста, обновите список и попробуйте снова.",
  );
  const [missingAmount, setMissingAmount] = useState<number>(0);

  if (items.length === 0) return null;

  const superCount = items.filter((t) => t.type === "super").length;
  const otherCount = items.filter((t) => t.type === "other").length;
  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = () => {
    const currentBalance = Number(user?.balance || 0);

    if (currentBalance < totalPrice) {
      setMissingAmount(totalPrice - currentBalance);
      setIsTopUpOpen(true);
      return;
    }

    // 2. Денег хватает -> Путь B: покупка реального LTT-билета за баланс
    const payload = {
      orderId: `ORD-${Date.now()}`,
      tickets: items.map((t) => t.id), // short_id билетов
      note: "",
    };

    // 3. Отправляем запрос на покупку
    purchase(payload, {
      onSuccess: (res) => {
        if (res?.status && res.status !== "confirmed") {
          setErrorMessage(
            "Покупка отклонена. Средства возвращены на баланс. Попробуйте ещё раз.",
          );
          setIsErrorOpen(true);
          refetchBalance();
          return;
        }
        clearCart();
        refetchBalance();
        setIsExpanded(false);
        // Купленные билеты не должны продолжать висеть в сетке как доступные
        queryClient.invalidateQueries({ queryKey: ["tickets"] });
        alert("Билеты успешно приобретены!"); // Позже заменим на красивый SuccessModal
        router.push("/tickets");
      },
      onError: (error) => {
        console.error("Ошибка при покупке:", error);
        const status = (error as { response?: { status?: number } })?.response
          ?.status;

        if (status === 402) {
          const bal = Number(user?.balance || 0);
          setMissingAmount(Math.max(totalPrice - bal, 0));
          setIsTopUpOpen(true);
          refetchBalance();
          return;
        }

        const soldMessage = getSoldTicketErrorMessage(error);
        if (soldMessage) {
          // Билет успели купить раньше нас — освежаем список, чтобы он пропал из сетки
          setErrorMessage(soldMessage);
          setIsErrorOpen(true);
          queryClient.invalidateQueries({ queryKey: ["tickets"] });
          return;
        }

        if (status === 400) {
          setErrorMessage(
            "Не удалось оформить покупку: билет уже продан или не заполнен профиль (дата рождения).",
          );
        } else if (status === 409) {
          setErrorMessage(
            "Заказ ещё обрабатывается. Подождите пару секунд и попробуйте снова.",
          );
        } else {
          setErrorMessage(
            "Возможно, выбранные билеты уже выкуплены. Попробуйте снова.",
          );
        }
        setIsErrorOpen(true);
      },
    });
  };

  return (
    <>
      <div
        className={cn(
          "fixed left-0 right-0 bg-[#F9F9F9] rounded-t-3xl z-100 shadow-[0_-15px_40px_-10px_rgba(245,130,32,0.2)] transition-all duration-300 flex flex-col overflow-hidden",
          // В WebView мы приподнимаем корзину над BottomNav
          isExpanded ? "bottom-0" : "bottom-0",
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
      <TopUpModal
        isOpen={isTopUpOpen}
        onClose={() => setIsTopUpOpen(false)}
        initialAmount={missingAmount}
        title="Выберите кошелек пополнения"
        description={
          <span className="text-[#EB5757] text-[13px] lg:text-[15px] block leading-relaxed">
            Недостаточно средств на вашем балансе.
            <br />
            Необходимо пополнить: {missingAmount} сом
          </span>
        }
      />

      <ErrorModal
        isOpen={isErrorOpen}
        onClose={() => setIsErrorOpen(false)}
        title="Сбой при оплате"
        message={errorMessage}
      />
    </>
  );
};
