import { useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DataContext } from "./DataContext.ts";
import { Transaction } from "../../common/Types.ts";
import TransactionDetails from "./TransactionDetails.tsx";

const AccountDetails = ({ selectedId }: { selectedId: number }) => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: () =>
      fetch("/backend/create/transaction/?accountId=" + selectedId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });

  const { accounts, transactions } = useContext(DataContext);
  const selectedAccount = accounts.find(({ id }) => id === selectedId);

  return (
    selectedAccount && (
      <div className="account-details">
        <h1 style={{ marginLeft: "20px" }}>{selectedAccount.name}</h1>
        <button
          onClick={() => {
            mutate();
          }}
        >
          + Add Transaction
        </button>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Payee</th>
              <th>Category</th>
              <th>Memo</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Ⓒ</th>
            </tr>
          </thead>
          <tbody>
            {transactions
              .filter(
                (transaction: Transaction) =>
                  transaction.accountId == selectedAccount.id
              )
              .map((transaction: Transaction) => (
                <TransactionDetails
                  key={transaction.id}
                  selectedId={transaction.id}
                />
              ))}
          </tbody>
        </table>
      </div>
    )
  );
};

export default AccountDetails;
