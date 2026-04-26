"use client";

import { useState } from "react";

import Link from "next/link";

import { Loader2 } from "lucide-react";

import { TopUpModal } from "@/features/top-up/ui/TopUpModal";

// 🔥 Импортируем обновленный хук
import { useBalance, useTransactions } from "@/entities/finance/api";

import { cn } from "@/shared/lib/utils";
import { useAuthStore } from "@/shared/model/auth";
import { Button } from "@/shared/ui/Button";

// 🔥 Адаптировали статусы под ответ бэкенда ("Оплачено" и т.д.)
const getStatusProps = (status: string) => {
  const s = status.toLowerCase();
  if (s.includes("оплачено") || s === "completed") {
    return { text: status, classes: "bg-[#D1F5D3] text-[#1FAF38]" };
  }
  if (s.includes("ожидает") || s === "pending") {
    return { text: status, classes: "bg-[#F3F4F6] text-[#4B4B4B]" };
  }
  if (s.includes("отклонено") || s === "rejected") {
    return { text: status, classes: "bg-[#FFD7D7] text-[#FF4B4B]" };
  }
  return { text: status, classes: "bg-[#FFF0D4] text-[#F58220]" };
};

const getMethodName = (method: string) => {
  // Оставляем красивое отображение, если знаем метод, иначе как с бэка
  const knownMethods: Record<string, string> = {
    mbank: "MBank",
    visa: "VISA",
    elcart: "Элкарт",
    баланс: "С баланса",
  };
  return knownMethods[method.toLowerCase()] || method;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export default function WalletPage() {
  const user = useAuthStore((state) => state.user);
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);

  useBalance();

  // 🔥 Используем новый хук
  const { data: transactions = [], isLoading } = useTransactions();

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-rubik pb-20">
      <div className="max-w-[1000px] mx-auto px-4 pt-6">
        <nav className="flex items-center gap-2 text-[12px] font-medium text-[#737373] mb-6">
          <Link href="/" className="hover:text-[#4B4B4B] transition-colors">
            Главная
          </Link>
          <span>/</span>
          <Link
            href="/profile"
            className="hover:text-[#4B4B4B] transition-colors"
          >
            Профиль
          </Link>
          <span>/</span>
          <span className="text-[#4B4B4B] font-bold">Кошелек</span>
        </nav>

        {/* КАРТОЧКА БАЛАНСА */}
        <div className="bg-white rounded-[24px] lg:rounded-[32px] p-6 lg:p-10 shadow-sm border border-gray-100 mb-8">
          <h2 className="text-[14px] lg:text-[16px] font-bold text-[#4B4B4B] uppercase tracking-wide mb-2 lg:mb-4">
            Баланс
          </h2>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="text-[48px] lg:text-[64px] font-black text-[#4B4B4B] leading-none">
              {user?.balance || "0"}{" "}
              <span className="underline text-[36px] lg:text-[48px]">с</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <Button
                onClick={() => setIsTopUpModalOpen(true)}
                className="bg-[#F58220] hover:bg-[#E56A00] text-white py-4 px-8 text-[14px] rounded-full"
              >
                Пополнить
              </Button>
              <Button
                variant="outline"
                className="py-4 px-8 text-[14px] border-2 border-[#F58220] text-[#F58220] bg-transparent rounded-full hover:bg-orange-50"
              >
                Вывести
              </Button>
            </div>
          </div>
        </div>

        {/* ИСТОРИЯ */}
        <h3 className="text-[18px] lg:text-[20px] font-bold text-[#4B4B4B] mb-4">
          История транзакций
        </h3>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-[#F58220]" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="bg-white rounded-[24px] p-10 text-center text-gray-400 font-medium shadow-sm border border-gray-100">
            История операций пуста
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {transactions.map((tx, index) => {
              const status = getStatusProps(tx.paymentStatus);
              // Если нет уникального ID, используем дату + сумму + индекс как ключ
              const uniqueKey = `${tx.date}-${tx.amount}-${index}`;

              return (
                <div
                  key={uniqueKey}
                  className="bg-white rounded-[20px] p-4 shadow-sm border border-gray-100 flex flex-col gap-2"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[#4B4B4B] font-bold text-[16px]">
                      {tx.amount} <span className="underline">с</span>
                    </span>
                    <span
                      className={cn(
                        "px-3 py-1 rounded-full text-[11px] font-bold",
                        status.classes,
                      )}
                    >
                      {status.text}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-[#737373] font-medium text-[13px]">
                      Способ: {getMethodName(tx.paymentMethod)}
                    </span>
                    <span className="text-[#737373] text-[13px] font-medium">
                      {formatDate(tx.date)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <TopUpModal
        isOpen={isTopUpModalOpen}
        onClose={() => setIsTopUpModalOpen(false)}
      />
    </div>
  );
}
