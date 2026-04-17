"use client";

import Image from "next/image";
import Link from "next/link";

import { useMounted } from "@/hooks/useMounted";
import { Plus, Trash2 } from "lucide-react";

import { useCartStore } from "@/entities/cart/model";

import { Button } from "@/shared/ui/Button";
import { NumberedBall } from "@/shared/ui/NumberedBall";

const getTicketPlural = (count: number) => {
  const lastDigit = count % 10;
  const lastTwo = count % 100;
  if (lastTwo >= 11 && lastTwo <= 19) return "билетов";
  if (lastDigit === 1) return "билет";
  if (lastDigit >= 2 && lastDigit <= 4) return "билета";
  return "билетов";
};

// Визуальный компонент быстрого добавления билета (Левая колонка на ПК)
const QuickAddTicketMock = ({
  number,
  price,
}: {
  number: number;
  price: number;
}) => {
  const numbers = Array.from({ length: 36 }, (_, i) => i + 1);
  const selectedMock = [1, 16, 26, 30];

  return (
    <div className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100 flex flex-col relative mb-4">
      <div className="absolute -left-2 top-[30px] w-4 h-4 bg-[#F5F5F5] rounded-full border-r border-gray-100" />
      <div className="absolute -right-2 top-[30px] w-4 h-4 bg-[#F5F5F5] rounded-full border-l border-gray-100" />

      <div className="flex justify-between items-center border-b border-dashed border-gray-300 pb-4 mb-4">
        <span className="text-[#737373] font-medium text-sm">
          Билет №{number}
        </span>
        <span className="font-bold text-[#4B4B4B] text-[16px]">
          {price} <span className="underline">с</span>
        </span>
      </div>

      <div className="grid grid-cols-6 gap-2 mb-6">
        {numbers.map((num) => {
          const isSelected = selectedMock.includes(num);
          return (
            <div
              key={num}
              className={`flex items-center justify-center aspect-square rounded-md text-[13px] font-bold transition-colors cursor-pointer ${
                isSelected
                  ? "bg-[#FF7600] text-white shadow-sm"
                  : "bg-[#F9F9F9] text-[#4B4B4B] hover:bg-gray-200"
              }`}
            >
              {num}
            </div>
          );
        })}
      </div>

      <Button variant="primary" className="py-3.5 rounded-[16px] text-[13px]">
        Добавить • {price} с
      </Button>
    </div>
  );
};

export const CartClient = () => {
  const { items, toggleItem } = useCartStore();
  const mounted = useMounted();

  const removeItem = (item: any) => toggleItem(item);

  const totalPrice = items.reduce((acc, item) => acc + item.price, 0);
  const totalTickets = items.length;

  const superTicketsCount = items.filter((t) => t.type === "super").length;
  const superTicketsSum = items
    .filter((t) => t.type === "super")
    .reduce((acc, t) => acc + t.price, 0);

  const otherTicketsCount = items.filter((t) => t.type === "other").length;
  const otherTicketsSum = items
    .filter((t) => t.type === "other")
    .reduce((acc, t) => acc + t.price, 0);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-[24px] p-10 text-center shadow-sm max-w-2xl mx-auto mt-10">
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
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      {/* 1. ЛЕВАЯ КОЛОНКА: Быстрое добавление (Только ПК) */}
      <div className="hidden lg:flex w-[320px] flex-col shrink-0">
        <QuickAddTicketMock number={1} price={150} />
        <QuickAddTicketMock number={2} price={150} />
      </div>

      {/* 2. ЦЕНТРАЛЬНАЯ КОЛОНКА: Список билетов */}
      <div className="flex-1 w-full flex flex-col gap-3 md:gap-4 pb-32 lg:pb-0">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-[20px] p-4 md:p-5 flex flex-row items-center justify-between shadow-sm"
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

        {/* Кнопка добавить еще билет */}
        <Link href="/" className="block w-full mt-2">
          <Button
            variant="outline"
            className="w-full py-4 rounded-[16px] gap-2 border-gray-200"
          >
            <Plus size={18} /> Добавить еще билет
          </Button>
        </Link>
      </div>

      {/* 3. ПРАВАЯ КОЛОНКА: Детали заказа (Только ПК) */}
      <div className="hidden lg:flex w-[320px] flex-col bg-white rounded-[24px] p-6 shadow-sm shrink-0 sticky top-24">
        <h3 className="text-[18px] font-bold text-[#4B4B4B] mb-5">
          Детали заказа
        </h3>

        <div className="flex flex-col gap-3 mb-6">
          {superTicketsCount > 0 && (
            <div className="flex justify-between items-center text-[14px]">
              <span className="text-[#737373]">Суперджекпот</span>
              <span className="text-[#4B4B4B] font-medium">
                {superTicketsCount} {getTicketPlural(superTicketsCount)} •{" "}
                {superTicketsSum} с
              </span>
            </div>
          )}
          {otherTicketsCount > 0 && (
            <div className="flex justify-between items-center text-[14px]">
              <span className="text-[#737373]">Другой джекпот</span>
              <span className="text-[#4B4B4B] font-medium">
                {otherTicketsCount} {getTicketPlural(otherTicketsCount)} •{" "}
                {otherTicketsSum} с
              </span>
            </div>
          )}
        </div>

        <div className="border-t border-gray-100 pt-4 mb-6 flex justify-between items-center">
          <span className="text-[#4B4B4B] font-medium">Итого</span>
          <span className="text-[20px] font-black text-[#4B4B4B]">
            {totalPrice} <span className="underline">с</span>
          </span>
        </div>

        <Button className="w-full py-4 rounded-xl text-[16px] bg-[#FF7600] text-white">
          Купить
        </Button>
      </div>

      {/* МОБИЛЬНАЯ ПАНЕЛЬ ОПЛАТЫ (Drawer снизу, поверх BottomNav) */}
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
        <Button className="w-full bg-[#FF7600] text-white py-4 rounded-[16px] text-[16px]">
          Оплатить
        </Button>
      </div>
    </div>
  );
};
