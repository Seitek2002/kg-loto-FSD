"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { ChevronLeft, Wallet } from "lucide-react";

import { useBalance } from "@/entities/finance/api";

import { cn } from "@/shared/lib/utils";
import { useAuthStore } from "@/shared/model/auth";

// 🔥 Расширяем глобальный объект Window, чтобы TypeScript перестал ругаться
declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }
}

export const HeaderWidget = ({ className }: { className?: string }) => {
  const router = useRouter();
  const pathname = usePathname();

  useBalance();

  const user = useAuthStore((state) => state.user);
  const balance = user?.balance || "0";

  const handleBackClick = () => {
    if (pathname === "/") {
      // 1. Попытка закрыть стандартным методом браузера
      window.close();

      // 2. Теперь TypeScript знает про ReactNativeWebView и не будет выдавать ошибку
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage("closeWebView");
      }
    } else {
      router.back();
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full bg-[#F5F5F5]/90 backdrop-blur-md px-4 py-3 flex items-center justify-between",
        className,
      )}
    >
      <button
        onClick={handleBackClick}
        className="p-2 -ml-2 text-[#4B4B4B] active:scale-90 transition-transform rounded-full"
      >
        <ChevronLeft size={28} strokeWidth={2.5} />
      </button>

      <div className="absolute left-1/2 -translate-x-1/2">
        <Image
          src="/logo.png"
          alt="KGLOTO.COM"
          width={110}
          height={32}
          className="object-contain"
          priority
          unoptimized
        />
      </div>

      <Link href={"/wallet"} className="flex items-center gap-1.5 px-2 py-1">
        <Wallet size={20} className="text-[#4B4B4B]" strokeWidth={2} />
        <span className="font-benzin font-black text-[#FF8A00] text-sm md:text-base">
          {+balance} <span className="underline underline-offset-2">с</span>
        </span>
      </Link>
    </header>
  );
};
