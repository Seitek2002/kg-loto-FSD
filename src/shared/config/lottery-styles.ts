// src/config/lottery-styles.ts

export const BACKGROUND_VARIANTS: Record<string, string> = {
  '1': '/card-types/1.jpg',
  '2': '/card-types/2.jpg',
  '3': '/card-types/3.jpg',
  '4': '/card-types/4.jpg',
  '5': '/card-types/5.jpg',
  '6': '/card-types/6.jpg',
  '7': '/card-types/7.jpg',
  '8': '/card-types/8.jpg',
  '9': '/card-types/9.jpg',
  '10': '/card-types/10.jpg',
  '11': '/card-types/11.jpg',
  '12': '/card-types/12.jpg',
  '13': '/card-types/13.jpg',
  '14': '/card-types/14.jpg',
  '15': '/card-types/15.jpg',
  '16': '/card-types/16.jpg',
  '17': '/card-types/17.gif',
  '18': '/card-types/18.gif',
  '19': '/card-types/19.gif',

  default: '/card-types/1.jpg', // Фолбек
};

export const FONT_VARIANTS: Record<string, string> = {
  benzin: 'font-benzin',
  rubik: 'font-rubik',
  inter: 'font-rubik', // Если нет inter, используем rubik
  impact: 'font-benzin', // Фолбек
  default: 'font-benzin',
};
