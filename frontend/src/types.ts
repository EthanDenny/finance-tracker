import { TransactionEdit } from "../../common/types.ts";

export interface TransactionCallbacks {
  new: (accountId: number) => void;
  edit: (id: number, editData: TransactionEdit) => void;
  delete: (id: number) => void;
}
