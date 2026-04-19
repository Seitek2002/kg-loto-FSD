"use client";

import { useMemo, useState } from "react";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/Button";

import { MyTicketCard } from "@/entities/ticket/ui/MyTicketCard";

// Моковые данные
const MOCK_TICKETS = [
  {
    id: "1",
    name: "Мен миллионер",
    price: 500,
    date: "12.09.2026",
    prize: "10 000",
    logo: "/images/draw-tickets/super-jackpot-logo.png",
    status: "winning",
  },
  {
    id: "2",
    name: "Саткын",
    price: 200,
    date: "11.09.2026",
    prize: "0",
    logo: "/images/draw-tickets/super-jackpot-logo.png",
    status: "unchecked",
  },
  {
    id: "3",
    name: "Мен миллионер",
    price: 500,
    date: "10.09.2026",
    prize: "50 000",
    logo: "/images/draw-tickets/super-jackpot-logo.png",
    status: "winning",
  },
  {
    id: "4",
    name: "Алга",
    price: 100,
    date: "05.09.2026",
    prize: "0",
    logo: "/images/draw-tickets/super-jackpot-logo.png",
    status: "losing",
  },
] as const;

const TABS = ["Выигрышные", "Не проверены", "Все билеты"];

export const TicketsClient = () => {
  const [activeTab, setActiveTab] = useState(TABS[0]);

  // Фильтрация
  const filteredTickets = useMemo(() => {
    return MOCK_TICKETS.filter((t) => {
      if (activeTab === "Выигрышные") return t.status === "winning";
      if (activeTab === "Не проверены") return t.status === "unchecked";
      return true; // 'Все билеты'
    });
  }, [activeTab]);

  return (
    <div className="bg-white min-h-[80vh] rounded-t-[32px] sm:rounded-[40px] shadow-sm px-4 sm:px-8 pt-6 pb-10">
      {/* КАСТОМНЫЕ ТАБЫ (Как на скриншоте) */}
      <div className="flex gap-6 border-b border-gray-100 mb-6 overflow-x-auto scrollbar-hide">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "pb-3 text-[14px] sm:text-[15px] font-bold transition-colors relative whitespace-nowrap",
              activeTab === tab
                ? "text-[#4B4B4B]"
                : "text-[#A3A3A3] hover:text-gray-500",
            )}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#4B4B4B] rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* СПИСОК БИЛЕТОВ */}
      {filteredTickets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTickets.map((ticket) => (
            <MyTicketCard
              key={ticket.id}
              ticketName={ticket.name}
              price={ticket.price}
              date={ticket.date}
              prizeAmount={ticket.prize}
              logoSrc={ticket.logo}
              status={ticket.status}
              showButton={ticket.status !== "losing"}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-[48px] mb-4">🎫</div>
          <h3 className="text-[18px] font-bold text-[#4B4B4B] mb-2">
            Билетов не найдено
          </h3>
          <p className="text-[#737373] text-[14px] max-w-[250px] mb-6">
            В этой категории у вас пока нет билетов.
          </p>
          <Button
            variant="outline"
            className="border-gray-200 bg-white"
            onClick={() => (window.location.href = "/")}
          >
            Купить билет
          </Button>
        </div>
      )}
    </div>
  );
};
