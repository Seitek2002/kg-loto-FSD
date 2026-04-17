"use client";

import { cn } from "@/shared/lib/utils";
import { Description } from "@/shared/ui/Description";
import { Title } from "@/shared/ui/Title";

const PRIZE_TIERS = [
  {
    id: 1,
    category: "Суперприз",
    match: "5/5",
    prize: "Джекпот",
    isSuper: true,
  },
  { id: 2, category: "2", match: "4/5", prize: "10 000", isSuper: false },
  { id: 3, category: "3", match: "3/5", prize: "500", isSuper: false },
  { id: 4, category: "4", match: "2/5", prize: "100", isSuper: false },
];

const MOCK_TERMS = [
  {
    id: 1,
    text: "Лицам младше 18-ти лет запрещено приобретать лотерейные билеты.",
    order: 1,
  },
  {
    id: 2,
    text: "Участником считается физическое лицо, законно приобретшее лотерейный билет.",
    order: 2,
  },
  {
    id: 3,
    text: "Стоимость билета не должна превышать цену, указанную на билете.",
    order: 3,
  },
  // ... можешь оставить остальные для массовки
];

export const DrawRulesBlock = () => {
  const ROWS = Math.ceil(MOCK_TERMS.length / 2);
  const gridRowsClasses: Record<number, string> = {
    1: "lg:grid-rows-1",
    2: "lg:grid-rows-2",
    3: "lg:grid-rows-3",
    4: "lg:grid-rows-4",
    5: "lg:grid-rows-5",
    6: "lg:grid-rows-6",
  };
  const gridRowsClass = gridRowsClasses[ROWS] || "lg:grid-rows-4";

  return (
    <section className="font-rubik text-[#4B4B4B] text-left">
      <Title>ПРАВИЛА ТИРАЖНОЙ ЛОТЕРЕИ &quot;СУПЕРДЖЕКПОТ 5 ИЗ 36&quot;</Title>

      <div className="flex flex-col gap-4 lg:gap-6 mt-6">
        {/* КАРТОЧКА 1: Определение выигрыша */}
        <div className="bg-white rounded-3xl lg:rounded-4xl p-6 lg:p-8 shadow-sm border border-gray-100">
          <h3 className="font-bold text-[14px] lg:text-[16px] mb-3">
            Определение выигрыша:
          </h3>
          <Description className="lg:max-w-none">
            Победитель определяется в ходе трансляции тиража. Выигрышная
            комбинация из 5 (пяти) чисел в диапазоне от 1 до 36 определяется
            случайным образом с использованием лототрона. Билет считается
            выигрышным, если указанные в нем числа совпадают с выпавшими
            номерами.
          </Description>
        </div>

        {/* КАРТОЧКА 2: Таблица призов (Мобильная) */}
        <div className="grid lg:hidden grid-cols-3 gap-y-5 items-center text-center bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="text-[12px] sm:text-[14px] font-bold text-[#4B4B4B] mb-2">
            Категория
          </div>
          <div className="text-[12px] sm:text-[14px] font-bold text-[#4B4B4B] mb-2">
            Совпадение
          </div>
          <div className="text-[12px] sm:text-[14px] font-bold text-[#4B4B4B] mb-2">
            Приз
          </div>

          {PRIZE_TIERS.map((item) => (
            <div key={item.id} className="contents">
              <div
                className={cn(
                  "text-[16px] sm:text-[20px] font-black",
                  item.isSuper ? "text-[#F58220]" : "text-[#F6C635]",
                )}
              >
                {item.category}
              </div>
              <div className="text-[18px] sm:text-[22px] font-black text-[#4B4B4B] tracking-wide">
                {item.match}
              </div>
              <div
                className={cn(
                  "text-[16px] sm:text-[20px] font-black",
                  item.isSuper ? "text-[#F58220]" : "text-[#F6C635]",
                )}
              >
                {item.prize}
              </div>
            </div>
          ))}
        </div>

        {/* КАРТОЧКА 3: Дополнительные правила */}
        <div className="bg-white rounded-3xl lg:rounded-4xl p-6 lg:p-8 shadow-sm border border-gray-100 flex flex-col gap-6">
          <Description className="lg:max-w-none">
            Если в 1-й категории отсутствуют победители, сумма джекпота
            переносится на следующий тираж.
          </Description>
          <div>
            <h3 className="font-bold text-[14px] lg:text-[16px] mb-2">
              Порядок получения выигрыша:
            </h3>
            <Description className="lg:max-w-none">
              Свяжитесь с нами в течение 3 (трех) месяцев с даты тиража по
              указанным телефонам. Для получения приза необходимо предоставить
              оригинал билета.
            </Description>
          </div>
        </div>

        {/* БЛОК УСЛОВИЙ (Из LotteryConditions) */}
        <div className="mt-8 mb-6">
          <Title>Условия участия</Title>
          <Description>Основные положения для участников лотереи</Description>
        </div>

        <div className="bg-white rounded-3xl md:rounded-[40px] shadow-sm border border-gray-100 p-6 md:p-10">
          <div
            className={cn(
              "grid grid-cols-1 lg:grid-cols-2 lg:grid-flow-col",
              gridRowsClass,
            )}
          >
            {MOCK_TERMS.map((term, index) => {
              const isLastItemMobile = index === MOCK_TERMS.length - 1;
              return (
                <div
                  key={term.id}
                  className={cn(
                    "flex gap-4 p-4 md:p-6 lg:p-8",
                    !isLastItemMobile &&
                      "border-b border-dashed border-gray-200 lg:border-b-0",
                  )}
                >
                  <span className="text-sm md:text-base font-bold text-gray-400 font-rubik shrink-0">
                    {index + 1}.
                  </span>
                  <p className="text-xs md:text-xl text-[#4B4B4B] font-rubik leading-relaxed font-medium">
                    {term.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
