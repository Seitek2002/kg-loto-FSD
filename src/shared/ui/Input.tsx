import { InputHTMLAttributes, forwardRef, ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  wrapperClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { error, iconLeft, iconRight, className, wrapperClassName, disabled, ...props },
    ref
  ) => {
    return (
      <div className={cn("flex flex-col gap-1 w-full", wrapperClassName)}>
        <div
          className={cn(
            "relative flex items-center w-full rounded-[10px] border border-[#E5E5E5] bg-white transition-all duration-200",
            // Отступы из Фигмы
            "px-6.5 py-5 gap-2.5",
            // Стили фокуса из Фигмы (тень и бордер #5C73F1)
            "focus-within:border-[#5C73F1] focus-within:shadow-[0_0_12px_0_rgba(92,115,241,0.5)]",
            // Стили ошибки
            error && "border-[#FF4D4F] focus-within:border-[#FF4D4F] focus-within:shadow-[0_0_12px_0_rgba(255,77,79,0.5)]",
            disabled && "opacity-60 bg-gray-50 cursor-not-allowed"
          )}
        >
          {iconLeft && (
            <div className="shrink-0 text-gray-400 flex items-center justify-center">
              {iconLeft}
            </div>
          )}

          <input
            ref={ref}
            disabled={disabled}
            className={cn(
              "flex-1 bg-transparent border-none outline-none text-[#1E1E1E] placeholder:text-gray-400",
              "font-rubik text-base",
              // Убираем артефакты WebKit для инпутов
              "w-full",
              className
            )}
            {...props}
          />

          {iconRight && (
            <div className="shrink-0 text-gray-400 flex items-center justify-center">
              {iconRight}
            </div>
          )}
        </div>

        {/* Вспомогательный текст / Ошибка */}
        {error && (
          <span className="text-sm text-[#FF4D4F] font-rubik px-1">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";