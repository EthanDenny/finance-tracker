import { useState, useRef } from "react";
import {
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TableContainer,
  Text,
  HStack,
  Checkbox,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import Transaction from "./Transaction.tsx";
import { TransactionData, TransactionEdit, TransactionType } from "./types.ts";

const initialTransactions: TransactionData[] = [
  {
    id: 0,
    category: "Groceries",
    memo: "",
    amount: 100,
    type: TransactionType.Outflow,
    cleared: false,
  },
  {
    id: 1,
    category: "Utilities",
    memo: "Electricity",
    amount: 400,
    type: TransactionType.Outflow,
    cleared: false,
  },
  {
    id: 2,
    category: "Payroll",
    memo: "",
    amount: 1200,
    type: TransactionType.Inflow,
    cleared: true,
  },
];

const Account = () => {
  const [showCleared, setShowCleared] = useState(false);

  const id = useRef(
    initialTransactions
      .map(({ id }) => id)
      .reduce((e1, e2) => (e1 > e2 ? e1 : e2))
  );

  const nextId = () => {
    id.current++;
    return id.current;
  };

  const [transactions, setTransactions] = useState(initialTransactions);

  const newTransaction = () => {
    const data: TransactionData = {
      id: nextId(),
      category: "",
      memo: "",
      amount: null,
      type: TransactionType.None,
      cleared: false,
    };
    setTransactions([...transactions, data]);
  };

  const editTransaction = (id: number, editData: TransactionEdit) => {
    let newTransactions = [];
    for (let data of transactions) {
      if (data.id == id) {
        newTransactions.push({
          ...data,
          category:
            editData.category != undefined ? editData.category : data.category,
          memo: editData.memo != undefined ? editData.memo : data.memo,
          amount: editData.amount != undefined ? editData.amount : data.amount,
          type: editData.type != undefined ? editData.type : data.type,
          cleared:
            editData.cleared != undefined ? editData.cleared : data.cleared,
        });
      } else {
        newTransactions.push(data);
      }
    }
    setTransactions(newTransactions);
  };

  const deleteTransaction = (id: number) => {
    setTransactions(transactions.filter((data) => data.id != id));
  };

  return (
    <>
      <HStack paddingBottom={4} gap={6}>
        <Button size="sm" colorScheme="blue" onClick={newTransaction}>
          <HStack>
            <AddIcon />
            <Text>Add Transaction</Text>
          </HStack>
        </Button>
        <Checkbox
          colorScheme="blue"
          borderColor="gray"
          isChecked={showCleared}
          onChange={(event) => setShowCleared(event.target.checked)}
        >
          Show cleared
        </Checkbox>
      </HStack>
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
              .filter((data) => showCleared || !data.cleared)
              .map((data) => (
                <Transaction
                  key={data.id}
                  data={data}
                  updateData={(editData) => editTransaction(data.id, editData)}
                  deleteSelf={() => deleteTransaction(data.id)}
                />
              ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Account;
