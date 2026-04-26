"use client";

import { motion } from "framer-motion";

import { useCurrentLotteries } from "@/entities/lottery/api";
import {
  DrawLotteryCard,
  DrawLotteryCardSkeleton,
} from "@/entities/lottery/ui/DrawLotteryCard";

import { Description } from "@/shared/ui/Description";
import { Title } from "@/shared/ui/Title";

interface DrawLotteriesProps {
  title?: string;
  description?: string;
  currentLotteryId?: string; // Для фильтрации на странице деталей лотереи
}

export const DrawLotteriesWidget = ({
  title,
  description,
  currentLotteryId,
}: DrawLotteriesProps) => {
  const { data: lotteries, isLoading, isError } = useCurrentLotteries();

  // Фильтруем лотереи (если мы находимся на странице конкретной лотереи, скрываем её из списка "Другие")
  const filteredLotteries =
    currentLotteryId && lotteries
      ? lotteries.filter((loto) => String(loto.lotteryId) !== currentLotteryId)
      : lotteries;

  // Если загрузилось и пусто — ничего не рендерим, чтобы не ломать верстку
  if (!isLoading && (!filteredLotteries || filteredLotteries.length === 0))
    return null;

  console.log(lotteries);

  return (
    <div className="my-12" id="draw-lotteries">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
      >
        <Title>{title || "Тиражные лотереи"}</Title>
        <Description>
          {description || "Испытайте удачу и сорвите суперджекпот!"}
        </Description>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <DrawLotteryCardSkeleton key={i} />
          ))
        ) : isError ? (
          <div className="col-span-full flex flex-col items-center justify-center py-10 text-red-500 font-medium gap-2 bg-red-50 rounded-3xl">
            Ошибка при загрузке лотерей
          </div>
        ) : (
          filteredLotteries?.map((lottery) => (
            <DrawLotteryCard key={lottery.lotteryId} lottery={lottery} />
          ))
        )}
      </div>
    </div>
  );
};
