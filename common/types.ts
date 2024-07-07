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
  category: string;
  memo: string;
  amount: number | null;
  type: TransactionType;
  cleared: boolean;
}

export type TransactionEdit = {
  category?: string;
  memo?: string;
  amount?: number | null;
  type?: TransactionType;
  cleared?: boolean;
};
