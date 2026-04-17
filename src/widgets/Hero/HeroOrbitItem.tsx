import { SliderItem } from '@/entities/slider/types';
import Image from 'next/image';

interface HeroOrbitItemProps {
  slide: SliderItem;
}

export const HeroOrbitItem = ({ slide }: HeroOrbitItemProps) => {
  return (
    <div className='flex flex-col items-center -translate-y-[180px] md:-translate-y-[420px]'>
      <div className='w-24 h-16 md:w-48 md:h-28 relative flex items-center justify-center'>
        {slide.logo ? (
          // Если есть логотип — выводим картинку
          <Image
            src={slide.logo}
            fill
            sizes='(max-width: 768px) 96px, 192px'
            className='object-contain drop-shadow-md'
            alt={slide.title}
            unoptimized
          />
        ) : (
          // 🔥 ЗАГЛУШКА: Если логотипа нет, выводим название
          <div className='w-full h-full flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.2)] px-2'>
            <span className='font-benzin font-black text-white text-[10px] md:text-sm uppercase text-center drop-shadow-md leading-tight line-clamp-2'>
              {slide.title}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};