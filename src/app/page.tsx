import { CheckLotteryWidget } from "@/widgets/CheckLottery";
import { DrawLotteriesWidget } from "@/widgets/DrawLotteries";
import { FAQWidget } from "@/widgets/FAQ";
import { HeroWidget } from "@/widgets/Hero";

import api from "@/shared/api/apiClient";

export const metadata = {
  title: "KGLOTO | Главная",
  description: "Покупайте билеты и выигрывайте призы!",
};

// Когда билеты куплены, они дают вот такой вот ответ - {
//   "orderId": "ORD-1776723499223",
//   "status": "confirmed",
//   "registeredAt": "2026-04-21T04:18:19.397975+06:00",
//   "items": [
//     {
//       "ticketId": "t-000001",
//       "status": "sold"
//     },
//     {
//       "ticketId": "t-000003",
//       "status": "sold"
//     }
//   ],
//   "balance": "0.00"
// }

export default async function Home() {
  // 🔥 ТЕСТОВЫЙ ЗАПРОС ЗА СЛОВАРЕМ
  try {
    // Если эндпоинт другой, просто поменяй строку ниже
    const { data } = await api.get("/page-texts");
    // console.log("=== СЛОВАРЬ ИЗ АДМИНКИ (КОПИРОВАТЬ ОТСЮДА) ===");
    // console.log(JSON.stringify(data, null, 2)); // stringify сделает вывод красивым и удобным для копирования
    JSON.stringify(data, null, 2)
    // console.log("===============================================");
  } catch (error) {
    console.error("Не удалось получить словарь. Проверь эндпоинт:", error);
  }

  return (
    <>
      <HeroWidget /> {/* slider */}
      <div className="mt-10 max-w-300 mx-auto px-4">
        {/* <PopularTicketsWidget /> */}
        <DrawLotteriesWidget /> {/* /lotteries/current */}
        <CheckLotteryWidget />
        <FAQWidget />
      </div>
      <div className="h-8" />
    </>
  );
}
