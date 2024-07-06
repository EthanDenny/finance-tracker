import { useState } from "react";
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Text,
  HStack,
  Input,
  Checkbox,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import MoneyInput from "./MoneyInput.tsx";

interface TransactionProps {
  category: string;
  initialAmount: number;
}
const Transaction = ({ category, initialAmount }: TransactionProps) => {
  const [amount, setAmount] = useState(initialAmount);

  return (
    <Tr>
      <Td>
        <Checkbox colorScheme="blue" borderColor="gray" />
      </Td>
      <Td>
        <Input
          variant="filled"
          placeholder="Category"
          value={category}
          onChange={() => {}}
        />
      </Td>
      <Td>
        <MoneyInput
          placeholder="Inflow"
          amount={amount}
          setAmount={setAmount}
        />
      </Td>
      <Td>
        <MoneyInput
          placeholder="Outflow"
          amount={amount}
          setAmount={setAmount}
        />
      </Td>
    </Tr>
  );
};

const Account = () => {
  return (
    <>
      <Box paddingBottom={4}>
        <Button size="sm" colorScheme="blue">
          <HStack>
            <AddIcon />
            <Text>Add Transaction</Text>
          </HStack>
        </Button>
      </Box>
      <TableContainer>
        <Table size="sm" variant="simple">
          <Thead>
            <Tr>
              <Th>Selected</Th>
              <Th>Category</Th>
              <Th>Inflow</Th>
              <Th>Outflow</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Transaction category="Groceries" initialAmount={100} />
            <Transaction category="Utilities" initialAmount={400} />
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Account;
