'use client';

import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useMemo } from 'react';

interface AnimatedPrizeTextProps {
  text: string;
  isActive?: boolean;
}

export const AnimatedPrizeText = ({
  text,
  isActive = true,
}: AnimatedPrizeTextProps) => {
  const parsed = useMemo(() => {
    const match = text.match(/^(.*?)((?:\d\s*)+)(.*)$/);

    if (match) {
      const rawNumberStr = match[2];
      const cleanNumber = parseInt(rawNumberStr.replace(/\s/g, ''), 10);

      const hasCurrency = /(сом|с)(?:\s|$|\.)/i.test(text);
      const isLargeNumber = cleanNumber >= 1000;

      if (
        !isNaN(cleanNumber) &&
        cleanNumber > 0 &&
        (hasCurrency || isLargeNumber)
      ) {
        return {
          prefix: match[1],
          number: cleanNumber,
          suffix: match[3],
        };
      }
    }

    return null;
  }, [text]);

  const count = useMotionValue(0);

  const rounded = useTransform(count, (latest) =>
    Math.round(latest).toLocaleString('ru-RU'),
  );

  useEffect(() => {
    if (parsed?.number && isActive) {
      count.set(0);
      const controls = animate(count, parsed.number, {
        duration: 2,
        ease: 'easeOut',
      });
      return controls.stop;
    }
  }, [parsed?.number, isActive, count]);

  if (!parsed || parsed.number === null) {
    return <span>{text}</span>;
  }

  return (
    <span className='inline-flex items-baseline'>
      {parsed.prefix && <span>{parsed.prefix}</span>}

      <span className='relative inline-flex items-center justify-center'>
        <span className='opacity-0 pointer-events-none select-none tabular-nums'>
          {parsed.number.toLocaleString('ru-RU')}
        </span>

        <motion.span className='absolute inset-0 flex items-center justify-center tabular-nums'>
          {isActive ? rounded : parsed.number.toLocaleString('ru-RU')}
        </motion.span>
      </span>

      {parsed.suffix && <span className='ml-2'>{parsed.suffix}</span>}
    </span>
  );
};
