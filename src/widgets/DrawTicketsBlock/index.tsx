"use client";

// Твои хуки
import { useCartStore } from "@/entities/cart/model";

import { DrawTicketCard } from "@/shared/ui/DrawTicketCard";
// import { useCurrentDraws, useDrawTickets } from "@/entities/lottery/api";

import { Skeleton } from "@/shared/ui/Skeleton";

export const DrawTicketsBlock = ({ lotteryId }: { lotteryId: string }) => {
  const { toggleItem, items } = useCartStore();
  const basketIds = items.map((item) => item.id);

  // МОКОВЫЕ ДАННЫЕ (Пока сервер не готов, как ты просил)
  const isMock = true;
  const isLoading = false;

  const mockTickets = [
    {
      ticketId: "101",
      ticketNumber: "YT123456",
      price: 100,
      combination: [5, 12, 23, 31, 35],
    },
    {
      ticketId: "102",
      ticketNumber: "YT123457",
      price: 100,
      combination: [1, 8, 15, 22, 36],
    },
    {
      ticketId: "103",
      ticketNumber: "YT123458",
      price: 100,
      combination: [3, 9, 14, 27, 30],
    },
  ];

  const ticketsToRender = isMock ? mockTickets : []; // Позже заменишь на реальные данные из хуков

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
      {isLoading ? (
        Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-62.5 rounded-3xl" />
        ))
      ) : ticketsToRender.length === 0 ? (
        <div className="col-span-full text-center py-10 text-gray-500">
          Нет доступных билетов
        </div>
      ) : (
        ticketsToRender.map((ticket, index) => {
          const type = index % 2 === 0 ? "super" : "other";
          const isOrange = index % 2 === 0;
          const ticketIdStr = String(ticket.ticketId);

          return (
            <DrawTicketCard
              key={ticketIdStr}
              ticketNumber={ticket.ticketNumber}
              price={ticket.price}
              selectedNumbers={ticket.combination}
              isOrangeButton={isOrange}
              isInBasket={basketIds.includes(ticketIdStr)}
              onToggle={() =>
                toggleItem({
                  id: ticketIdStr,
                  price: ticket.price,
                  type: type as "super" | "other",
                  ticketNumber: ticket.ticketNumber,
                  combination: ticket.combination,
                  lotteryId: lotteryId,
                  drawId: "mock-draw-id", // Потом из activeDraw
                  name: `Тираж №123`,
                })
              }
            />
          );
        })
      )}
    </div>
  );
};
