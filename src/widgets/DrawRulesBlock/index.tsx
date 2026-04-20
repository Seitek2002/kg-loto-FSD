"use client";

import { cn } from "@/shared/lib/utils";
import { Description } from "@/shared/ui/Description";
import { Title } from "@/shared/ui/Title";

// Моковые данные для таблицы призов
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

export const DrawRulesBlock = () => {
  return (
    <section className="font-rubik text-[#4B4B4B]">
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
            выигрышным, если указанные в нем числа (в соответствии с выбранными
            игровыми комбинациями) совпадают с выпавшими номерами в ходе
            розыгрыша по следующим категориям:
          </Description>
        </div>

        {/* КАРТОЧКА 2: Таблица призов (Мобильная версия) */}
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

        {/* КАРТОЧКА 2: Таблица призов (ПК версия) */}
        <div className="hidden lg:flex flex-row items-center bg-white rounded-4xl p-8 shadow-sm border border-gray-100">
          <div className="flex flex-col space-y-8 pr-8 border-r border-gray-100 min-w-[160px] text-left">
            <div className="text-[15px] font-bold text-[#4B4B4B]">
              Категория
            </div>
            <div className="text-[15px] font-bold text-[#4B4B4B]">
              Совпадение
            </div>
            <div className="text-[15px] font-bold text-[#4B4B4B]">Приз</div>
          </div>

          <div className="flex flex-row flex-1 justify-around pl-8">
            {PRIZE_TIERS.map((item) => (
              <div
                key={item.id}
                className="flex flex-col space-y-8 text-center"
              >
                <div
                  className={cn(
                    "text-[26px] font-black",
                    item.isSuper ? "text-[#F58220]" : "text-[#F6C635]",
                  )}
                >
                  {item.category}
                </div>
                <div className="text-[28px] font-black text-[#4B4B4B] tracking-wide">
                  {item.match}
                </div>
                <div
                  className={cn(
                    "text-[26px] font-black",
                    item.isSuper ? "text-[#F58220]" : "text-[#F6C635]",
                  )}
                >
                  {item.prize}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* КАРТОЧКА 3: Дополнительные правила */}
        <div className="bg-white rounded-3xl lg:rounded-4xl p-6 lg:p-8 shadow-sm border border-gray-100 flex flex-col gap-6">
          <Description className="lg:max-w-none">
            Если в 1-й категории отсутствуют победители, сумма джекпота
            переносится на следующий тираж.
          </Description>

          <div>
            <h3 className="font-bold text-[14px] lg:text-[16px] mb-2">
              Правила округления выигрышей:
            </h3>
            <Description className="lg:max-w-none">
              В меньшую сторону до целых 100 сом. Расчет выигрышей
              осуществляется автоматически системой без вмешательства человека.
            </Description>
          </div>

          <div>
            <h3 className="font-bold text-[14px] lg:text-[16px] mb-2">
              Порядок получения выигрыша:
            </h3>
            <Description className="lg:max-w-none">
              Свяжитесь с нами в течение 3 (трех) месяцев с даты тиража по
              указанным телефонам. Для получения приза Участнику необходимо в
              головном офисе Оператора, предоставить оригинал билета, а также
              оригинал и копию паспорта. Выигрышный билет подлежит экспертизе на
              целостность и отсутствие химических/механических воздействий
              сроком до 30 дней. При признании билета поддельным выигрыш не
              выплачивается, а материалы передаются в правоохранительные органы.
            </Description>
          </div>
        </div>
      </div>
    </section>
  );
};
