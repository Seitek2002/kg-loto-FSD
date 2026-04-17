// src/features/check-ticket/ui/CheckTicketModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Trophy, Frown, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCheckTicket } from '../api';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { useMounted } from '@/hook/useMounted';

interface CheckTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCode?: string;
}

export const CheckTicketModal = ({ isOpen, onClose, initialCode = '' }: CheckTicketModalProps) => {
  const mounted = useMounted();
  const { mutate: checkTicket, data: result, isPending, error, reset } = useCheckTicket();

  // 🔥 Правильный паттерн React: синхронизация без useEffect
  const [ticketNumber, setTicketNumber] = useState(initialCode);
  const [prevInitialCode, setPrevInitialCode] = useState(initialCode);

  if (initialCode !== prevInitialCode) {
    setPrevInitialCode(initialCode);
    setTicketNumber(initialCode);
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!mounted) return null;

  const handleClose = () => {
    onClose();
    // Даем анимации закрытия проиграться (0.2s), затем сбрасываем стейты
    setTimeout(() => {
      setTicketNumber(initialCode);
      reset();
    }, 200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketNumber.trim()) return;
    checkTicket(ticketNumber);
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
          {/* Фон */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className='absolute inset-0 bg-black/40 backdrop-blur-sm z-0' 
            onClick={handleClose} 
          />

          {/* Контент */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }}
            className='bg-white w-full max-w-md rounded-3xl p-8 relative shadow-2xl z-10 overflow-hidden'
          >
            <button onClick={handleClose} className='absolute top-6 right-6 text-gray-400 hover:text-[#4B4B4B] transition-colors active:scale-90'>
              <X size={24} />
            </button>

            {isPending ? (
              <div className='flex flex-col items-center justify-center py-10'>
                <Loader2 className='w-12 h-12 text-[#FFD600] animate-spin mb-4' />
                <p className='text-[#4B4B4B] font-bold font-rubik'>Проверяем билет...</p>
              </div>
            ) : result ? (
              <div className='flex flex-col items-center text-center pt-4'>
                {result.isWinning ? (
                  <>
                    <div className='w-20 h-20 bg-[#D1F5D3] rounded-full flex items-center justify-center mb-4 shadow-sm'>
                      <Trophy className='w-10 h-10 text-[#1FAF38]' />
                    </div>
                    <h2 className='text-2xl font-black text-[#4B4B4B] uppercase font-benzin mb-2'>Победа!</h2>
                    <p className='text-[#737373] font-medium mb-6'>{result.message}</p>
                    <div className='bg-[#FFF0D4] px-6 py-3 rounded-2xl border border-[#F58220]/20'>
                      <span className='block text-[#F58220] text-xs font-bold uppercase mb-1'>Ваш выигрыш</span>
                      <span className='text-2xl font-black text-[#F58220]'>
                        {result.prizeAmount ? `${result.prizeAmount} сом` : result.prizeProduct}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className='w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 shadow-sm'>
                      <Frown className='w-10 h-10 text-gray-400' />
                    </div>
                    <h2 className='text-2xl font-black text-[#4B4B4B] uppercase font-benzin mb-2'>Увы...</h2>
                    <p className='text-[#737373] font-medium mb-6'>{result.message || 'Этот билет не выиграл'}</p>
                  </>
                )}
                <button onClick={() => reset()} className='mt-8 text-sm font-bold text-gray-400 hover:text-[#4B4B4B] underline active:scale-95'>
                  Проверить другой билет
                </button>
              </div>
            ) : (
              <>
                <h2 className='text-3xl leading-tight font-black font-benzin uppercase text-[#4B4B4B] mb-2 pr-6'>
                  Проверка билета
                </h2>
                <p className='text-sm font-medium font-rubik text-gray-400 mb-8'>
                  Узнайте выиграли ли вы приз!
                </p>
                <form onSubmit={handleSubmit} className='flex flex-col'>
                  <label className='block text-xs font-bold text-[#4B4B4B] font-rubik mb-2 ml-1'>
                    Номер билета
                  </label>
                  <Input
                    value={ticketNumber}
                    onChange={(e) => setTicketNumber(e.target.value)}
                    placeholder='Например: YT2357912'
                    className='mb-2'
                    error={error ? 'Код не найден или недействителен' : undefined}
                  />
                  <Button type='submit' disabled={!ticketNumber.trim()} className='mt-2'>
                    Проверить
                  </Button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};