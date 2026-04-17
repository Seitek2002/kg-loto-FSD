"use client";

import Link from "next/link";

import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";

import { useWinners } from "@/entities/winner/api";
import { WinnerCard } from "@/entities/winner/ui/WinnerCard";

import { Button } from "@/shared/ui/Button";
import { Description } from "@/shared/ui/Description";
import { Skeleton } from "@/shared/ui/Skeleton";
import { Title } from "@/shared/ui/Title";

interface WinnersHistoryProps {
  title?: string;
  description?: string;
}

export const WinnersHistoryWidget = ({
  title,
  description,
}: WinnersHistoryProps) => {
  const { data: winners, isLoading } = useWinners();

  if (isLoading) {
    return (
      <section className="my-12 overflow-hidden">
        <Skeleton className="w-1/2 h-8 mb-2" />
        <Skeleton className="w-3/4 h-6 mb-8" />
        <div className="flex gap-4">
          <Skeleton className="w-[85%] md:w-[45%] lg:w-[30%] aspect-4/5 rounded-4xl shrink-0" />
          <Skeleton className="w-[85%] md:w-[45%] lg:w-[30%] aspect-4/5 rounded-4xl shrink-0" />
        </div>
      </section>
    );
  }

  const displayWinners = winners?.slice(0, 6) || [];
  if (displayWinners.length === 0) return null;

  return (
    <section className="my-12 relative overflow-hidden">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-8">
        <div className="max-w-2xl">
          <Title>{title || "Наши победители"}</Title>
          <Description>
            {description || "Истории успеха наших игроков"}
          </Description>
        </div>

        <Link href="/winners" className="hidden lg:block">
          <Button
            variant="outline"
            className="px-6 py-3 rounded-full text-xs border-gray-200 bg-white"
          >
            Все победители
          </Button>
        </Link>
      </div>

      <Swiper
        spaceBetween={16}
        slidesPerView={1.1}
        breakpoints={{
          640: { slidesPerView: 2.2 },
          1024: { slidesPerView: 3.2 },
        }}
        className="overflow-visible!"
      >
        {displayWinners.map((winner) => (
          <SwiperSlide key={winner.id}>
            <WinnerCard winner={winner} />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="mt-8 lg:hidden">
        <Link href="/winners" className="block w-full">
          <Button
            variant="primary"
            className="w-full bg-white text-[#4B4B4B] shadow-md border border-gray-100"
          >
            Все победители
          </Button>
        </Link>
      </div>
    </section>
  );
};
