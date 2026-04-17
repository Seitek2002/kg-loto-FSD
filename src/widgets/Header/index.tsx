'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Wallet } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

export const HeaderWidget = ({ className }: { className?: string }) => {
  const router = useRouter();
  
  // TODO: Позже будем брать баланс из Zustand или React Query
  const balance = 150; 

  return (
    <header
      className={cn(
        // Делаем хедер липким, добавляем фон с легким блюром для красоты при скролле
        'sticky top-0 z-50 w-full bg-[#F5F5F5]/90 backdrop-blur-md px-4 py-3 flex items-center justify-between',
        className
      )}
    >
      {/* Кнопка Назад */}
      <button
        onClick={() => router.back()}
        className='p-2 -ml-2 text-[#4B4B4B] active:scale-90 transition-transform rounded-full'
      >
        <ChevronLeft size={28} strokeWidth={2.5} />
      </button>

      {/* Логотип по центру (абсолютно позиционирован, чтобы не смещаться из-за ширины боковых элементов) */}
      <div className='absolute left-1/2 -translate-x-1/2'>
        <Image
          src='/logo.png' // Твой файл из public
          alt='KGLOTO.COM'
          width={110}
          height={32}
          className='object-contain'
          priority
          unoptimized // Обязательно для Static Export
        />
      </div>

      {/* Баланс */}
      <div className='flex items-center gap-1.5 px-2 py-1'>
        <Wallet size={20} className='text-[#4B4B4B]' strokeWidth={2} />
        <span className='font-benzin font-black text-[#FF8A00] text-sm md:text-base'>
          {balance} <span className='underline underline-offset-2'>с</span>
        </span>
      </div>
    </header>
  );
};