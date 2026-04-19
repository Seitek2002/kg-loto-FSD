"use client";

import { useRef, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { useMounted } from "@/hooks/useMounted";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, ChevronRight, ImageIcon, Pencil } from "lucide-react";

import { useAuthStore } from "@/shared/model/auth";

const PROFILE_MENU = [
  { label: "Проверить билет", href: "/#check" },
  { label: "Тиражные билеты", href: "/tickets" },
  { label: "Язык", href: "/language" },
  { label: "Победители", href: "/winners" },
  { label: "О компании", href: "/about" },
  { label: "Контакты", href: "/contacts" },
  { label: "Новости", href: "/news" },
  { label: "Условия использования", href: "/terms" },
  { label: "FAQ", href: "/#faq" },
];

export const ProfileClient = () => {
  const mounted = useMounted();
  const user = useAuthStore((state) => state.user);

  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!mounted) return null;

  // 🔥 Безопасное отображение телефона (даже если он пришел как объект)
  const displayPhone = () => {
    if (!user?.phone) return user?.kglotteryProfile?.email || "";

    // Если телефон — это объект { dialCode, number, ... }
    if (typeof user.phone === "object" && user.phone !== null) {
      const phoneObj = user.phone as any;
      return `${phoneObj.dialCode || ""} ${phoneObj.number || ""}`.trim();
    }

    // Если телефон — обычная строка
    return String(user.phone);
  };

  const handleAvatarClick = () => {
    // 🔥 Проверяем ОС прямо в момент клика. Не нужен стейт и useEffect!
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isAppleDevice = /iphone|ipad|ipod|macintosh/.test(userAgent);

    if (isAppleDevice) {
      fileInputRef.current?.removeAttribute("capture");
      fileInputRef.current?.click();
    } else {
      setIsAvatarModalOpen(true);
    }
  };

  const openCamera = () => {
    setIsAvatarModalOpen(false);
    setTimeout(() => {
      fileInputRef.current?.setAttribute("capture", "environment");
      fileInputRef.current?.click();
    }, 200);
  };

  const openGallery = () => {
    setIsAvatarModalOpen(false);
    setTimeout(() => {
      fileInputRef.current?.removeAttribute("capture");
      fileInputRef.current?.click();
    }, 200);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("Выбран файл:", file.name);
    }
  };

  return (
    <div className="flex flex-col items-center pt-8">
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="flex flex-col items-center mb-8 px-4">
        <div
          className="relative w-30 h-30 mb-4 cursor-pointer active:scale-95 transition-transform"
          onClick={handleAvatarClick}
        >
          <div className="w-full h-full rounded-full overflow-hidden border-2 border-gray-200 bg-gray-200 relative">
            <Image
              src="/images/mock-avatar.jpg" // Убедись, что картинка есть в public/images/
              alt="Аватар"
              fill
              unoptimized
              className="object-cover"
            />
          </div>

          <div className="absolute bottom-0 right-2 w-8 h-8 bg-[#FF7600] rounded-full border-[3px] border-[#F5F5F5] flex items-center justify-center shadow-sm">
            <Pencil size={14} className="text-white" fill="currentColor" />
          </div>
        </div>

        <h1 className="text-[22px] sm:text-[26px] font-black text-[#4B4B4B] mb-1">
          {user?.name || "Игрок"}
        </h1>
        <p className="text-[14px] text-[#737373] font-medium">
          {displayPhone()}
        </p>
      </div>

      <div className="w-full bg-white rounded-t-4xl sm:rounded-[40px] px-6 sm:px-8 py-6 shadow-sm min-h-[50vh]">
        <div className="flex flex-col">
          {PROFILE_MENU.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="flex items-center justify-between py-5 border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors active:opacity-70"
            >
              <span className="text-[13px] sm:text-[15px] font-bold text-[#4B4B4B] uppercase tracking-wide">
                {item.label}
              </span>
              <ChevronRight size={20} className="text-[#A3A3A3]" />
            </Link>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {isAvatarModalOpen && (
          <div className="fixed inset-0 z-100 flex flex-col justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsAvatarModalOpen(false)}
            />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              drag="y"
              dragConstraints={{ top: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.y > 100 || info.velocity.y > 500) {
                  setIsAvatarModalOpen(false);
                }
              }}
              className="relative w-full bg-white rounded-t-4xl px-6 pb-12 pt-4 shadow-2xl z-10 touch-none"
            >
              <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-8 cursor-grab active:cursor-grabbing" />

              <div className="flex gap-4">
                <button
                  onClick={openCamera}
                  className="flex-1 flex flex-col items-center justify-center gap-3 border border-gray-200 rounded-[20px] py-6 active:scale-95 transition-transform hover:bg-gray-50"
                >
                  <Camera
                    size={32}
                    className="text-[#4B4B4B]"
                    strokeWidth={1.5}
                  />
                  <span className="text-[13px] font-bold text-[#4B4B4B]">
                    Открыть камеру
                  </span>
                </button>

                <button
                  onClick={openGallery}
                  className="flex-1 flex flex-col items-center justify-center gap-3 border border-gray-200 rounded-[20px] py-6 active:scale-95 transition-transform hover:bg-gray-50"
                >
                  <ImageIcon
                    size={32}
                    className="text-[#4B4B4B]"
                    strokeWidth={1.5}
                  />
                  <span className="text-[13px] font-bold text-[#4B4B4B]">
                    Выбрать из галереи
                  </span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
