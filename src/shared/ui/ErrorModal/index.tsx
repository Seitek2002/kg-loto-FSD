"use client";

import { useEffect } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, X } from "lucide-react";

import { Button } from "@/shared/ui/Button";

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

export const ErrorModal = ({
  isOpen,
  onClose,
  title = "Упс! Что-то пошло не так",
  message = "Произошла непредвиденная ошибка. Пожалуйста, попробуйте позже.",
}: ErrorModalProps) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
        {/* Затемнение фона */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Сама карточка */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-sm bg-white rounded-3xl p-6 lg:p-8 shadow-2xl z-10 flex flex-col items-center text-center"
        >
          {/* Иконка ошибки */}
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4 text-red-500">
            <AlertCircle size={32} strokeWidth={2} />
          </div>

          <h2 className="text-[20px] font-black text-[#4B4B4B] uppercase leading-tight mb-2">
            {title}
          </h2>

          <p className="text-[#737373] text-[14px] font-medium mb-8 leading-relaxed">
            {message}
          </p>

          <Button
            onClick={onClose}
            className="w-full bg-[#F58220] hover:bg-[#E57210] text-white"
          >
            Понятно
          </Button>

          {/* Крестик в правом верхнем углу */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-[#4B4B4B] transition-colors active:scale-90"
          >
            <X size={24} strokeWidth={2} />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
