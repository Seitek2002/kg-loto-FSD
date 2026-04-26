import { cn } from "@/shared/lib/utils";

import { Button } from "./Button";

interface TicketCardProps {
  ticketNumber: number | string;
  price: number;
  selectedNumbers: number[];
  isInBasket: boolean;
  onToggle: () => void;
}

export const DrawTicketCard = ({
  ticketNumber,
  price,
  selectedNumbers,
  isInBasket,
  onToggle,
}: TicketCardProps) => {
  const numbers = Array.from({ length: 36 }, (_, i) => i + 1);

  return (
    <div
      className={cn(
        "bg-white rounded-3xl p-5 shadow-sm border flex flex-col relative transition-colors duration-300",
        isInBasket ? "border-[#4B4B4B]" : "border-gray-100",
      )}
    >
      {/* Боковые вырезы */}
      <div className="absolute -left-2 top-7.5 w-4 h-4 bg-[#F5F5F5] rounded-full border-r border-gray-100" />
      <div className="absolute -right-2 top-7.5 w-4 h-4 bg-[#F5F5F5] rounded-full border-l border-gray-100" />

      <div className="flex justify-between font-benzin items-center border-b border-dashed border-gray-300 pb-4 mb-4">
        <span className="text-[#737373] font-medium text-sm">
          Билет №{ticketNumber}
        </span>
        <span className="font-bold text-[#4B4B4B] text-[16px]">
          {price} <span className="underline">с</span>
        </span>
      </div>

      <div className="grid grid-cols-6 gap-2 mb-6">
        {numbers.map((num) => (
          <div
            key={num}
            className={cn(
              "flex items-center justify-center aspect-square rounded-md text-[13px] font-bold transition-colors cursor-pointer",
              selectedNumbers?.includes(num)
                ? "bg-[#FF7600] text-white shadow-sm"
                : "bg-[#F9F9F9] text-[#4B4B4B] hover:bg-gray-200",
            )}
          >
            {num}
          </div>
        ))}
      </div>

      <Button
        onClick={onToggle}
        className={cn(
          "w-full py-3.5 rounded-2xl text-[13px] shadow-sm",
          isInBasket
            ? "bg-[#4B4B4B] text-white hover:bg-gray-800"
            : "bg-[#FF7600] text-white hover:bg-[#E56A00]", // 🔥 Единый дефолтный цвет кнопок
        )}
      >
        {isInBasket ? "Убрать из корзины" : `Добавить • ${price} с`}
      </Button>
    </div>
  );
};
