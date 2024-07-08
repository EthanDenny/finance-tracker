import { TransactionEdit } from "../../common/types.ts";

export interface HookReturn<Data> {
  isPending: boolean;
  error: Error | null;
  data: Data;
}

export interface TransactionCallbacks {
  new: (accountId: number) => void;
  edit: (id: number, editData: TransactionEdit) => void;
  delete: (id: number) => void;
}

export interface TransactionQueryResult {
  ID: number;
  AccountID: number;
  Category: string;
  Memo: string;
  Amount: number | null;
  Type: number;
  Cleared: boolean;
}
