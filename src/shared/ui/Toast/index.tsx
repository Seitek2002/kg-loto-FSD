"use client";

import { useEffect } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";

import { useToastStore } from "./toastStore";

const AUTO_DISMISS_MS = 4000;

const ToastItem = ({ id, message }: { id: number; message: string }) => {
  const removeToast = useToastStore((s) => s.removeToast);

  useEffect(() => {
    const timer = setTimeout(() => removeToast(id), AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [id, removeToast]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className="flex items-center gap-3 bg-white shadow-lg border border-gray-100 rounded-2xl px-4 py-3.5 pointer-events-auto w-full max-w-90"
    >
      <div className="w-8 h-8 rounded-full bg-green-50 text-green-500 flex items-center justify-center shrink-0">
        <CheckCircle2 size={20} />
      </div>
      <span className="text-[#4B4B4B] text-[14px] font-bold flex-1">
        {message}
      </span>
      <button
        onClick={() => removeToast(id)}
        className="text-gray-400 hover:text-[#4B4B4B] transition-colors shrink-0"
      >
        <X size={18} />
      </button>
    </motion.div>
  );
};

export const ToastContainer = () => {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-9999 flex flex-col items-center gap-2 pointer-events-none px-4 w-full sm:w-auto">
      <AnimatePresence>
        {toasts.map((t) => (
          <ToastItem key={t.id} id={t.id} message={t.message} />
        ))}
      </AnimatePresence>
    </div>
  );
};
