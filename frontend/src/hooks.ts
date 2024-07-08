import { useQuery } from "@tanstack/react-query";
import { AccountData, TransactionData } from "../../common/types.ts";
import { HookReturn } from "./types.ts";
import { post, convertTransactionResultToData } from "./utils.ts";

export const useAccounts = (): HookReturn<AccountData[]> => {
  const { isPending, error, data } = useQuery({
    queryKey: ["accounts"],
    queryFn: () =>
      fetch("http://localhost:3000/accounts").then((res) => res.json()),
  });

  return {
    isPending,
    error,
    data:
      data &&
      data.map(({ ID, AccountName }: { ID: number; AccountName: string }) => {
        return { id: ID, name: AccountName };
      }),
  };
};

export const useBalances = (): HookReturn<Map<number, number>> => {
  const { isPending, error, data } = useQuery({
    queryKey: ["balances"],
    queryFn: () =>
      fetch("http://localhost:3000/balances").then((res) => res.json()),
  });

  return {
    isPending,
    error,
    data:
      data &&
      new Map(
        data.map(
          ({ AccountID, Balance }: { AccountID: number; Balance: number }) => [
            AccountID,
            Balance,
          ]
        )
      ),
  };
};

export const accountQueryKey = (accountId: number) =>
  `account_transactions_${accountId}`;

export const useAccountTransactions = (
  accountId: number
): HookReturn<TransactionData[]> => {
  const { isPending, error, data } = useQuery({
    queryKey: [accountQueryKey(accountId)],
    queryFn: () =>
      post("http://localhost:3000/transactions", { accountId }).then((res) =>
        res.json()
      ),
  });
  return {
    isPending,
    error,
    data: data && data.map(convertTransactionResultToData),
  };
};

export const useTransaction = (
  id: number
): [HookReturn<TransactionData>, string] => {
  const key = `transaction_${id}`;

  const { isPending, error, data } = useQuery({
    queryKey: [key],
    queryFn: () =>
      post("http://localhost:3000/transactions", { id }).then((res) =>
        res.json()
      ),
  });

  return [
    {
      isPending,
      error,
      data: data && data.length == 1 && convertTransactionResultToData(data[0]),
    },
    key,
  ];
};
