export type MediaField = {
  url: string;
  type: 'image' | 'lottie';
} | null;

export interface SliderItem {
  id: number;
  title: string;
  subtitle: string;
  prizeText: string;
  // Новые поля для медиа:
  image: MediaField;
  imageMobile: MediaField;
  imageLayer: MediaField;
  imageMobileLayer: MediaField;
  backgroundImage: string | null;
  logo: string | null;
  hasAnimation: boolean;
  buttonText: string;
  buttonPrice: number | null;
  buttonLabel: string;
  buttonUrl: string;
}