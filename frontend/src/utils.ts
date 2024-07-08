import { TransactionQueryResult } from "./types.ts";
import { TransactionType } from "../../common/types.ts";

export const post = (endpoint: string, data: Object) =>
  fetch(endpoint, {
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json" }),
    body: JSON.stringify(data),
  });

export const convertTransactionResultToData = (
  result: TransactionQueryResult
) => {
  let type =
    result.Type == 0
      ? TransactionType.None
      : result.Type == 1
      ? TransactionType.Inflow
      : TransactionType.Outflow;

  return {
    id: result.ID,
    accountId: result.AccountID,
    category: result.Category,
    memo: result.Memo,
    amount: result.Amount,
    type,
    cleared: result.Cleared,
  };
};
