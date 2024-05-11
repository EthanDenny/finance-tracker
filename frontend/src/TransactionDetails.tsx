import { useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DataContext } from "./DataContext.ts";
import { useHesitant } from "./Helpers.ts";
import {
  Allocation,
  Transaction,
  TransactionType,
} from "../../common/Types.ts";

const TransactionDetails = ({ selectedId }: { selectedId: number }) => {
  const { transactions, allocations } = useContext(DataContext);
  const selectedTransaction = transactions.find(({ id }) => id === selectedId);
  const selectedAllocations = allocations.filter(
    ({ transactionId }) => transactionId === selectedId
  );

  return (
    selectedTransaction && (
      <>
        <TransactionEntry
          transaction={selectedTransaction}
          allocations={selectedAllocations}
        />
        {selectedAllocations.length > 1 &&
          selectedAllocations.map((allocation) => (
            <AllocationEntry key={allocation.id} allocation={allocation} />
          ))}
      </>
    )
  );
};

const TransactionEntry = ({
  transaction,
  allocations,
}: {
  transaction: Transaction;
  allocations: Allocation[];
}) => {
  return (
    <tr className="transaction-entry">
      <td>
        <DateInput transaction={transaction} />
      </td>
      <td>
        <PayeeInput transaction={transaction} />
      </td>
      <td>
        {allocations.length === 1 && (
          <CategoryInput allocation={allocations[0]} />
        )}
      </td>
      <td>
        <MemoInput transaction={transaction} />
      </td>
      <td>
        <TypeSelector transaction={transaction} />
      </td>
      <td>
        {allocations.length === 1 ? (
          <AmountInput transaction={transaction} allocation={allocations[0]} />
        ) : (
          <AmountInput transaction={transaction} allocation={null} />
        )}
      </td>
      <td>
        <ClearedBox transaction={transaction} />
      </td>
    </tr>
  );
};

const AllocationEntry = ({ allocation }: { allocation: Allocation }) => {
  return (
    <tr className="allocation-entry">
      <td></td>
      <td></td>
      <td>
        <CategoryInput allocation={allocation} />
      </td>
      <td></td>
      <td></td>
      <td>
        <AmountInput transaction={null} allocation={allocation} />
      </td>
      <td></td>
    </tr>
  );
};

const DateInput = ({ transaction }: { transaction: Transaction }) => {
  const queryClient = useQueryClient();

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
    <input
      type="date"
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
        mutate({ date: e.target.value.slice(0, 10) });
      }}
    />
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
    <input
      className="input-text"
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
        mutate({ payee: e.target.value });
      }}
    />
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
    <input
      className="input-text"
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
        mutate({ category: e.target.value });
      }}
    />
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
    <input
      className="input-text"
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
        mutate({ memo: e.target.value });
      }}
    />
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
    <input
      type="checkbox"
      checked={value}
      onChange={() => {
        setValue(!value);
        mutate({ cleared: !value });
      }}
    />
  );
};

export default TransactionDetails;
