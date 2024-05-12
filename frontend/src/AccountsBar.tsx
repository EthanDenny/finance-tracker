import { useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getAccountBalance } from "./Helpers.tsx";
import { DataContext } from "./DataContext.ts";
import AccountButton from "./AccountButton.tsx";

const AccountsBar = ({
  selectedId,
  selectAccount,
}: {
  selectedId: number;
  selectAccount: Function;
}) => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: ({ name }: { name: string }) =>
      fetch('/backend/create/account/?name="' + name + '"'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });

  const { accounts, transactions } = useContext(DataContext);
  const selectedAccount = accounts.find(({ id }) => id === selectedId);

  return (
    <div className="accounts-bar">
      <center>
        <h3>
          Balance: $
          {selectedAccount
            ? getAccountBalance(selectedAccount.id, transactions)
            : 0}
        </h3>
      </center>
      {accounts.map((account) => (
        <AccountButton
          key={account.id}
          name={account.name}
          balance={getAccountBalance(account.id, transactions)}
          onClick={() => selectAccount(account.id)}
        />
      ))}
      <button
        id="add-account-btn"
        onClick={() => {
          const name = prompt("Account Name:");
          if (name) {
            mutate({ name: name });
          }
        }}
      >
        + Add Account
      </button>
    </div>
  );
};

export default AccountsBar;
