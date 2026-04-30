import { Suspense } from "react";

import Link from "next/link";

import { Loader2 } from "lucide-react";

import { PaymentSuccessClient } from "@/features/payment/ui/PaymentSuccessClient";

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-[#F9F9F9] font-rubik pb-20">
      <div className="max-w-250 mx-auto px-4 pt-6 md:pt-10">
        {/* Хлебные крошки */}
        <nav className="flex items-center gap-2 text-[12px] md:text-[14px] font-medium text-[#737373] mb-6">
          <Link href="/" className="hover:text-[#4B4B4B] transition-colors">
            Главная
          </Link>
          <span>/</span>
          <Link
            href="/tickets"
            className="hover:text-[#4B4B4B] transition-colors"
          >
            Тиражные лотереи
          </Link>
          <span>/</span>
          <Link
            href="/wallet"
            className="hover:text-[#4B4B4B] transition-colors"
          >
            Кошелек
          </Link>
        </nav>

        {/* Обертка Suspense обязательна для useSearchParams */}
        <Suspense
          fallback={
            <div className="flex items-center justify-center mt-20">
              <Loader2 className="animate-spin text-[#F58220] w-12 h-12" />
            </div>
          }
        >
          <PaymentSuccessClient />
        </Suspense>
      </div>
    </div>
  );
}
