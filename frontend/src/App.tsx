import { useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { DataContext } from "./DataContext.ts";
import {
  accountsFromResponse,
  transactionsFromResponse,
  allocationsFromResponse,
} from "./Helpers.tsx";
import AccountsBar from "./AccountsBar.tsx";
import AccountDetails from "./AccountDetails.tsx";
import "./App.css";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Main />
    </QueryClientProvider>
  );
};

const Main = () => {
  const [selectednumber, setSelectedId]: [number, Function] = useState(-1);

  const accounts = useQuery({
    queryKey: ["accounts"],
    queryFn: () =>
      fetch("/backend/accounts/")
        .then((res) => res.json())
        .then((json) => {
          const accounts = accountsFromResponse(json);
          if (selectednumber === -1 && accounts.length > 0) {
            setSelectedId(accounts[0].id);
          }
          return accounts;
        }),
  });

  const transactions = useQuery({
    queryKey: ["transactions"],
    queryFn: () =>
      fetch("/backend/transactions/")
        .then((res) => res.json())
        .then((json) => transactionsFromResponse(json)),
  });

  const allocations = useQuery({
    queryKey: ["allocations"],
    queryFn: () =>
      fetch("/backend/allocations/")
        .then((res) => res.json())
        .then((json) => allocationsFromResponse(json)),
  });

  if (accounts.isPending || transactions.isPending || allocations.isPending) {
    return null;
  }

  const error = (query: any) => {
    return "An error has occurred: " + query.error.message;
  };

  if (accounts.error) error(accounts);
  if (transactions.error) error(transactions);
  if (allocations.error) error(allocations);

  return (
    <DataContext.Provider
      value={{
        accounts: accounts.data,
        transactions: transactions.data,
        allocations: allocations.data,
      }}
    >
      {accounts.data.length > 0 && (
        <AccountsBar
          key={accounts.data}
          selectedId={selectednumber}
          selectAccount={setSelectedId}
        />
      )}
      {selectednumber !== -1 && <AccountDetails selectedId={selectednumber} />}
    </DataContext.Provider>
  );
};

export default App;
