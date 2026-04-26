"use client";

import { useMemo, useState } from "react";

import { Loader2 } from "lucide-react";

import { useMyTickets } from "@/entities/ticket/api";
import { MyTicketCard } from "@/entities/ticket/ui/MyTicketCard";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/Button";

const TABS = ["Все билеты", "Выигрышные", "Не проверены"];

export const TicketsClient = () => {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const { data: tickets = [], isLoading } = useMyTickets();

  // Фильтрация
  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      if (activeTab === "Выигрышные") return t.status === "winning";
      if (activeTab === "Не проверены") return t.status === "sold";
      return true; // 'Все билеты'
    });
  }, [activeTab, tickets]);

  // console.log(tickets);

  return (
    <div className="bg-white min-h-[80vh] rounded-t-4xl sm:rounded-[40px] shadow-sm px-4 sm:px-8 pt-6 pb-10">
      {/* ТАБЫ */}
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
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4B4B4B] rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* СПИСОК БИЛЕТОВ ИЛИ СОСТОЯНИЕ ЗАГРУЗКИ */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-[#FF7600] mb-4" />
          <p className="text-[#737373] font-medium">Загружаем ваши билеты...</p>
        </div>
      ) : filteredTickets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTickets.map((ticket) => {
            // Маппинг статусов для UI компонента
            let uiStatus: "winning" | "unchecked" | "losing" = "unchecked";
            if (ticket.status === "winning") uiStatus = "winning";
            if (ticket.status === "losing") uiStatus = "losing";

            // Достаем номер тиража из drawId (например "001" из "draw-20260410-001")
            const drawNumberStr = ticket.drawId?.split("-").pop() || "";

            return (
              <MyTicketCard
                key={ticket.ticketId}
                ticketName={ticket.name || `Тираж №${drawNumberStr}`}
                price={Number(ticket.price)}
                date={ticket.purchaseDateDisplay || ticket.purchaseDate}
                prizeAmount={
                  ticket.prizeAmount ? String(ticket.prizeAmount) : "0"
                }
                logoSrc={
                  ticket.logo || "/images/draw-tickets/super-jackpot-logo.png"
                }
                status={uiStatus}
                showButton={uiStatus !== "losing"}
                drawNumber={drawNumberStr}
                combination={ticket.combination}
                drawDateDisplay={ticket.drawDateDisplay}
              />
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-[48px] mb-4">🎫</div>
          <h3 className="text-[18px] font-bold text-[#4B4B4B] mb-2">
            Билетов не найдено
          </h3>
          <p className="text-[#737373] text-[14px] max-w-62.5 mb-6">
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
