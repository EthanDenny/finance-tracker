import { Table, Thead, Tbody, Tr, Th, TableContainer } from "@chakra-ui/react";
import Transaction from "./Transaction.tsx";
import { TransactionData, TransactionCallbacks } from "./types.ts";

interface AccountProps {
  id: number;
  transactions: TransactionData[];
  transactionCallbacks: TransactionCallbacks;
  showCleared: boolean;
  setShowCleared: (showCleared: boolean) => void;
}
const Account = ({
  transactions,
  showCleared,
  transactionCallbacks,
}: AccountProps) => {
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
                    transactionCallbacks.edit(data.id, editData)
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
