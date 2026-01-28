export interface LogEntry {
  id: string;
  amount: number; // in mg
  timestamp: number; // unix epoch
}

export interface DailyStat {
  dateStr: string;
  totalAmount: number;
}