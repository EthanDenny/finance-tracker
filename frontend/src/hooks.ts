import { useState } from "react";
import { useKeyGetter } from "./utils.ts";
import {
  TransactionData,
  TransactionEdit,
  TransactionType,
  TransactionCallbacks,
} from "./types.ts";

const initialTransactions: TransactionData[] = [
  {
    id: 0,
    accountId: 0,
    category: "Groceries",
    memo: "",
    amount: 100,
    type: TransactionType.Outflow,
    cleared: false,
  },
  {
    id: 1,
    accountId: 0,
    category: "Utilities",
    memo: "Electricity",
    amount: 400,
    type: TransactionType.Outflow,
    cleared: true,
  },
  {
    id: 2,
    accountId: 1,
    category: "Payroll",
    memo: "",
    amount: 1200,
    type: TransactionType.Inflow,
    cleared: false,
  },
];

export const useTransactions = (): [
  TransactionData[],
  TransactionCallbacks
] => {
  const getNextId = useKeyGetter(
    initialTransactions
      .map(({ id }) => id)
      .reduce((e1, e2) => (e1 > e2 ? e1 : e2))
  );

  const [transactions, setTransactions] = useState(initialTransactions);

  const newTransaction = (accountId: number) => {
    const data: TransactionData = {
      id: getNextId(),
      accountId: accountId,
      category: "",
      memo: "",
      amount: null,
      type: TransactionType.None,
      cleared: false,
    };
    setTransactions([...transactions, data]);
  };

  const editTransaction = (id: number, editData: TransactionEdit) => {
    let newTransactions = [];
    for (let data of transactions) {
      if (data.id == id) {
        newTransactions.push({
          ...data,
          category:
            editData.category != undefined ? editData.category : data.category,
          memo: editData.memo != undefined ? editData.memo : data.memo,
          amount: editData.amount != undefined ? editData.amount : data.amount,
          type: editData.type != undefined ? editData.type : data.type,
          cleared:
            editData.cleared != undefined ? editData.cleared : data.cleared,
        });
      } else {
        newTransactions.push(data);
      }
    }
    setTransactions(newTransactions);
  };

  const deleteTransaction = (id: number) => {
    setTransactions(transactions.filter((data) => data.id != id));
  };

  return [
    transactions,
    { new: newTransaction, edit: editTransaction, delete: deleteTransaction },
  ];
};
