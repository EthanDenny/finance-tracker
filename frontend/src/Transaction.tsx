import { useMemo, useState } from "react";
import { Center, Tr, Td, Input, IconButton, Checkbox } from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { MoneyInput } from "./MoneyInput.tsx";
import { TransactionType } from "../../common/types.ts";
import { TransactionData } from "./types.ts";
import {
  useTransaction,
  useUpdateTransaction,
  useDeleteTransaction,
} from "./hooks.ts";

interface TransactionProps {
  initialData: TransactionData;
  showCleared: boolean;
}
const Transaction = ({ initialData, showCleared }: TransactionProps) => {
  const [deleted, setDeleted] = useState(false);

  const id = initialData.id;
  const requestData = useTransaction(id);
  if (requestData.error) return "Error";

  const data = useMemo(
    () => (!requestData.isPending ? requestData.data : initialData),
    [requestData]
  );

  const updateTransaction = useUpdateTransaction(id);
  const deleteTransaction = useDeleteTransaction(id);

  const deleteSelf = () => {
    deleteTransaction();
    setDeleted(true);
  };

  const updateAmount = (amount: number | null, type: TransactionType) => {
    if (amount) {
      updateTransaction({ amount: amount, type: type });
    } else if (data && data.type == type) {
      updateTransaction({ amount: null, type: TransactionType.None });
    }
  };

  const getAmount = (type: TransactionType): number | null =>
    data && data.type == type ? data.amount : null;

  return (
    !deleted &&
    (showCleared || (data && !data.cleared)) && (
      <Tr>
        <Td>
          <input
            type="date"
            value={data ? data.date.slice(0, 10) : ""}
            onChange={(event) =>
              updateTransaction({ date: event.target.value })
            }
          ></input>
        </Td>
        <Td>
          <Center>
            <Input
              variant="outline"
              placeholder="Payee"
              defaultValue={data ? data.payee : ""}
              onBlur={(event) =>
                updateTransaction({ payee: event.target.value })
              }
            />
          </Center>
        </Td>
        <Td>
          <Center>
            <Input
              variant="outline"
              placeholder="Category"
              defaultValue={data ? data.category : ""}
              onBlur={(event) =>
                updateTransaction({ category: event.target.value })
              }
            />
          </Center>
        </Td>
        <Td>
          <Center>
            <Input
              variant="outline"
              placeholder="Memo"
              defaultValue={data ? data.memo : ""}
              onBlur={(event) =>
                updateTransaction({ memo: event.target.value })
              }
            />
          </Center>
        </Td>
        <Td>
          <Center>
            <MoneyInput
              placeholder="Inflow"
              amount={getAmount(TransactionType.Inflow)}
              setAmount={(amount) =>
                updateAmount(amount, TransactionType.Inflow)
              }
            />
          </Center>
        </Td>
        <Td>
          <Center>
            <MoneyInput
              placeholder="Outflow"
              amount={getAmount(TransactionType.Outflow)}
              setAmount={(amount) =>
                updateAmount(amount, TransactionType.Outflow)
              }
            />
          </Center>
        </Td>
        <Td>
          <Center>
            <Checkbox
              colorScheme="blue"
              isChecked={data ? data.cleared : false}
              onChange={(event) =>
                updateTransaction({ cleared: event.target.checked })
              }
            />
          </Center>
        </Td>
        <Td>
          <Center>
            <IconButton
              aria-label="Delete transaction"
              icon={<DeleteIcon />}
              onClick={() => deleteSelf()}
            />
          </Center>
        </Td>
      </Tr>
    )
  );
};

export default Transaction;
