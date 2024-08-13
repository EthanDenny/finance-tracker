export enum TransactionType {
  None,
  Inflow,
  Outflow,
}

export interface TransactionEdit {
  date?: string;
  payee?: string;
  category?: string;
  memo?: string;
  amount?: number | null;
  type?: TransactionType;
  cleared?: boolean;
}

export interface TransactionQueryResult {
  ID: number;
  AccountID: number;
  Date: string;
  Payee: string;
  Category: string;
  Memo: string;
  Amount: number | null;
  Type: number;
  Cleared: boolean;
}
