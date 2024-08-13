import { TransactionType } from "../../common/types.ts";

export interface AccountData {
  id: number;
  name: string;
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

export type Balances = Map<number, number>;
