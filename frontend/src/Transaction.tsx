import { useMemo, useState } from "react";
import {
  Center,
  Button,
  Tr,
  Td,
  Input,
  IconButton,
  Checkbox,
} from "@chakra-ui/react";
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
  focused: boolean;
  setFocused: () => void;
  clearFocus: () => void;
  showCleared: boolean;
}
const Transaction = ({
  initialData,
  focused,
  setFocused,
  clearFocus,
  showCleared,
}: TransactionProps) => {
  const [deleted, setDeleted] = useState(false);

  const id = initialData.id;
  const requestData = useTransaction(id);

  const data = useMemo(
    () =>
      !requestData.isPending && !requestData.isError && requestData.data
        ? requestData.data
        : initialData,
    [requestData]
  );

  const updateTransaction = useUpdateTransaction(id);
  const deleteTransaction = useDeleteTransaction(id);

  const deleteSelf = () => {
    deleteTransaction();
    setDeleted(true);
  };

  const updateAmount = (amount: number | null, type: TransactionType) => {
    if (amount != null) {
      updateTransaction({ amount: amount, type: type });
    } else if (data.type == type) {
      updateTransaction({ amount: null, type: TransactionType.None });
    }
  };

  const getAmount = (type: TransactionType): number | null =>
    data.type == type ? data.amount : null;

  if (requestData.error) {
    return "Error";
  }

  return (
    !deleted &&
    (showCleared || !data.cleared) && (
      <>
        <Tr>
          <Td>
            <input
              type="date"
              value={data.date.slice(0, 10)}
              onChange={(event) =>
                updateTransaction({ date: event.target.value })
              }
              onFocus={setFocused}
            ></input>
          </Td>
          <Td>
            <Center>
              <Input
                variant="outline"
                placeholder="Payee"
                defaultValue={data.payee}
                onFocus={setFocused}
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
                defaultValue={data.category}
                onFocus={setFocused}
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
                defaultValue={data.memo}
                onFocus={setFocused}
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
                setTransactionFocused={setFocused}
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
                setTransactionFocused={setFocused}
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
                isChecked={data.cleared}
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
        {focused && (
          <Tr>
            <Td></Td>
            <Td></Td>
            <Td></Td>
            <Td></Td>
            <Td></Td>
            <Td></Td>
            <Td>
              <Center>
                <Button colorScheme="blue">Save</Button>
              </Center>
            </Td>
            <Td>
              <Center>
                <Button colorScheme="gray" onClick={clearFocus}>
                  Cancel
                </Button>
              </Center>
            </Td>
          </Tr>
        )}
      </>
    )
  );
};

export default Transaction;
