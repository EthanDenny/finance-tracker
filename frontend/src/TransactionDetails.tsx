import { createContext, MouseEventHandler, useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import DataCell from "./DataCell.tsx";
import { DataContext } from "./DataContext.ts";
import { useHesitant } from "./Helpers.tsx";
import {
  Allocation,
  Transaction,
  TransactionType,
} from "../../common/Types.ts";

const FocusedContext = createContext(false);

const TransactionDetails = ({
  selectedId,
  focused,
  focusTransaction,
}: {
  selectedId: number;
  focused: boolean;
  focusTransaction: Function;
}) => {
  const { transactions, allocations } = useContext(DataContext);
  const selectedTransaction = transactions.find(({ id }) => id === selectedId);
  const selectedAllocations = allocations.filter(
    ({ transactionId }) => transactionId === selectedId
  );

  const onClick = (e: any) => {
    focusTransaction(selectedId);
    e.stopPropagation();
  };

  return (
    selectedTransaction && (
      <div className={focused ? "transaction-focused" : "transaction"}>
        <FocusedContext.Provider value={focused}>
          <TransactionEntry
            transaction={selectedTransaction}
            allocations={selectedAllocations}
            onClick={onClick}
          />
          {selectedAllocations.length > 1 &&
            selectedAllocations.map((allocation) => (
              <AllocationEntry
                key={allocation.id}
                allocation={allocation}
                onClick={onClick}
              />
            ))}
        </FocusedContext.Provider>
      </div>
    )
  );
};

const TransactionEntry = ({
  transaction,
  allocations,
  onClick,
}: {
  transaction: Transaction;
  allocations: Allocation[];
  onClick: MouseEventHandler;
}) => {
  return (
    <div className={"transaction-row"} onClick={onClick}>
      <DateInput transaction={transaction} />
      <PayeeInput transaction={transaction} />
      {allocations.length === 1 ? (
        <CategoryInput allocation={allocations[0]} />
      ) : (
        <div className={"account-data-cell"} />
      )}
      <MemoInput transaction={transaction} />
      <TypeSelector transaction={transaction} />
      {allocations.length === 1 ? (
        <AmountInput transaction={transaction} allocation={allocations[0]} />
      ) : (
        <AmountInput transaction={transaction} allocation={null} />
      )}
      <ClearedBox transaction={transaction} />
    </div>
  );
};

const AllocationEntry = ({
  allocation,
  onClick,
}: {
  allocation: Allocation;
  onClick: MouseEventHandler;
}) => {
  return (
    <div className={"allocation-row"} onClick={onClick}>
      <DataCell />
      <DataCell />
      <CategoryInput allocation={allocation} />
      <DataCell />
      <DataCell />
      <AmountInput transaction={null} allocation={allocation} />
    </div>
  );
};

const DateInput = ({ transaction }: { transaction: Transaction }) => {
  const queryClient = useQueryClient();
  const focused = useContext(FocusedContext);

  const [value, setValue, resetValue] = useHesitant(transaction.date);
  const { mutate } = useMutation({
    mutationFn: ({ date }: { date: string }) =>
      fetch(
        "/backend/update/transaction/?id=" + transaction.id + "&date=" + date
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: () => {
      resetValue();
    },
  });

  return (
    <DataCell>
      <input
        type="date"
        value={value}
        onChange={(e) => {
          if (focused) {
            setValue(e.target.value);
            mutate({ date: e.target.value.slice(0, 10) });
          }
        }}
      />
    </DataCell>
  );
};

const PayeeInput = ({ transaction }: { transaction: Transaction }) => {
  const queryClient = useQueryClient();

  const [value, setValue, resetValue] = useHesitant(transaction.payee);
  const { mutate } = useMutation({
    mutationFn: ({ payee }: { payee: string }) =>
      fetch(
        "/backend/update/transaction/?id=" +
          transaction.id +
          '&payee="' +
          payee +
          '"'
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: () => {
      resetValue();
    },
  });

  return (
    <DataCell>
      <input
        className="input-text"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          mutate({ payee: e.target.value });
        }}
      />
    </DataCell>
  );
};

const CategoryInput = ({ allocation }: { allocation: Allocation }) => {
  const queryClient = useQueryClient();

  const [value, setValue, resetValue] = useHesitant(allocation.category);
  const { mutate } = useMutation({
    mutationFn: ({ category }: { category: string }) =>
      fetch(
        "/backend/update/allocation/?id=" +
          allocation.id +
          '&category="' +
          category +
          '"'
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allocations"] });
    },
    onError: () => {
      resetValue();
    },
  });

  return (
    <DataCell>
      <input
        className="input-text"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          mutate({ category: e.target.value });
        }}
      />
    </DataCell>
  );
};

