export interface ApiResponse<T> {
  data: T;
  meta: Record<string, unknown>;
  errors?: unknown[]; // Сделал опциональным, так как при 200 OK его может не быть
}

export interface QAItem {
  id: number;
  question: string;
  answer: string;
}