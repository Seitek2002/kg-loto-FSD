"use client";

import { useRouter } from "next/navigation";

import { Check, Loader2 } from "lucide-react";

import { useTransactions } from "@/entities/finance/api";

import { Button } from "@/shared/ui/Button";

export const PaymentSuccessClient = () => {
  const router = useRouter();

  // 🔥 Запрашиваем историю транзакций
  const { data: transactions = [], isLoading } = useTransactions();

  // Ищем самую последнюю успешную транзакцию пополнения (не списание)
  // Предполагаем, что массив отсортирован бэкендом (сначала новые).
  // Если бэкенд не сортирует, добавь `.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())`
  const lastTopUp = transactions.find(
    (tx) =>
      !tx.amount.toString().startsWith("-") && // Только пополнения (положительные числа)
      (tx.paymentStatus.toLowerCase() === "success" ||
        tx.paymentStatus.toLowerCase() === "completed" ||
        tx.paymentStatus.toLowerCase().includes("оплачено")), // Только успешные
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center mt-20 md:mt-32">
        <Loader2 className="animate-spin text-[#F58220] w-12 h-12 mb-4" />
        <p className="text-gray-500 font-medium">Проверяем статус платежа...</p>
      </div>
    );
  }

  // Если вдруг успешных транзакций вообще нет (или юзер зашел сюда случайно)
  if (!lastTopUp) {
    return (
      <div className="flex flex-col items-center mt-20 md:mt-32 text-center">
        <h1 className="text-[20px] md:text-[28px] font-black font-benzin uppercase text-[#4B4B4B] mb-4">
          Информация не найдена
        </h1>
        <p className="text-gray-500 mb-8 max-w-sm">
          Мы не нашли недавних успешных пополнений на вашем аккаунте.
        </p>
        <Button
          onClick={() => router.push("/wallet")}
          className="w-full max-w-62.5 bg-[#4B4B4B]"
        >
          В кошелек
        </Button>
      </div>
    );
  }

  // Очищаем сумму от минусов (на всякий случай) и лишних пробелов
  const displayAmount = lastTopUp.amount.toString().replace("-", "").trim();

  return (
    <div className="flex flex-col items-center mt-10 md:mt-16 animate-in fade-in zoom-in-95 duration-500">
      {/* Иконка успеха */}
      <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-[#1FAF38] flex items-center justify-center mb-6 md:mb-8 shadow-sm">
        <Check
          className="text-[#1FAF38] w-12 h-12 md:w-16 md:h-16"
          strokeWidth={3}
        />
      </div>

      {/* Заголовок */}
      <h1 className="text-[20px] md:text-[32px] font-black font-benzin uppercase text-[#4B4B4B] mb-8 md:mb-12 text-center leading-tight">
        Ваш баланс успешно <br className="md:hidden" /> пополнен!
      </h1>

      {/* Белая карточка с деталями */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12 flex flex-col items-center w-full max-w-125">
        <span className="text-[#737373] font-medium text-[14px] md:text-[16px] mb-2 font-rubik">
          Сумма пополнения
        </span>

        <div className="text-[48px] md:text-[64px] font-black text-[#4B4B4B] mb-8 leading-none tracking-tight">
          {displayAmount}{" "}
          <span className="text-[32px] md:text-[48px] underline decoration-2 underline-offset-4">
            с
          </span>
        </div>

        {/* Кнопки: на мобилке друг под другом, на ПК в ряд */}
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <Button
            onClick={() => router.push("/wallet")}
            className="flex-1 bg-[#F58220] hover:bg-[#E57210] text-white py-4 sm:py-5 rounded-full font-bold font-rubik text-[15px] md:text-[16px] shadow-md"
          >
            Пополнить еще
          </Button>

          <Button
            onClick={() => router.push("/")}
            className="flex-1 bg-[#4B4B4B] hover:bg-[#3A3A3A] text-white py-4 sm:py-5 rounded-full font-bold font-rubik text-[15px] md:text-[16px] shadow-md"
          >
            Вернуться
          </Button>
        </div>
      </div>
    </div>
  );
};
