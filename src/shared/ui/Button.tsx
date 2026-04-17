import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";
import { cn } from "@/shared/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  isLoading?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      isLoading,
      iconLeft,
      iconRight,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          // Базовые стили WebView (плавность и scale)
          "relative flex items-center justify-center gap-2.5 w-full select-none",
          "transition-all duration-100 active:scale-95",
          "disabled:opacity-50 disabled:active:scale-100 disabled:cursor-not-allowed",
          // Стили из Figma
          "px-4 py-2.5 rounded-full font-medium font-benzin",
          // Варианты
          {
            "bg-[#4B4B4B] text-white": variant === "primary",
            "bg-[#F5F5F5] text-[#1E1E1E]": variant === "secondary",
            "border border-[#4B4B4B] bg-transparent text-[#4B4B4B]": variant === "outline",
            "bg-transparent text-[#4B4B4B]": variant === "ghost",
          },
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            {iconLeft && <span className="shrink-0">{iconLeft}</span>}
            <span>{children}</span>
            {iconRight && <span className="shrink-0">{iconRight}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";