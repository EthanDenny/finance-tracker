import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { AccountData, TransactionData } from "./types.ts";
import {
  post,
  convertTransactionResultToData,
  backendAddress,
} from "./utils.ts";

export const useAccounts = (): UseQueryResult<AccountData[]> =>
  useQuery({
    queryKey: ["accounts"],
    queryFn: () =>
      fetch(`http://${backendAddress}/accounts`).then((res) => res.json()),
    select: (data) =>
      data.map(({ ID, Name }: { ID: number; Name: string }) => {
        return { id: ID, name: Name };
      }),
  });

export const useBalances = (): UseQueryResult<Map<number, number>> =>
  useQuery({
    queryKey: ["balances"],
    queryFn: () =>
      fetch(`http://${backendAddress}/balances`).then((res) => res.json()),
    select: (data) =>
      new Map(
        data.map(
          ({ AccountID, Balance }: { AccountID: number; Balance: number }) => [
            AccountID,
            Balance,
          ]
        )
      ),
  });

export const accountQueryKey = (accountId: number) =>
  `account_transactions_${accountId}`;

export const useAccountTransactions = (
  accountId: number
): UseQueryResult<TransactionData[]> =>
  useQuery({
    queryKey: [accountQueryKey(accountId)],
    queryFn: () =>
      post(`http://${backendAddress}/transactions`, {
        accountId,
      }).then((res) => res.json()),
    select: (data) => data.map(convertTransactionResultToData),
  });

export const useTransaction = (
  id: number
): [UseQueryResult<TransactionData | null>, string] => {
  const key = `transaction_${id}`;

  return [
    useQuery({
      queryKey: [key],
      queryFn: () =>
        post(`http://${backendAddress}/transactions`, {
          id,
        }).then((res) => res.json()),
      select: (data) =>
        data.length == 1 ? convertTransactionResultToData(data[0]) : null,
    }),
    key,
  ];
};
