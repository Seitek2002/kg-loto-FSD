"use client";

import { useCartStore } from "@/entities/cart/model";
import { useCurrentDraw, useTickets } from "@/entities/ticket/api";

import { DrawTicketCard } from "@/shared/ui/DrawTicketCard";
import { Skeleton } from "@/shared/ui/Skeleton";

export const DrawTicketsBlock = ({ lotteryId }: { lotteryId: string }) => {
  const { toggleItem, items } = useCartStore();
  const basketIds = items.map((item) => item.id);

  // 1. Получаем текущий активный тираж для этой лотереи
  const { data: currentDraw, isLoading: isDrawLoading } =
    useCurrentDraw(lotteryId);

  // 2. Если тираж найден, запрашиваем билеты для него
  const { data: ticketsData, isLoading: isTicketsLoading } = useTickets(
    {
      lotteryId: lotteryId,
      drawId: currentDraw?.drawId || "",
      limit: 30, // Берем 30 билетов, как в твоем ответе бэка
    },
    // Включаем запрос только когда у нас есть drawId
    !!currentDraw?.drawId,
  );

  const isLoading = isDrawLoading || isTicketsLoading;

  // Фильтруем только доступные билеты
  const availableTickets =
    ticketsData?.tickets?.filter((t) => t.status === "available") || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
      {isLoading ? (
        // Скелетоны во время загрузки
        Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col h-80"
          >
            <div className="flex justify-between border-b border-dashed border-gray-300 pb-4 mb-4">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-16" />
            </div>
            <div className="grid grid-cols-6 gap-2 mb-6 flex-1">
              {Array.from({ length: 36 }).map((_, j) => (
                <Skeleton key={j} className="aspect-square rounded-md" />
              ))}
            </div>
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        ))
      ) : !currentDraw ? (
        <div className="col-span-full text-center py-20 bg-white rounded-4xl border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bold text-[#4B4B4B] mb-2">
            Тираж закрыт
          </h3>
          <p className="text-gray-500">
            В данный момент нет активных тиражей для этой лотереи.
          </p>
        </div>
      ) : availableTickets.length === 0 ? (
        <div className="col-span-full text-center py-20 bg-white rounded-4xl border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bold text-[#4B4B4B] mb-2">
            Билеты раскуплены
          </h3>
          <p className="text-gray-500">
            Дождитесь следующего тиража или выберите другую лотерею.
          </p>
        </div>
      ) : (
        availableTickets.map((ticket, i) => {
          // Ищем, есть ли билет в корзине
          const isInBasket = basketIds.includes(ticket.ticketId);

          console.log(ticket);

          return (
            <DrawTicketCard
              key={ticket.ticketId}
              ticketNumber={ticket.ticketNumber}
              price={ticket.price}
              selectedNumbers={ticket.combination}
              isInBasket={isInBasket}
              onToggle={() =>
                toggleItem({
                  id: ticket.ticketId,
                  price: ticket.price,
                  type: "other", // Логика super/other если понадобится
                  ticketNumber: ticket.ticketNumber,
                  combination: ticket.combination,
                  lotteryId: lotteryId,
                  drawId: currentDraw.drawId,
                  name: `Тираж №${currentDraw.drawNumber}`, // Формируем красивое название из данных тиража
                })
              }
            />
          );
        })
      )}
    </div>
  );
};
