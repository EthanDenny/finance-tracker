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

const headings = [
  "Date",
  "Payee",
  "Category",
  "Memo",
  "Inflow",
  "Outflow",
  "Cleared",
  "Delete",
];

interface AccountProps {
  id: number;
  focusedId: number | null;
  setFocusedId: (id: number | null) => void;
  showCleared: boolean;
}
export const Account = ({
  id,
  focusedId,
  setFocusedId,
  showCleared,
}: AccountProps) => {
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
              !transactions.isError &&
              transactions.data.map((data) => (
                <Transaction
                  key={data.id}
                  focused={data.id == focusedId}
                  setFocused={() => setFocusedId(data.id)}
                  clearFocus={() => setFocusedId(null)}
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
