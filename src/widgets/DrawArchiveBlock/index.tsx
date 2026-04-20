"use client";

import { useMemo, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Loader2 } from "lucide-react";

import { DrawDetailsModal } from "@/features/draw-details/ui/DrawDetailsModal";

import { useCurrentDraws } from "@/entities/draw/api";
import type { CurrentDraw } from "@/entities/draw/api";

import { NumberedBall } from "@/shared/ui/NumberedBall";

interface DrawArchiveBlockProps {
  lotteryId: string;
}

export const DrawArchiveBlock = ({ lotteryId }: DrawArchiveBlockProps) => {
  // Мы больше не храним здесь первый месяц насильно.
  // Храним только те месяцы, на которые юзер явно кликнул.
  const [interactedMonths, setInteractedMonths] = useState<string[]>([]);

  // Флаг, чтобы понимать, трогал ли юзер аккордеон.
  // Если нет — мы будем принудительно держать первый месяц открытым.
  const [hasInteracted, setHasInteracted] = useState(false);

  const [selectedDrawId, setSelectedDrawId] = useState<string | null>(null);

  const { data: rawDraws, isLoading, isError } = useCurrentDraws(lotteryId);

  // Умная группировка по месяцам.
  // 🔥 Решили проблему #1: || [] теперь внутри useMemo, а в зависимости передаем rawDraws.
  const archiveData = useMemo(() => {
    const draws = (rawDraws as CurrentDraw[]) || [];
    if (draws.length === 0) return [];

    const completed = draws.filter(
      (d) => d.status === "completed" || d.status === "closed",
    );

    completed.sort(
      (a, b) => new Date(b.drawDate).getTime() - new Date(a.drawDate).getTime(),
    );

    const groups: Record<string, typeof completed> = {};

    completed.forEach((draw) => {
      const dateObj = new Date(draw.drawDate);
      const monthStr = dateObj.toLocaleString("ru-RU", {
        month: "long",
        year: "numeric",
      });
      const formattedMonth =
        monthStr.charAt(0).toUpperCase() + monthStr.slice(1);

      if (!groups[formattedMonth]) {
        groups[formattedMonth] = [];
      }
      groups[formattedMonth].push(draw);
    });

    return Object.entries(groups).map(([month, items]) => ({
      month,
      items,
    }));
  }, [rawDraws]); // Зависим от сырых данных

  // 🔥 Решили проблему #2: Убрали useEffect полностью!

  // Функция переключения вкладок
  const toggleMonth = (month: string) => {
    // Как только юзер кликнул, мы запоминаем, что он начал взаимодействие
    if (!hasInteracted) setHasInteracted(true);

    setInteractedMonths((prev) =>
      prev.includes(month) ? prev.filter((m) => m !== month) : [...prev, month],
    );
  };

  // Вычисляем, какие месяцы открыты прямо сейчас (в момент рендера)
  const getOpenMonths = () => {
    if (archiveData.length === 0) return [];

    // Если юзер еще ничего не нажимал, возвращаем первый месяц из загруженных данных
    if (!hasInteracted) {
      return [archiveData[0].month];
    }

    // Если нажимал — возвращаем то, что лежит в стейте
    return interactedMonths;
  };

  const openMonths = getOpenMonths();

  if (isLoading) {
    return (
      <div className="flex justify-center p-10 mt-8 lg:mt-12 bg-transparent lg:bg-white lg:rounded-4xl lg:shadow-sm lg:border lg:border-gray-100">
        <Loader2 className="animate-spin text-[#FF7600] w-10 h-10" />
      </div>
    );
  }

  if (isError || archiveData.length === 0) {
    return (
      <div className="mt-8 lg:mt-12 bg-transparent lg:bg-white lg:rounded-4xl lg:p-10 lg:shadow-sm lg:border lg:border-gray-100 text-center font-medium text-gray-500">
        Архив тиражей пока пуст.
      </div>
    );
  }

  return (
    <div className="mt-8 lg:mt-12 bg-transparent lg:bg-white lg:rounded-4xl lg:p-10 lg:shadow-sm lg:border lg:border-gray-100 text-left">
      {/* ШАПКА ТАБЛИЦЫ (Только ПК) */}
      <div className="hidden lg:grid grid-cols-5 gap-4 items-center bg-[#F58220] rounded-full px-8 py-4 mb-6">
        <div className="text-white font-bold text-[15px]">Тираж</div>
        <div className="text-white font-bold text-[15px]">Дата и время</div>
        <div className="text-white font-bold text-[15px]">Приз</div>
        <div className="text-white font-bold text-[15px]">
          Выигрышные комбинации
        </div>
        <div className="text-white font-bold text-[15px] text-right">
          Дополнительно
        </div>
      </div>

      {/* СПИСОК МЕСЯЦЕВ (Аккордеон) */}
      <div className="flex flex-col gap-2 lg:gap-4">
        {archiveData.map((group) => {
          // Проверяем, открыт ли текущий месяц
          const isOpen = openMonths.includes(group.month);

          return (
            <div key={group.month} className="flex flex-col">
              <button
                onClick={() => toggleMonth(group.month)}
                className="flex items-center gap-2 py-4 text-left w-full focus:outline-none"
              >
                <span className="text-[#4B4B4B] text-[18px] lg:text-[20px] font-bold">
                  {group.month}
                </span>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-6 h-6 text-gray-400" />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && group.items.length > 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col lg:gap-0 gap-4 mb-4">
                      {group.items.map((item) => {
                        const dateObj = new Date(item.drawDate);
                        const formattedDate = `${dateObj.toLocaleString("ru-RU", { day: "numeric", month: "short", year: "numeric" }).replace(" г.", "")}. ${item.drawTime.slice(0, 5)}`;

                        return (
                          <div key={item.drawId} className="contents">
                            {/* --- ДЕСКТОПНАЯ СТРОКА --- */}
                            <div className="hidden lg:grid grid-cols-5 gap-4 items-center px-8 py-5 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors rounded-2xl">
                              <div className="text-[#4B4B4B] text-[15px]">
                                №{item.drawNumber}
                              </div>
                              <div className="text-[#4B4B4B] text-[15px]">
                                {formattedDate}
                              </div>
                              <div className="text-[#4B4B4B] text-[15px]">
                                {item.jackpotAmount.toLocaleString("ru-RU")} с
                              </div>
                              <div className="flex gap-1.5 flex-wrap">
                                {item.winningCombination ? (
                                  item.winningCombination.map((num, i) => (
                                    <NumberedBall
                                      key={i}
                                      number={num}
                                      size={32}
                                    />
                                  ))
                                ) : (
                                  <span className="text-gray-400 text-[14px]">
                                    Ожидается...
                                  </span>
                                )}
                              </div>
                              <div
                                className="text-right text-[#4B4B4B] text-[14px] underline cursor-pointer hover:text-black transition-colors"
                                onClick={() => setSelectedDrawId(item.drawId)}
                              >
                                Подробнее
                              </div>
                            </div>

                            {/* --- МОБИЛЬНАЯ КАРТОЧКА --- */}
                            <div
                              onClick={() => setSelectedDrawId(item.drawId)}
                              className="flex lg:hidden flex-col gap-3 bg-white p-5 rounded-[20px] shadow-sm border border-gray-100 active:scale-[0.98] transition-transform cursor-pointer"
                            >
                              <div className="flex justify-between items-center">
                                <span className="text-[#737373] text-[14px] font-medium">
                                  Тираж
                                </span>
                                <span className="text-[#4B4B4B] text-[14px] font-bold">
                                  №{item.drawNumber}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-[#737373] text-[14px] font-medium">
                                  Приз
                                </span>
                                <span className="text-[#4B4B4B] text-[14px] font-bold">
                                  {item.jackpotAmount.toLocaleString("ru-RU")} с
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-[#737373] text-[14px] font-medium">
                                  Дата
                                </span>
                                <span className="text-[#4B4B4B] text-[14px] font-bold">
                                  {formattedDate}
                                </span>
                              </div>
                              <div className="flex justify-between items-center pt-1">
                                <span className="text-[#737373] text-[14px] font-medium">
                                  Комбинации
                                </span>
                                <div className="flex gap-1 flex-wrap justify-end">
                                  {item.winningCombination ? (
                                    item.winningCombination.map((num, i) => (
                                      <NumberedBall
                                        key={i}
                                        number={num}
                                        size={28}
                                      />
                                    ))
                                  ) : (
                                    <span className="text-gray-400 text-[14px]">
                                      ...
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <DrawDetailsModal
        isOpen={selectedDrawId !== null}
        onClose={() => setSelectedDrawId(null)}
        drawId={selectedDrawId}
      />
    </div>
  );
};
