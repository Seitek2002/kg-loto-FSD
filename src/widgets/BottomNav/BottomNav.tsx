"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { useMounted } from "@/hooks/useMounted";
import { ShoppingCart, Star, Ticket, User } from "lucide-react";

import { useCartStore } from "@/entities/cart/model";

import { cn } from "@/shared/lib/utils";

// import { useAuthStore } from '@/shared/model/auth';

const navItems = [
  { label: "Лотереи", href: "/", icon: Star, protected: false },
  { label: "Билеты", href: "/tickets", icon: Ticket, protected: true },
  { label: "Корзина", href: "/cart", icon: ShoppingCart, protected: false },
  { label: "Профиль", href: "/profile", icon: User, protected: true },
];

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const mounted = useMounted();

  const cartItemsCount = useCartStore((state) => state.items.length);

  // const { isAuth } = useAuthStore();
  const isAuth = true;

  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const checkIsIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    const timer = setTimeout(() => {
      if (checkIsIOS) setIsIOS(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleProtectedClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    isProtected: boolean,
  ) => {
    if (isProtected && !isAuth) {
      e.preventDefault();
      router.push("/login");
    }
  };

  return (
    <div className="fixed bottom-6 left-4 right-4 z-50 flex lg:hidden justify-center items-center pointer-events-none">
      <nav
        className={cn(
          "w-full max-w-100 pointer-events-auto border border-gray-100/50 rounded-[40px] shadow-2xl shadow-gray-200/50 p-2 flex justify-between items-center",
          isIOS ? "backdrop-blur-xl bg-white/70" : "glass bg-white/80",
        )}
      >
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={(e) => handleProtectedClick(e, item.protected)}
              className={cn(
                "flex flex-col items-center flex-1 py-2 rounded-[30px] transition-all duration-200 active:scale-95",
                isActive
                  ? "text-[#2F73F6] bg-[#EBEBEB]"
                  : "text-[#5B5B5B] bg-transparent hover:bg-gray-50",
              )}
            >
              <div className="relative mb-1">
                <item.icon
                  size={22}
                  fill={isActive ? "currentColor" : "none"}
                  strokeWidth={isActive ? 2 : 2.5}
                  className="shrink-0"
                />

                {mounted && item.href === "/cart" && cartItemsCount > 0 && (
                  <div className="absolute top-0 -right-2 bg-[#FF7600] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-sm border-[1.5px] border-white">
                    {cartItemsCount > 99 ? "99+" : cartItemsCount}
                  </div>
                )}
              </div>

              <span className="text-[11px] font-bold font-rubik leading-none">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
