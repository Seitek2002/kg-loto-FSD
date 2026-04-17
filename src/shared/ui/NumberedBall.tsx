import { useMemo } from "react";

import { cn } from "@/shared/lib/utils";

interface NumberedBallProps {
  number: number;
  size?: number;
  className?: string;
}

export const NumberedBall = ({
  number,
  size = 28,
  className,
}: NumberedBallProps) => {
  const fontSize = useMemo(() => `${size * 0.5}px`, [size]);

  return (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-full font-black text-white shrink-0 select-none overflow-hidden",
        "bg-[#00C304]",
        "shadow-[inset_0px_2px_4px_0px_#009A03]",
        className,
      )}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <span className="relative z-10" style={{ fontSize }}>
        {number}
      </span>
    </div>
  );
};
