export enum TransactionType {
  Inflow,
  Outflow,
  None,
}

export interface TransactionData {
  id: number;
  category: string;
  memo: string;
  amount: number | null;
  type: TransactionType;
  cleared: boolean;
}

export interface TransactionEdit {
  category?: string;
  memo?: string;
  amount?: number | null;
  type?: TransactionType;
  cleared?: boolean;
}
