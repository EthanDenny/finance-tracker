import { Tr, Td, Input, IconButton, Checkbox } from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import MoneyInput from "./MoneyInput.tsx";
import {
  TransactionData,
  TransactionEdit,
  TransactionType,
} from "../../common/types.ts";

interface TransactionProps {
  data: TransactionData;
  updateData: (data: TransactionEdit) => void;
  deleteSelf: () => void;
}
const Transaction = ({ data, updateData, deleteSelf }: TransactionProps) => {
  const updateAmount = (amount: number | null, type: TransactionType) => {
    if (amount) {
      updateData({ amount: amount, type: type });
    } else if (data.type == type) {
      updateData({ amount: null, type: TransactionType.None });
    }
  };

  const getAmount = (type: TransactionType): number | null =>
    data.type == type ? data.amount : null;

  return (
    <Tr>
      <Td>
        <Input
          variant="filled"
          placeholder="Category"
          value={data.category}
          onChange={(event) => updateData({ category: event.target.value })}
        />
      </Td>
      <Td>
        <Input
          variant="filled"
          placeholder="Memo"
          value={data.memo}
          onChange={(event) => updateData({ memo: event.target.value })}
        />
      </Td>
      <Td>
        <MoneyInput
          placeholder="Inflow"
          amount={getAmount(TransactionType.Inflow)}
          setAmount={(amount) => updateAmount(amount, TransactionType.Inflow)}
        />
      </Td>
      <Td>
        <MoneyInput
          placeholder="Outflow"
          amount={getAmount(TransactionType.Outflow)}
          setAmount={(amount) => updateAmount(amount, TransactionType.Outflow)}
        />
      </Td>
      <Td>
        <Checkbox
          colorScheme="blue"
          borderColor="gray"
          isChecked={data.cleared}
          onChange={(event) => updateData({ cleared: event.target.checked })}
        />
      </Td>
      <Td>
        <IconButton
          aria-label="Delete transaction"
          icon={<DeleteIcon />}
          onClick={deleteSelf}
        />
      </Td>
    </Tr>
  );
};

export default Transaction;
