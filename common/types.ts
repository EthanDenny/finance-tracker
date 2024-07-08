export interface AccountData {
  id: number;
  name: string;
}

export enum TransactionType {
  None,
  Inflow,
  Outflow,
}

export interface TransactionData {
  id: number;
  accountId: number;
  date: string;
  payee: string;
  category: string;
  memo: string;
  amount: number | null;
  type: TransactionType;
  cleared: boolean;
}

export type TransactionEdit = {
  date?: string;
  payee?: string;
  category?: string;
  memo?: string;
  amount?: number | null;
  type?: TransactionType;
  cleared?: boolean;
};
