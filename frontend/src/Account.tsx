import {
  Center,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TableContainer,
} from "@chakra-ui/react";
import Transaction from "./Transaction.tsx";
import { useAccountTransactions } from "./hooks.ts";

const headings = ["Category", "Memo", "Inflow", "Outflow", "Cleared", "Delete"];

interface AccountProps {
  id: number;
  showCleared: boolean;
}
const Account = ({ id, showCleared }: AccountProps) => {
  const transactions = useAccountTransactions(id);
  if (transactions.error) return "Error";

  return (
    <>
      <TableContainer>
        <Table size="xs" variant="simple">
          <Thead>
            <Tr>
              {headings.map((heading) => (
                <Th key={heading}>
                  <Center>{heading}</Center>
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {!transactions.isPending &&
              transactions.data.map((data) => (
                <Transaction
                  key={data.id}
                  initialData={data}
                  showCleared={showCleared}
                />
              ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Account;
