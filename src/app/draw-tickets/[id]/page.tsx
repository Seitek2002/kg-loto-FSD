import Link from "next/link";

import { LotteryClient } from "./LotteryClient";

interface PageProps {
  params: { id: string };
}

export default async function LotteryPage({ params }: PageProps) {
  // В Next.js 15+ params нужно сначала "awaited", если используешь их динамически
  // Но так как у нас static export, можно просто достать id
  const { id } = await params;

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-rubik pb-20">
      <div className="max-w-360 mx-auto px-4 pt-6">
        {/* ХЛЕБНЫЕ КРОШКИ */}
        <nav className="flex items-center gap-2 text-[12px] font-medium text-[#737373]">
          <Link href="/" className="hover:text-[#4B4B4B] transition-colors">
            Главная
          </Link>
          <span>/</span>
          <span className="text-[#4B4B4B] font-bold">Детали лотереи</span>
        </nav>

        {/* Клиентская логика с табами и покупкой */}
        <LotteryClient lotteryId={id} />
      </div>
    </div>
  );
}
