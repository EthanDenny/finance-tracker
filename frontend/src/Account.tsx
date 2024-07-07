import { Table, Thead, Tbody, Tr, Th, TableContainer } from "@chakra-ui/react";
import Transaction from "./Transaction.tsx";
import { TransactionData } from "../../common/types.ts";
import { useTransactionCallbacks } from "./hooks.ts";

interface AccountProps {
  transactions: TransactionData[];
  showCleared: boolean;
}
const Account = ({ transactions, showCleared }: AccountProps) => {
  const transactionCallbacks = useTransactionCallbacks();

  return (
    <>
      <TableContainer>
        <Table size="sm" variant="simple">
          <Thead>
            <Tr>
              <Th>Category</Th>
              <Th>Memo</Th>
              <Th>Inflow</Th>
              <Th>Outflow</Th>
              <Th>Cleared</Th>
              <Th>Delete</Th>
            </Tr>
          </Thead>
          <Tbody>
            {transactions
              .filter(({ cleared }) => showCleared || !cleared)
              .map((data) => (
                <Transaction
                  key={data.id}
                  data={data}
                  updateData={(editData) =>
                    transactionCallbacks.update({ id: data.id, data: editData })
                  }
                  deleteSelf={() => transactionCallbacks.delete(data.id)}
                />
              ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Account;
