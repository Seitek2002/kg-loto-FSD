"use client";

import { useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useMounted } from "@/hooks/useMounted";
import { Loader2, Plus, Trash2 } from "lucide-react";

import { useCartStore } from "@/entities/cart/model";
import { useBalance } from "@/entities/finance/api";
import {
  type TicketDto,
  usePurchaseTickets,
  useTickets,
} from "@/entities/ticket/api";

import { Button } from "@/shared/ui/Button";
import { ErrorModal } from "@/shared/ui/ErrorModal";
import { NumberedBall } from "@/shared/ui/NumberedBall";

// Вспомогательная функция для склонения
const getTicketPlural = (count: number) => {
  const lastDigit = count % 10;
  const lastTwo = count % 100;
  if (lastTwo >= 11 && lastTwo <= 19) return "билетов";
  if (lastDigit === 1) return "билет";
  if (lastDigit >= 2 && lastDigit <= 4) return "билета";
  return "билетов";
};

// 🔥 Реальный компонент для левой колонки (Быстрое добавление)
const RealQuickAddTicket = ({
  ticket,
  lotteryId,
  drawId,
}: {
  ticket: TicketDto;
  lotteryId: string;
  drawId: string;
}) => {
  const { toggleItem, items } = useCartStore();
  const numbers = Array.from({ length: 36 }, (_, i) => i + 1);

  const isInCart = items.some((i) => i.id === ticket.ticket_id);

  const handleAdd = () => {
    toggleItem({
      id: ticket.ticket_id,
      price: ticket.price,
      type: "other",
      ticketNumber: ticket.ticket_number,
      combination: ticket.combination,
      lotteryId: lotteryId,
      drawId: drawId,
      name: `Тираж №${drawId.split("-").pop()}`,
    });
  };

  return (
    <div className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100 flex flex-col relative mb-4">
      <div className="absolute -left-2 top-[30px] w-4 h-4 bg-[#F5F5F5] rounded-full border-r border-gray-100" />
      <div className="absolute -right-2 top-[30px] w-4 h-4 bg-[#F5F5F5] rounded-full border-l border-gray-100" />

      <div className="flex justify-between items-center border-b border-dashed border-gray-300 pb-4 mb-4">
        <span className="text-[#737373] font-medium text-sm">
          Билет №{ticket.ticket_number}
        </span>
        <span className="font-bold text-[#4B4B4B] text-[16px]">
          {ticket.price} <span className="underline">с</span>
        </span>
      </div>

      <div className="grid grid-cols-6 gap-2 mb-6">
        {numbers.map((num) => {
          const isSelected = ticket.combination.includes(num);
          return (
            <div
              key={num}
              className={`flex items-center justify-center aspect-square rounded-md text-[13px] font-bold transition-colors ${
                isSelected
                  ? "bg-[#FF7600] text-white shadow-sm"
                  : "bg-[#F9F9F9] text-[#4B4B4B]"
              }`}
            >
              {num}
            </div>
          );
        })}
      </div>

      <Button
        variant={isInCart ? "outline" : "primary"}
        onClick={handleAdd}
        className={`py-3.5 rounded-[16px] text-[13px] ${
          isInCart ? "border-[#FF7600] text-[#FF7600]" : ""
        }`}
      >
        {isInCart ? "Убрать из корзины" : `Добавить • ${ticket.price} с`}
      </Button>
    </div>
  );
};

