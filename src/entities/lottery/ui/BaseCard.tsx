'use client';

import Image from 'next/image';
import { ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';
import dynamic from 'next/dynamic';
import { BACKGROUND_VARIANTS } from '@/shared/config/lottery-styles';

const LottiePlayer = dynamic(() => import('@lottiefiles/react-lottie-player').then((mod) => mod.Player), { ssr: false });

interface BaseCardProps {
  children: ReactNode;
  backgroundId?: string;
  imageSrc?: string;
  lottieSrc?: string;
  className?: string;
  aspectRatio?: string;
  theme?: 'dark' | 'white' | string;
}

export const BaseCard = ({ children, backgroundId, imageSrc, lottieSrc, className, aspectRatio = '4/3', theme = 'dark' }: BaseCardProps) => {
  const textColor = theme === 'dark' ? 'text-[#4B4B4B]' : 'text-white';
  const bgPath = imageSrc ? imageSrc : backgroundId ? BACKGROUND_VARIANTS[backgroundId] || BACKGROUND_VARIANTS['default'] : null;

  return (
    <div className={cn('relative w-full rounded-3xl flex flex-col shadow-xl overflow-hidden', !bgPath && !lottieSrc && 'bg-transparent', textColor, className)} style={{ aspectRatio }}>
      {lottieSrc ? (
        <div className='absolute inset-0 z-0 overflow-hidden'>
          <LottiePlayer src={lottieSrc} loop autoplay renderer='svg' style={{ width: '100%', height: '100%' }} rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }} />
        </div>
      ) : (
        bgPath && <Image src={bgPath} alt='card background' fill unoptimized className='z-0 object-cover' priority sizes='(max-width: 768px) 100vw, 50vw' />
      )}
      {(bgPath || lottieSrc) && theme === 'white' && <div className='absolute inset-0 bg-black/10 z-0' />}
      <div className='relative z-10 flex flex-col flex-1 h-full p-3'>{children}</div>
    </div>
  );
};