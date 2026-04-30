"use client";

import { useEffect, useRef, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { useMounted } from "@/hooks/useMounted";
import { AnimatePresence, motion } from "framer-motion";
import {
  Camera,
  Check,
  ChevronRight,
  ImageIcon,
  Pencil,
  X,
} from "lucide-react";

import { useProfile, useUpdateProfile } from "@/entities/profile/api";

import { useAuthStore } from "@/shared/model/auth";

const PROFILE_MENU = [
  { label: "Проверить билет", href: "/#check" },
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

  useProfile();

  // 🔥 Вытаскиваем нашу мутацию
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();

  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 🔥 Стейты для загрузки нового аватара
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Очистка памяти от URL.createObjectURL при размонтировании
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  if (!mounted) return null;

  const displayPhone = () => {
    if (!user?.phone) return user?.email || "";
    if (typeof user.phone === "object" && user.phone !== null) {
      const phoneObj = user.phone;
      return `${phoneObj.dialCode || ""} ${phoneObj.number || ""}`.trim();
    }
    return String(user.phone);
  };

  const fullName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.email ||
    "Игрок";
  const initial = user?.firstName
    ? user.firstName.charAt(0).toUpperCase()
    : "И";

  const handleAvatarClick = () => {
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

  // 🔥 Обработчик выбора файла
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Проверяем, что это картинка
      if (!file.type.startsWith("image/")) {
        alert("Пожалуйста, выберите изображение.");
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setIsAvatarModalOpen(false); // Закрываем модалку, если она открыта
    }
  };

  // 🔥 Обработчик сохранения аватара
  const handleSaveAvatar = () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("avatar", selectedFile); // Ключ avatar, как указано в Swagger

    updateProfile(formData, {
      onSuccess: () => {
        // При успехе сбрасываем локальные стейты выбора (Zustand уже обновлен)
        setSelectedFile(null);
        setPreviewUrl(null);
      },
      onError: (error) => {
        console.error("Ошибка при обновлении аватара:", error);
        alert("Не удалось обновить аватар.");
      },
    });
  };

  // 🔥 Обработчик отмены выбора
  const handleCancelSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = ""; // Очищаем input
  };

  // Определяем, что показывать: превью, аватар с бэка или букву
  const currentAvatarSrc = previewUrl || user?.avatar;

  return (
    <div className="flex flex-col items-center pt-8">
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="flex flex-col items-center mb-8 px-4 w-full">
        <div
          className={`relative w-30 h-30 mb-4 transition-transform ${!selectedFile ? "cursor-pointer active:scale-95" : ""}`}
          onClick={!selectedFile ? handleAvatarClick : undefined}
        >
          {currentAvatarSrc ? (
            <div className="w-full h-full rounded-full overflow-hidden border-2 border-gray-200 bg-gray-200 relative">
              <Image
                src={currentAvatarSrc}
                alt={fullName}
                fill
                unoptimized
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-full h-full rounded-full overflow-hidden border-2 border-[#FF7600]/20 bg-[#F5F5F5] flex items-center justify-center relative shadow-sm">
              <span className="text-4xl font-black text-[#4B4B4B] font-benzin">
                {initial}
              </span>
            </div>
          )}

          {/* Иконка карандаша (скрываем, если файл выбран и ждет сохранения) */}
          {!selectedFile && (
            <div className="absolute bottom-0 right-2 w-8 h-8 bg-[#FF7600] rounded-full border-[3px] border-[#F5F5F5] flex items-center justify-center shadow-sm">
              <Pencil size={14} className="text-white" fill="currentColor" />
            </div>
          )}
        </div>

        {/* 🔥 Кнопки сохранения и отмены (появляются только после выбора фото) */}
        {selectedFile && (
          <div className="flex items-center gap-3 mb-4 animate-in fade-in zoom-in duration-200">
            <button
              onClick={handleSaveAvatar}
              disabled={isUpdating}
              className="flex items-center gap-2 bg-[#FF7600] text-white px-5 py-2.5 rounded-full font-bold text-[13px] active:scale-95 transition-all shadow-md disabled:opacity-50"
            >
              {isUpdating ? (
                <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
              ) : (
                <Check size={16} strokeWidth={2.5} />
              )}
              {isUpdating ? "Сохранение..." : "Сохранить"}
            </button>
            <button
              onClick={handleCancelSelection}
              disabled={isUpdating}
              className="flex items-center justify-center w-10 h-10 bg-gray-200 text-gray-600 rounded-full active:scale-95 transition-all disabled:opacity-50"
            >
              <X size={18} strokeWidth={2.5} />
            </button>
          </div>
        )}

        <h1 className="text-[22px] sm:text-[26px] font-black text-[#4B4B4B] mb-1">
          {fullName}
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
            {/* ... Модалка с кнопками Камера / Галерея (остается без изменений) ... */}
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
