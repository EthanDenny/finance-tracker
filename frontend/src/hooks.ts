import {
  useQuery,
  useQueryClient,
  UseQueryResult,
  useMutation,
} from "@tanstack/react-query";
import { AccountData, TransactionData } from "./types.ts";
import {
  post,
  convertTransactionResultToData,
  backendAddress,
} from "./utils.ts";
import { TransactionEdit } from "../../common/types.ts";
import { Balances } from "./types.ts";

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

export const useBalances = (): UseQueryResult<Balances> =>
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

export const useTabHeadings = (
  accounts: UseQueryResult<AccountData[]>,
  balances: UseQueryResult<Balances>
) => {
  if (accounts.isPending || accounts.isError) {
    return [];
  }

  if (balances.isPending || balances.isError) {
    return accounts.data.map(({ id, name }) => {
      return { id, heading: name };
    });
  }

  return accounts.data.map(({ id, name }) => {
    const balance = balances.data.get(id);
    return {
      id,
      heading: `${name}: ${balance ? (balance < 0 ? "-" : "") : ""}$${Math.abs(
        balance ?? 0
      ).toFixed(2)}`,
    };
  });
};

export const useNewAccount = () => {
  const queryClient = useQueryClient();

  const { mutate: newAccount } = useMutation({
    mutationFn: () =>
      post(`http://${backendAddress}/create/account`, {
        name: prompt("Account Name"),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["accounts"],
      });
      queryClient.invalidateQueries({
        queryKey: ["balances"],
      });
    },
  });

  return newAccount;
};

export const useDeleteAccount = (getCurrentID: () => number) => {
  const queryClient = useQueryClient();

  const { mutate: deleteAccount } = useMutation({
    mutationFn: () =>
      post(`http://${backendAddress}/delete/account`, { id: getCurrentID() }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["accounts"],
      });
    },
  });

  return deleteAccount;
};

export const useNewTransaction = (getCurrentID: () => number) => {
  const queryClient = useQueryClient();

  const { mutate: newTransaction } = useMutation({
    mutationFn: () =>
      post(`http://${backendAddress}/create/transaction`, {
        accountId: getCurrentID(),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["account_transactions", getCurrentID()],
      });
    },
  });

  return newTransaction;
};

export const useAccountTransactions = (
  accountId: number
): UseQueryResult<TransactionData[]> =>
  useQuery({
    queryKey: ["account_transactions", accountId],
    queryFn: () =>
      post(`http://${backendAddress}/transactions`, {
        accountId,
      }).then((res) => res.json()),
    select: (data) => data.map(convertTransactionResultToData),
  });

export const useTransaction = (id: number) =>
  useQuery({
    queryKey: ["transaction", id],
    queryFn: () =>
      post(`http://${backendAddress}/transactions`, {
        id,
      }).then((res) => res.json()),
    select: (data) =>
      data.length == 1 ? convertTransactionResultToData(data[0]) : null,
  });

export const useUpdateTransaction = (id: number) => {
  const queryClient = useQueryClient();

  const { mutate: updateTransaction } = useMutation({
    mutationFn: (data: TransactionEdit) =>
      post(`http://${backendAddress}/update/transaction`, {
        id,
        data: data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transaction", id] });
      queryClient.invalidateQueries({ queryKey: ["balances"] });
    },
  });

  return updateTransaction;
};

export const useDeleteTransaction = (id: number) => {
  const queryClient = useQueryClient();

  const { mutate: deleteTransaction } = useMutation({
    mutationFn: () =>
      post(`http://${backendAddress}/delete/transaction`, {
        id,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transaction", id] });
      queryClient.invalidateQueries({ queryKey: ["balances"] });
    },
  });

  return deleteTransaction;
};
