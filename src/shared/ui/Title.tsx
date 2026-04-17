import { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

export const Title = ({ children, className }: { children: ReactNode; className?: string }) => {
  return (
    <h2 className={cn('text-base lg:text-2xl font-bold text-[#4B4B4B] font-benzin uppercase', className)}>
      {children}
    </h2>
  );
};