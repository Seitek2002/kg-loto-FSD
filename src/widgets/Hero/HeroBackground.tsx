import Image from 'next/image';
import { clsx } from 'clsx';
import { SliderItem } from '@/entities/slider/types';

interface HeroBackgroundProps {
  slides: SliderItem[];
  activeIndex: number;
}

export const HeroBackground = ({
  slides,
  activeIndex,
}: HeroBackgroundProps) => {
  return (
    <div className='absolute inset-0 z-0 pointer-events-none'>
      <Image
        src='/images/hero/main-bg.png'
        alt='Default Background'
        fill
        sizes='100vw'
        className='object-cover opacity-80'
        priority
        unoptimized
      />

      {slides.map((slide, index) => {
        if (!slide.backgroundImage) return null;

        return (
          <Image
            key={`bg-${slide.id}`}
            src={slide.backgroundImage}
            alt={`Background ${slide.id}`}
            fill
            sizes='100vw'
            className={clsx(
              'object-cover transition-opacity duration-700 ease-in-out',
              activeIndex === index ? 'opacity-100' : 'opacity-0',
            )}
            priority={index === 0}
            unoptimized
          />
        );
      })}
      <div className='absolute inset-0 bg-black/30 z-10' />
    </div>
  );
};
