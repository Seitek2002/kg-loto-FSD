import { cn } from "@/shared/lib/utils";

import { Button } from "./Button";

interface TicketCardProps {
  ticketNumber: number | string;
  price: number;
  selectedNumbers: number[];
  isOrangeButton: boolean;
  isInBasket: boolean;
  onToggle: () => void;
}

export const DrawTicketCard  = ({
  ticketNumber,
  price,
  selectedNumbers,
  isOrangeButton,
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
      <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#F5F5F5] rounded-full border-r border-gray-100" />
      <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#F5F5F5] rounded-full border-l border-gray-100" />

      <div className="flex justify-between items-center border-b border-dashed border-gray-300 pb-4 mb-4">
        <span className="text-gray-400 font-medium text-sm">
          Билет №{ticketNumber}
        </span>
        <span className="font-bold text-[#4B4B4B] text-[15px]">
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
                ? "bg-[#F58220] text-white shadow-sm"
                : "bg-[#F5F5F5] text-[#4B4B4B] hover:bg-gray-200",
            )}
          >
            {num}
          </div>
        ))}
      </div>

      <Button
        onClick={onToggle}
        className={cn(
          "w-full py-3.5 shadow-sm",
          isInBasket
            ? "bg-[#4B4B4B] text-white"
            : isOrangeButton
              ? "bg-[#F58220] text-white"
              : "bg-[#FFD600] text-[#4B4B4B]",
        )}
      >
        {isInBasket ? "Убрать" : `Играть • ${price} с`}
      </Button>
    </div>
  );
};
