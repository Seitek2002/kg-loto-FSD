"use client";

import { ReactNode, useEffect, useState } from "react";

import Image from "next/image";

import { useMounted } from "@/hooks/useMounted";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import { useTopUp } from "@/entities/finance/api";

import { Button } from "@/shared/ui/Button";
import { ErrorModal } from "@/shared/ui/ErrorModal";

interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  initialAmount?: number | string;
}

export const TopUpModal = ({
  isOpen,
  onClose,
  title,
  description,
  initialAmount,
}: TopUpModalProps) => {
  const mounted = useMounted();
  const [amount, setAmount] = useState("");
  const [isErrorOpen, setIsErrorOpen] = useState(false);

  // 🔥 Создаем стейт для отслеживания предыдущего значения isOpen
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  // 🔥 Best Practice от React: обновляем стейт прямо во время рендера,
  // избегая каскадных обновлений через useEffect
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setAmount(initialAmount ? String(initialAmount) : "");
    }
  }

  const { mutate: createPaylink, isPending } = useTopUp();

  useEffect(() => {
    if (isOpen && !isErrorOpen) document.body.style.overflow = "hidden";
    else if (!isOpen && !isErrorOpen) document.body.style.overflow = "unset";
  }, [isOpen, isErrorOpen]);

  if (!mounted) return null;

  const handleClose = () => {
    onClose();
    setTimeout(() => setAmount(""), 200);
  };

  const handleTopUp = () => {
    const numAmount = Number(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) return;

    createPaylink(amount, {
      onSuccess: (data) => {
        if (data.paylinkUrl) {
          window.location.href = data.paylinkUrl;
        }
      },
      onError: (error) => {
        console.error("Ошибка пополнения:", error);
        setIsErrorOpen(true);
      },
    });
  };

  const isFormValid = amount.trim() !== "" && Number(amount) > 0;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm z-0"
              onClick={handleClose}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-md bg-[#F5F5F7] rounded-3xl p-6 lg:p-10 shadow-2xl z-10"
            >
              <button
                onClick={handleClose}
                className="absolute top-6 right-6 text-gray-400 hover:text-[#4B4B4B] transition-colors active:scale-90"
              >
                <X size={24} strokeWidth={2} />
              </button>

              {/* 🔥 Кастомный заголовок (если есть) или дефолтный */}
              <h2 className="text-[20px] lg:text-[24px] font-black text-[#4B4B4B] uppercase leading-tight mb-2">
                {title || "Пополнение баланса"}
              </h2>

              {/* 🔥 Кастомное описание (если есть) или дефолтное */}
              <div className="text-[#8C8C8C] text-[11px] lg:text-[13px] mb-6 lg:mb-8 font-medium leading-relaxed">
                {description ||
                  "Деньги поступят на счет моментально после оплаты"}
              </div>

              <div className="flex flex-col gap-2 mb-6">
                <label className="text-[13px] font-bold text-[#4B4B4B] ml-1">
                  Сумма пополнения (сом)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Например: 100"
                  min="1"
                  className="w-full bg-white rounded-2xl px-5 py-4 text-[16px] font-bold text-[#4B4B4B] outline-none border-2 border-transparent focus:border-[#FFD600] transition-all shadow-sm placeholder:text-gray-300"
                />
              </div>

              <div className="flex flex-col gap-3 mb-6">
                <div className="bg-white rounded-[20px] p-4 border border-gray-100 shadow-sm">
                  <div className="text-[12px] font-bold text-[#4B4B4B] mb-3 opacity-60 uppercase tracking-tight">
                    Доступные способы:
                  </div>
                  <div className="flex flex-wrap items-center gap-4 mb-4 pb-4 border-b border-gray-50">
                    {["mbank", "o-bank", "bakai", "optima", "elkart"].map(
                      (bank) => (
                        <Image
                          key={bank}
                          src={`/banks-logo/${bank}.png`}
                          alt={bank}
                          width={24}
                          height={24}
                          className="grayscale-[0.5]"
                          unoptimized
                        />
                      ),
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-[#1A1F71] font-black italic text-lg tracking-tighter">
                      VISA
                    </div>
                    <div className="text-[#4B4B4B] text-[13px] font-bold">
                      / Mastercard
                    </div>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleTopUp}
                disabled={!isFormValid || isPending}
                isLoading={isPending}
                className={
                  isFormValid
                    ? "w-full bg-[#FFD600] text-[#4B4B4B]"
                    : "w-full bg-gray-200 text-gray-400 cursor-not-allowed"
                }
              >
                Перейти к оплате
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ErrorModal isOpen={isErrorOpen} onClose={() => setIsErrorOpen(false)} />
    </>
  );
};
