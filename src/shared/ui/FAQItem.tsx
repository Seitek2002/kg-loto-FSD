'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItemProps {
  question: string;
  answer: string;
}

export const FAQItem = ({ question, answer }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='bg-white rounded-3xl overflow-hidden transition-shadow hover:shadow-sm'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='w-full py-6 px-6 md:px-8 flex items-center justify-between gap-4 text-left group transition-transform active:scale-[0.99]'
      >
        <span className='font-benzin font-bold text-xs md:text-sm text-[#4B4B4B] uppercase leading-tight'>
          {question}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className='shrink-0 text-gray-800'
        >
          <Plus size={20} strokeWidth={2} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className='overflow-hidden'>
              <div
                className='pb-6 px-6 md:px-8 text-sm text-[#6E6E6E] font-rubik leading-relaxed max-w-[95%]'
                dangerouslySetInnerHTML={{ __html: answer }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};