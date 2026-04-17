import { Metadata } from "next";

import { CartClient } from "./CartClient";

export const metadata: Metadata = {
  title: "KGLOTO | Корзина",
  description: "Оформление билетов",
};

export default function CartPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F5] font-rubik pb-32 md:pb-16 select-none">
      <div className="max-w-360 mx-auto px-4 pt-6 md:pt-10">
        {/* Хлебные крошки */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div className="flex flex-wrap items-center gap-2 text-[12px] md:text-[14px] text-[#737373] font-medium">
            <span className="hover:text-[#4B4B4B] transition-colors">
              Главная
            </span>
            <span>/</span>
            <span className="font-bold text-[#4B4B4B]">Корзина</span>
          </div>
        </div>

        {/* Клиентская логика */}
        <CartClient />
      </div>
    </div>
  );
}
