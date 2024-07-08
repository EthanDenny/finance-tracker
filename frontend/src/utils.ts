import { TransactionType } from "../../common/types.ts";
import { TransactionData } from "./types.ts";

export const post = (endpoint: string, data: Object) =>
  fetch(endpoint, {
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json" }),
    body: JSON.stringify(data),
  });

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
export const convertTransactionResultToData = (
  result: TransactionQueryResult
): TransactionData => {
  let type =
    result.Type == 0
      ? TransactionType.None
      : result.Type == 1
      ? TransactionType.Inflow
      : TransactionType.Outflow;

  return {
    id: result.ID,
    accountId: result.AccountID,
    date: result.Date,
    payee: result.Payee,
    category: result.Category,
    memo: result.Memo,
    amount: result.Amount,
    type,
    cleared: result.Cleared,
  };
};

export const backendAddress = import.meta.env.DEV
  ? "localhost:3000"
  : "www.notdeployedyet.com";
