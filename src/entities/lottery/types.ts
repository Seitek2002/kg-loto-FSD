export interface LotteryItem {
  id: number;
  title: string;
  titleText: string;
  subtitle: string;
  logo: string | null;
  imageLive: string | null;
  mainPrize1: string;
  mainPrize2: string;
  mainPrize3: string;
  prizeText: string;
  buttonText: string;
  buttonPrice: number | null;
  buttonLabel: string;
  buttonUrl?: string;
  drawTime: string;
  theme: 'white' | 'dark';
  backgroundImage: string;
  font: string;
}