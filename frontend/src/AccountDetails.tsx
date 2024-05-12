import { useContext, useState } from "react";
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

  const [focusedId, setFocusedId] = useState<number | null>(null);

  return (
    selectedAccount && (
      <div className="account-details" onClick={() => setFocusedId(null)}>
        <h1 style={{ marginLeft: "20px" }}>{selectedAccount.name}</h1>
        <button
          onClick={() => {
            mutate();
          }}
        >
          + Add Transaction
        </button>
        <div>
          {["Date", "Payee", "Category", "Memo", "Type", "Amount", "Ⓒ"].map(
            (heading) => (
              <div key={heading} className="account-data-cell">
                {heading}
              </div>
            )
          )}
        </div>
        {transactions
          .filter(
            (transaction: Transaction) =>
              transaction.accountId == selectedAccount.id
          )
          .map((transaction: Transaction) => (
            <TransactionDetails
              key={transaction.id}
              selectedId={transaction.id}
              focused={focusedId === transaction.id}
              focusTransaction={setFocusedId}
            />
          ))}
      </div>
    )
  );
};

export default AccountDetails;
