"use client";

import Link from "next/link";

import { motion } from "framer-motion";

import { useLotteries } from "@/entities/lottery/api";
import { LotteryCard } from "@/entities/lottery/ui/LotteryCard";

import { Description } from "@/shared/ui/Description";
import { Skeleton } from "@/shared/ui/Skeleton";
import { Title } from "@/shared/ui/Title";

interface PopularTicketsProps {
  title?: string;
  description?: string;
  currentLotteryId?: string;
}

const formatTime = (time: string) =>
  time ? time.split(":").slice(0, 2).join(":") : "00:00";

export const PopularTicketsWidget = ({
  title,
  description,
  currentLotteryId,
}: PopularTicketsProps) => {
  const { data: lotteries, isLoading } = useLotteries();

  if (isLoading) {
    return (
      <div className="my-12">
        <Skeleton className="w-1/2 h-8 mb-4" />
        <Skeleton className="w-3/4 h-6 mb-6" />
        <div className="flex flex-wrap gap-4 mt-6">
          <Skeleton className="w-full md:w-[48%] h-62.5 rounded-3xl" />
          <Skeleton className="w-full md:w-[48%] h-62.5 rounded-3xl" />
        </div>
      </div>
    );
  }

  // Фильтруем данные на клиенте
  const filteredLotteries =
    currentLotteryId && lotteries
      ? lotteries.filter((loto) => String(loto.id) !== currentLotteryId)
      : lotteries;

  if (!filteredLotteries || filteredLotteries.length === 0) return null;

  return (
    <div className="my-12" id="instant">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
      >
        <Title>{title || "Популярные билеты"}</Title>
        <Description>
          {description || "Участвуйте и выигрывайте прямо сейчас"}
        </Description>
      </motion.div>

      <div className="flex justify-stretch flex-wrap gap-4 mt-6">
        {filteredLotteries.map((loto) => {
          const bgUrl = loto.backgroundImage || "";
          const isAnimation = bgUrl.toLowerCase().endsWith(".json");

          return (
            <div key={loto.id} className="block w-full md:w-[48%] relative">
              {/* Заменили TiltCard на простой Link с active:scale-95 для WebView */}
              <Link
                href={`/lottery/${loto.id}`}
                className="block w-full h-full transition-transform active:scale-95"
              >
                <LotteryCard
                  title={loto.title}
                  description={loto.subtitle || ""}
                  prize={loto.prizeText}
                  price={loto.buttonPrice ?? 0}
                  time={formatTime(loto.drawTime)}
                  theme={loto.theme}
                  lottieSrc={isAnimation ? bgUrl : undefined}
                  backgroundImage={!isAnimation ? bgUrl : undefined}
                />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};
