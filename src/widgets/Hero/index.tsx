'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

import 'swiper/css';
import 'swiper/css/navigation';

import { useHeroSlides } from '@/entities/slider/api';
import { HeroBackground } from './HeroBackground';
import { HeroOrbitItem } from './HeroOrbitItem';
import { HeroCard } from './HeroCard';
import { Skeleton } from '@/shared/ui/Skeleton';

const ORBIT_STEP_DEG = 45;
const FALLBACK_GRADIENTS = [
  'linear-gradient(135deg, #4a3b2c, #8b6b4a)',
  'linear-gradient(135deg, #8b58d6, #bca6db)',
  'linear-gradient(135deg, #d68b58, #dba68c)',
];

export const HeroWidget = () => {
  // Вызываем хук React Query
  const { data: slides, isLoading } = useHeroSlides();
  const [activeIndex, setActiveIndex] = useState(0);

  // Показываем красивый нативный скелетон во время загрузки (никаких белых экранов)
  if (isLoading) {
    return (
      <div className='w-full min-h-[500px] md:min-h-[650px] bg-[#0a235c] p-4 flex items-center justify-center pt-28'>
         <Skeleton className="w-[85%] md:w-[60%] h-[400px] rounded-[40px]" />
      </div>
    );
  }

  if (!slides || slides.length === 0) return null;

  return (
    <div className='relative w-full pt-28 md:pt-32 pb-20 md:pb-24 font-rubik overflow-hidden min-h-[500px] md:min-h-[650px] flex items-center bg-[#0a235c]'>
      <HeroBackground slides={slides} activeIndex={activeIndex} />

      <div className='absolute bottom-[5%] md:bottom-[-25%] left-1/2 -translate-x-1/2 w-[70%] h-[70%] md:w-[100%] md:h-[100%] mx-auto z-0 pointer-events-none'>
        <motion.div
          animate={{ rotate: activeIndex * -ORBIT_STEP_DEG }}
          transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
          className='w-full h-full relative'
        >
          {slides.map((slide, i) => (
            <div
              key={`orbit-${slide.id}`}
              className='absolute top-1/2 left-1/2 flex flex-col items-center justify-center origin-center'
              style={{ transform: `translate(-50%, -50%) rotate(${i * ORBIT_STEP_DEG}deg)` }}
            >
              <HeroOrbitItem slide={slide} />
            </div>
          ))}
        </motion.div>
      </div>

      <section className='w-full max-w-[1440px] mx-auto z-10 mt-16 md:mt-24'>
        <Swiper
          modules={[Navigation]}
          centeredSlides={true}
          slidesPerView={'auto'}
          spaceBetween={16}
          speed={800}
          navigation={{ prevEl: '.hero-prev', nextEl: '.hero-next' }}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          className='!overflow-visible px-4'
          breakpoints={{ 768: { spaceBetween: 40 } }}
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={slide.id} className='!w-[85%] sm:!w-[70%] md:!w-[60%] lg:!w-[55%] mx-auto'>
              {({ isActive }) => (
                <HeroCard slide={slide} isActive={isActive} fallbackGradient={FALLBACK_GRADIENTS[index % FALLBACK_GRADIENTS.length]} />
              )}
            </SwiperSlide>
          ))}
        </Swiper>

        <button className='hero-prev hidden md:flex items-center justify-center absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 text-white/70 hover:text-white active:scale-95 transition-all cursor-pointer bg-white/10 p-3 md:p-4 rounded-full backdrop-blur-md border border-white/20'>
          <ChevronLeft size={36} strokeWidth={2} />
        </button>
        <button className='hero-next hidden md:flex items-center justify-center absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 text-white/70 hover:text-white active:scale-95 transition-all cursor-pointer bg-white/10 p-3 md:p-4 rounded-full backdrop-blur-md border border-white/20'>
          <ChevronRight size={36} strokeWidth={2} />
        </button>
      </section>
    </div>
  );
};