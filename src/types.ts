export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
}

export type AngleMode = 'DEG' | 'RAD';

export type ButtonType = 'number' | 'operator' | 'action' | 'scientific' | 'equals';
