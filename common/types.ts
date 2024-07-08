export enum TransactionType {
  None,
  Inflow,
  Outflow,
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
