"use client";

import { useEffect, useState } from "react";

import { useMounted } from "@/hooks/useMounted";
import { Clock } from "lucide-react";

interface CountdownTimerProps {
  targetDate: string;
}

export const CountdownTimer = ({ targetDate }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const mounted = useMounted();

  useEffect(() => {
    if (!targetDate) return;

    const target = new Date(targetDate).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft("Продажи закрыты");
        clearInterval(interval);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      if (days > 0) {
        setTimeLeft(
          `${days} дн. ${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
        );
      } else {
        setTimeLeft(
          `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (!mounted) return null;

  return (
    <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-full px-3 py-1.5 flex items-center gap-2 text-[12px] md:text-[14px] font-medium shadow-sm z-10">
      <Clock size={16} />
      {timeLeft || "Вычисление..."}
    </div>
  );
};
