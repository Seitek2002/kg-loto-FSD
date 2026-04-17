import { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

export const Description = ({ children, className }: { children: string | ReactNode; className?: string }) => {
  return (
    <p className={cn('text-xs lg:text-xl lg:max-w-[70%] text-[#6E6E6E] my-3', className)}>
      {children}
    </p>
  );
};