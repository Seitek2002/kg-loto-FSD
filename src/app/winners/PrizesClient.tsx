"use client";

import { useMemo, useState } from "react";

import { MyTicketCard } from "@/entities/ticket/ui/MyTicketCard";

import { cn } from "@/shared/lib/utils";

// Моковые данные призов
const MOCK_PRIZES = [
  {
    id: "1",
    name: "Мен миллионер",
    price: 500,
    date: "12.09.2026",
    prize: "10 000",
    logo: "/images/draw-tickets/super-jackpot-logo.png",
    status: "winning" as const,
    badge: { text: "Получен", variant: "success" as const },
  },
  {
    id: "2",
    name: "Мен миллионер",
    price: 500,
    date: "12.09.2026",
    prize: "10 000",
    logo: "/images/draw-tickets/super-jackpot-logo.png",
    status: "winning" as const,
    badge: { text: "Получен", variant: "success" as const },
  },
  {
    id: "3",
    name: "Суперджекпот 5 из 36",
    drawNumber: "№005034",
    price: 500,
    date: "12.09.2026",
    prize: "10 000",
    logo: "/images/draw-tickets/super-jackpot-logo.png",
    status: "winning" as const,
    badge: { text: "Получен", variant: "success" as const },
  },
  {
    id: "4",
    name: "Алга",
    price: 100,
    date: "15.08.2026",
    prize: "Смартфон",
    logo: "/images/draw-tickets/super-jackpot-logo.png",
    status: "winning" as const,
    badge: { text: "Ожидает", variant: "waiting" as const },
  },
  {
    id: "5",
    name: "Керемет",
    price: 200,
    date: "01.09.2026",
    prize: "50 000",
    logo: "/images/draw-tickets/super-jackpot-logo.png",
    status: "winning" as const,
    badge: { text: "В обработке", variant: "processing" as const },
  },
];

const TABS = ["Получены", "Ожидают", "В обработке"];

export const PrizesClient = () => {
  const [activeTab, setActiveTab] = useState(TABS[0]);

  // Фильтрация по табам
  const filteredPrizes = useMemo(() => {
    return MOCK_PRIZES.filter((p) => {
      if (activeTab === "Получены") return p.badge.variant === "success";
      if (activeTab === "Ожидают") return p.badge.variant === "waiting";
      if (activeTab === "В обработке") return p.badge.variant === "processing";
      return true;
    });
  }, [activeTab]);

  return (
    <div className="bg-white min-h-[80vh] rounded-t-[32px] sm:rounded-[40px] shadow-sm px-4 sm:px-8 pt-6 pb-10">
      {/* КАСТОМНЫЕ ТАБЫ */}
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

      {/* СПИСОК ПРИЗОВ */}
      {filteredPrizes.length > 0 ? (
        <div className="flex flex-col gap-4">
          {filteredPrizes.map((ticket) => (
            <MyTicketCard
              key={ticket.id}
              ticketName={ticket.name}
              drawNumber={ticket.drawNumber}
              price={ticket.price}
              date={ticket.date}
              prizeAmount={ticket.prize}
              logoSrc={ticket.logo}
              status={ticket.status}
              badge={ticket.badge}
              showButton={false} // На этой вкладке кнопок нет, только бейджики
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-[48px] mb-4">🎁</div>
          <h3 className="text-[18px] font-bold text-[#4B4B4B] mb-2">
            В этой категории пусто
          </h3>
          <p className="text-[#737373] text-[14px]">
            Здесь появятся ваши призы.
          </p>
        </div>
      )}
    </div>
  );
};
