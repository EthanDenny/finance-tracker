import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
  AccountData,
  TransactionData,
  TransactionType,
  TransactionEdit,
} from "../../common/types.ts";

export const useAccounts = (): {
  isPending: boolean;
  error: Error | null;
  data: AccountData[];
} => {
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
      data.map(({ ID, AccountName }: { ID: string; AccountName: string }) => {
        return { id: ID, name: AccountName };
      }),
  };
};

interface TransactionQueryResult {
  ID: number;
  AccountID: number;
  Category: string;
  Memo: string;
  Amount: number | null;
  Type: number;
  Cleared: boolean;
}
export const useTransactions = (): {
  isPending: boolean;
  error: Error | null;
  data: TransactionData[];
} => {
  const { isPending, error, data } = useQuery({
    queryKey: ["transactions"],
    queryFn: () =>
      fetch("http://localhost:3000/transactions").then((res) => res.json()),
  });
  return {
    isPending,
    error,
    data:
      data &&
      data.map((result: TransactionQueryResult) => {
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
      }),
  };
};

export const useTransactionCallbacks = () => {
  const queryClient = useQueryClient();

  const post = (endpoint: string, data: Object) =>
    fetch(endpoint, {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    });

  const createTransaction = useMutation({
    mutationFn: (accountId: number) =>
      post(`http://localhost:3000/create/transaction/`, { accountId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  }).mutate;

  const updateTransaction = useMutation({
    mutationFn: ({ id, data }: { id: number; data: TransactionEdit }) =>
      post("http://localhost:3000/update/transaction/", {
        id: id,
        data: data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  }).mutate;

  const deleteTransaction = useMutation({
    mutationFn: (id: number) =>
      post(`http://localhost:3000/delete/transaction/`, { id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  }).mutate;

  return {
    create: createTransaction,
    update: updateTransaction,
    delete: deleteTransaction,
  };
};
