import { useState } from "react";
import {
  Account,
  Allocation,
  Transaction,
  TransactionType,
} from "../../common/Types";

export const moneyText = (amount: number, showPositive: boolean) => {
  return (amount < 0 ? "-" : showPositive ? "+" : "") + "$" + Math.abs(amount);
};

export const sumArray = (nums: number[]) => {
  return nums.reduce((a, v) => a + v, 0);
};

export const getAccountBalance = (
  accountId: number,
  transactions: Transaction[]
) => {
  return sumArray(
    transactions
      .filter((transaction) => transaction.accountId === accountId)
      .map((transaction) => transaction.amount)
  );
};

export const accountsFromResponse = (response: any) => {
  return response.map((account: any) => new Account(account.Id, account.Name));
};

export const transactionsFromResponse = (response: any) => {
  return response.map(
    (transaction: any) =>
      new Transaction(
        transaction.Id,
        transaction.AccountId,
        transaction.Date.slice(0, 10),
        transaction.Payee,
        transaction.Memo,
        transaction.Type === "INFLOW"
          ? TransactionType.Inflow
          : TransactionType.Outflow,
        transaction.Amount,
        transaction.Cleared === 1
      )
  );
};

export const allocationsFromResponse = (response: any) => {
  return response.map(
    (allocation: any) =>
      new Allocation(
        allocation.Id,
        allocation.TransactionId,
        allocation.Category,
        allocation.Amount
      )
  );
};

export const useHesitant = <Type,>(
  initialValue: Type
): [Type, Function, Function] => {
  const [prevValue, setPrevValue] = useState(initialValue);
  const [value, setValue] = useState(initialValue);

  const updateValue = (newValue: Type) => {
    setPrevValue(value);
    setValue(newValue);
  };

  const resetValue = () => {
    setValue(prevValue);
  };

  return [value, updateValue, resetValue];
};