export const CartClient = () => {
  const { items, toggleItem, clearCart } = useCartStore();
  const mounted = useMounted();
  const router = useRouter();

  // API Хуки
  const { mutate: purchase, isPending: isPurchasing } = usePurchaseTickets();
  const { refetch: refetchBalance } = useBalance();

  // Состояние ошибки
  const [isErrorOpen, setIsErrorOpen] = useState(false);

  // Получаем данные для боковой панели (ищем билеты из того же тиража)
  const firstItem = items[0];
  const { data: ticketsData, isLoading: isTicketsLoading } = useTickets(
    {
      lotteryId: firstItem?.lotteryId || "",
      drawId: firstItem?.drawId || "",
      limit: 10,
    },
    items.length > 0, // Запрашиваем билеты, только если корзина не пуста
  );

  const availableTickets =
    ticketsData?.tickets?.filter((t) => t.status === "available") || [];
  const quickAddTickets = availableTickets.slice(0, 2);

  const removeItem = (item: any) => toggleItem(item);

  const totalPrice = items.reduce((acc, item) => acc + item.price, 0);
  const totalTickets = items.length;

  const handleCheckout = () => {
    if (items.length === 0) return;

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

    purchase(payload, {
      onSuccess: () => {
        clearCart();
        refetchBalance();
        router.push("/profile");
      },
      onError: (error) => {
        console.error("Ошибка покупки:", error);
        setIsErrorOpen(true);
      },
    });
  };

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-[24px] p-10 text-center shadow-sm max-w-2xl mx-auto mt-10 border border-gray-100">
        <p className="text-[#4B4B4B] font-bold text-lg mb-4">
          Ваша корзина пуста
        </p>
        <Link href="/" className="text-[#FF7600] font-bold hover:underline">
          Перейти к выбору билетов
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* ЛЕВАЯ КОЛОНКА: Быстрое добавление */}
        <div className="hidden lg:flex w-[320px] flex-col shrink-0">
          <h3 className="text-[16px] font-bold text-[#4B4B4B] mb-4">
            Попробуйте также
          </h3>
          {isTicketsLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin text-[#FF7600] w-8 h-8" />
            </div>
          ) : quickAddTickets.length > 0 ? (
            quickAddTickets.map((ticket) => (
              <RealQuickAddTicket
                key={ticket.ticket_id}
                ticket={ticket}
                lotteryId={ticketsData!.lottery_id}
                drawId={ticketsData!.draw_id}
              />
            ))
          ) : (
            <div className="text-sm text-gray-400">
              Дополнительных билетов в этом тираже пока нет
            </div>
          )}
        </div>

        {/* ЦЕНТРАЛЬНАЯ КОЛОНКА: Список билетов */}
        <div className="flex-1 w-full flex flex-col gap-3 md:gap-4 pb-32 lg:pb-0">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-[20px] p-4 md:p-5 flex flex-row items-center justify-between shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="relative w-[80px] h-[80px] md:w-[96px] md:h-[96px] rounded-[16px] overflow-hidden shrink-0 bg-[#F58220]/20">
                  <Image
                    src="/images/draw-tickets/big-block-bg.png"
                    alt={item.name}
                    fill
                    unoptimized
                    className="object-cover opacity-90"
                  />
                </div>

                <div className="flex flex-col justify-center gap-1.5 md:gap-2">
                  <h3 className="text-[14px] md:text-[16px] font-medium text-[#4B4B4B] leading-tight">
                    {item.name}
                  </h3>
                  <div className="flex flex-wrap gap-1 items-center">
                    {item.combination.map((num, i) => (
                      <NumberedBall key={i} number={num} size={28} />
                    ))}
                  </div>
                  <div className="text-[15px] md:text-[18px] font-black text-[#4B4B4B]">
                    {item.price} сом
                  </div>
                </div>
              </div>

              <button
                onClick={() => removeItem(item)}
                className="w-[44px] h-[44px] border border-gray-200 rounded-full flex items-center justify-center text-[#A3A3A3] hover:bg-gray-50 hover:text-[#DC2626] transition-colors active:scale-95 shrink-0 ml-2"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
          <Link href="/" className="block w-full mt-2">
            <Button
              variant="outline"
              className="w-full py-4 rounded-[16px] gap-2 border-gray-200"
            >
              <Plus size={18} /> Добавить еще билет
            </Button>
          </Link>
        </div>

        {/* ПРАВАЯ КОЛОНКА: Детали заказа (Десктоп) */}
        <div className="hidden lg:flex w-[320px] flex-col bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 shrink-0 sticky top-24">
          <h3 className="text-[18px] font-bold text-[#4B4B4B] mb-5">
            Детали заказа
          </h3>
          <div className="border-t border-gray-100 pt-4 mb-6 flex justify-between items-center">
            <span className="text-[#4B4B4B] font-medium">Итого</span>
            <span className="text-[20px] font-black text-[#4B4B4B]">
              {totalPrice} <span className="underline">с</span>
            </span>
          </div>
          <Button
            onClick={handleCheckout}
            isLoading={isPurchasing}
            className="w-full py-4 rounded-xl text-[16px] bg-[#FF7600] hover:bg-[#E56A00] text-white"
          >
            Оплатить
          </Button>
        </div>

        {/* МОБИЛЬНАЯ ПАНЕЛЬ ОПЛАТЫ */}
        <div className="lg:hidden fixed bottom-[90px] left-4 right-4 bg-white rounded-[24px] p-5 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-40 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col">
              <span className="text-[13px] text-[#737373] font-medium mb-1">
                Итого:
              </span>
              <span className="text-[16px] font-bold text-[#4B4B4B] leading-none">
                {totalTickets} {getTicketPlural(totalTickets)}
              </span>
            </div>
            <div className="text-[24px] font-black text-[#4B4B4B]">
              {totalPrice}{" "}
              <span className="underline decoration-2 underline-offset-2 text-[18px]">
                с
              </span>
            </div>
          </div>
          <Button
            onClick={handleCheckout}
            isLoading={isPurchasing}
            className="w-full bg-[#FF7600] hover:bg-[#E56A00] text-white py-4 rounded-[16px] text-[16px]"
          >
            Оплатить
          </Button>
        </div>
      </div>

      <ErrorModal
        isOpen={isErrorOpen}
        onClose={() => setIsErrorOpen(false)}
        title="Оплата не прошла"
        message="Возможно, на вашем балансе недостаточно средств или выбранные билеты уже выкуплены. Проверьте баланс и попробуйте снова."
      />
    </>
  );
};
