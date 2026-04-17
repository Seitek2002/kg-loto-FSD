'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, User } from 'lucide-react';
import { Winner } from '../types';
import { Button } from '@/shared/ui/Button';

export const WinnerCard = ({ winner }: { winner: Winner }) => {
  return (
    <div className='relative w-full aspect-[4/5] rounded-[32px] overflow-hidden bg-white shadow-sm border border-gray-100'>
      {winner.image ? (
        <Image
          src={winner.image}
          alt={winner.name}
          fill
          className='object-cover'
          sizes='(max-width: 768px) 50vw, 25vw'
          unoptimized // Обязательно для Static Export
        />
      ) : (
        <div className='w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200'>
          <div className='w-20 h-20 rounded-full bg-white/50 flex items-center justify-center mb-6 backdrop-blur-sm'>
            <User size={40} className='text-gray-400' />
          </div>
        </div>
      )}

      {winner.lotteryLogo ? (
        <div>
          <Image
            className='absolute top-2 left-2'
            width={105}
            height={59}
            src={winner.lotteryLogo}
            alt='Логотип лотереи'
            unoptimized // 🔥 Обязательно и здесь тоже!
          />
        </div>
      ) : (
        <div className='absolute top-3 left-3 bg-white rounded-full px-2.5 py-1.5 flex items-center gap-1.5 shadow-sm z-10'>
          <Star size={10} className='fill-[#6F51FF] text-[#6F51FF]' />
          <span className='text-[10px] font-black font-benzin uppercase text-[#6F51FF] tracking-wide leading-none pt-0.5'>
            {winner.lotteryBadge}
          </span>
        </div>
      )}

      <div className='absolute bottom-3 left-3 right-3'>
        <div className='bg-white/60 backdrop-blur-md border border-white/40 rounded-3xl p-3 md:p-4 flex flex-col lg:flex-row lg:justify-between items-center text-center shadow-lg'>
          <div className='flex flex-col mb-1 lg:mb-0 lg:text-left'>
            <h3 className='text-[10px] md:text-xs font-black text-[#4B4B4B] font-benzin uppercase mb-0.5'>
              {winner.name}
            </h3>
            <p className='text-[10px] md:text-xs text-[#4B4B4B]/80 font-rubik font-semibold'>
              {winner.city}
            </p>
          </div>
          <span className='text-xs md:text-sm font-black text-black font-benzin tracking-tight leading-tight'>
            {winner.prize}
          </span>
        </div>
        <div className='flex justify-center mt-2'>
          <Link href={winner.buttonUrl || `/lottery/${winner.lotteryId}`} className="w-auto">
            {/* Используем наш Button */}
            <Button variant="secondary" className="px-6 py-3 md:px-8 text-[10px] md:text-xs shadow-lg bg-white text-[#1E1E1E]">
              ИГРАТЬ • 100 с
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};