"use client";

import { useState } from "react";

import { CheckTicketModal } from "@/features/check-ticket/ui/CheckTicketModal";

import { Button } from "@/shared/ui/Button";
import { Description } from "@/shared/ui/Description";
import { Input } from "@/shared/ui/Input";
import { Title } from "@/shared/ui/Title";

export const CheckLotteryWidget = ({
  title,
  description,
}: {
  title?: string;
  description?: string;
}) => {
  const [ticketNumber, setTicketNumber] = useState("");
  const [isCheckModalOpen, setIsCheckModalOpen] = useState(false);

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketNumber.trim()) return;
    setIsCheckModalOpen(true);
  };

  return (
    <section className="my-12 lg:my-25" id="check">
      <Title>{title || "Проверка билета"}</Title>
      <Description>
        {description || "Узнайте, выиграли ли вы приз!"}
      </Description>

      <form
        onSubmit={handleCheck}
        className="flex flex-col lg:flex-row gap-6 lg:items-end lg:mt-10"
      >
        <div className="flex flex-col gap-2 lg:w-1/2">
          <label
            htmlFor="draw-number"
            className="text-xs lg:text-xl font-bold text-gray-900 font-rubik uppercase px-1"
          >
            Номер билета
          </label>
          <Input
            id="draw-number"
            value={ticketNumber}
            onChange={(e) => setTicketNumber(e.target.value)}
            placeholder="Например: YT2357912"
          />
        </div>

        <div className="w-full lg:w-1/2 mt-2 lg:mt-0">
          <Button
            type="submit"
            disabled={!ticketNumber.trim()}
            className="h-15.5 lg:h-auto py-5"
          >
            Проверить
          </Button>
        </div>
      </form>

      <CheckTicketModal
        isOpen={isCheckModalOpen}
        onClose={() => setIsCheckModalOpen(false)}
        initialCode={ticketNumber}
      />
    </section>
  );
};