const MemoInput = ({ transaction }: { transaction: Transaction }) => {
  const queryClient = useQueryClient();

  const [value, setValue, resetValue] = useHesitant(transaction.memo);
  const { mutate } = useMutation({
    mutationFn: ({ memo }: { memo: string }) =>
      fetch(
        "/backend/update/transaction/?id=" +
          transaction.id +
          '&memo="' +
          memo +
          '"'
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: () => {
      resetValue();
    },
  });

  return (
    <DataCell>
      <input
        className="input-text"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          mutate({ memo: e.target.value });
        }}
      />
    </DataCell>
  );
};

const TypeSelector = ({ transaction }: { transaction: Transaction }) => {
  const typeString = (type: TransactionType) =>
    type === TransactionType.Outflow ? "Outflow" : "Inflow";

  const queryClient = useQueryClient();

  const [value, setValue, resetValue] = useHesitant(
    typeString(transaction.type)
  );
  const { mutate } = useMutation({
    mutationFn: ({ type }: { type: TransactionType }) =>
      fetch(
        "/backend/update/transaction/?id=" +
          transaction.id +
          "&type=" +
          typeString(type)
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: () => {
      resetValue();
    },
  });

  return (
    <DataCell>
      <select
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          mutate({
            type:
              e.target.value === "Outflow"
                ? TransactionType.Outflow
                : TransactionType.Inflow,
          });
        }}
      >
        <option>Outflow</option>
        <option>Inflow</option>
      </select>
    </DataCell>
  );
};

const AmountInput = ({
  transaction,
  allocation,
}: {
  transaction: Transaction | null;
  allocation: Allocation | null;
}) => {
  const queryClient = useQueryClient();

  const [value, setValue, resetValue] = useHesitant(
    allocation ? allocation.amount : transaction ? transaction.amount : 0
  );
  const mutateTransaction = useMutation({
    mutationFn: ({ amount }: { amount: number }) =>
      fetch(
        "/backend/update/transaction/?id=" +
          (transaction && transaction.id) +
          "&amount=" +
          amount
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["transactions"],
      });
    },
    onError: () => {
      resetValue();
    },
  }).mutate;
  const mutateAllocation = useMutation({
    mutationFn: ({ amount }: { amount: number }) =>
      fetch(
        "/backend/update/allocation/?id=" +
          (allocation && allocation.id) +
          "&amount=" +
          amount
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["allocations"],
      });
    },
    onError: () => {
      resetValue();
    },
  }).mutate;

  return (
    <DataCell>
      <input
        type="number"
        value={value}
        onChange={(e) => {
          setValue(Number(e.target.value));
          if (transaction) {
            mutateTransaction({
              amount: Number(e.target.value),
            });
          }
          if (allocation) {
            mutateAllocation({
              amount: Number(e.target.value),
            });
          }
        }}
      />
    </DataCell>
  );
};

const ClearedBox = ({ transaction }: { transaction: Transaction }) => {
  const queryClient = useQueryClient();

  const [value, setValue, resetValue] = useHesitant(transaction.cleared);
  const { mutate } = useMutation({
    mutationFn: ({ cleared }: { cleared: boolean }) =>
      fetch(
        "/backend/update/transaction/?id=" +
          transaction.id +
          "&cleared=" +
          (cleared ? 1 : 0)
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: () => {
      resetValue();
    },
  });

  return (
    <DataCell>
      <input
        type="checkbox"
        checked={value}
        onChange={() => {
          setValue(!value);
          mutate({ cleared: !value });
        }}
      />
    </DataCell>
  );
};

export default TransactionDetails;
