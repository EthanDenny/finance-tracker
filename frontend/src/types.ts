export interface AccountData {
  id: number;
  name: string;
}

export enum TransactionType {
  Inflow,
  Outflow,
  None,
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

export interface TransactionEdit {
  category?: string;
  memo?: string;
  amount?: number | null;
  type?: TransactionType;
  cleared?: boolean;
}

export interface TransactionCallbacks {
  new: (accountId: number) => void;
  edit: (id: number, editData: TransactionEdit) => void;
  delete: (id: number) => void;
}
