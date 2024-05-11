import { createContext } from "react";
import { Account, Allocation, Transaction } from "../../common/Types.ts";

type Data = {
  accounts: Account[];
  transactions: Transaction[];
  allocations: Allocation[];
};

export const DataContext = createContext<Data>({
  accounts: [],
  transactions: [],
  allocations: [],
});
