"use client";

import { useState } from "react";

import { CartDrawer } from "@/widgets/CartDrawer";
import { DrawTicketsBlock } from "@/widgets/DrawTicketsBlock";
import { PopularTicketsWidget } from "@/widgets/PopularTickets";
import { TicketsHeroWidget } from "@/widgets/TicketsHero";
// import { DrawRulesBlock } from '@/widgets/DrawRulesBlock'; // Пока закомментируем, если их еще нет
// import { DrawArchiveBlock } from '@/widgets/DrawArchiveBlock';
import { WinnersHistoryWidget } from "@/widgets/WinnersHistory";

interface LotteryClientProps {
  lotteryId: string;
}

export const LotteryClient = ({ lotteryId }: LotteryClientProps) => {
  const [activeTab, setActiveTab] = useState("tickets");

  return (
    <>
      <TicketsHeroWidget activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "tickets" && (
        <div className="mt-12 lg:mt-16">
          <div className="mb-12">
            <WinnersHistoryWidget />
          </div>
          <DrawTicketsBlock lotteryId={lotteryId} />
        </div>
      )}

      {activeTab === "rules" && (
        <div className="mt-12 lg:mt-16 text-center text-gray-500 py-10">
          {/* <DrawRulesBlock /> */}
          Здесь будут правила игры (Блок в разработке)
          <div className="mt-16 lg:mt-24 text-left">
            <WinnersHistoryWidget />
          </div>
          {/* <LotteryConditions terms={MOCK_TERMS} /> */}
          <PopularTicketsWidget
            title="Другие лотереи"
            currentLotteryId={lotteryId}
          />
        </div>
      )}

      {activeTab === "archive" && (
        <div className="mt-12 lg:mt-16 text-center text-gray-500 py-10">
          {/* <DrawArchiveBlock lotteryId={lotteryId} /> */}
          Здесь будет архив тиражей (Блок в разработке)
        </div>
      )}

      {/* Корзина всегда висит поверх всего, если в ней есть билеты */}
      <CartDrawer />
    </>
  );
};
