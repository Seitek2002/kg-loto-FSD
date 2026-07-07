export interface Winner {
  id: number;
  name: string;
  city: string;
  prize: string;
  image: string | null;
  lotteryBadge: string;
  lotteryLogo?: string;
  buttonUrl?: string;
  lotteryId?: number;
}

export interface PaginatedResult<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// GET /api/v1/winners/lotteries/ — лотереи, по которым есть отмеченные
// победители; используется для построения фильтра на экране /winners
export interface WinnerLotteryOption {
  id: number;
  title: string;
  billingLotteryId: string | null;
}