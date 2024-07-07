import { useState, useRef } from "react";
import {
  Stack,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Button,
  Text,
  HStack,
  Checkbox,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import Account from "./Account.tsx";
import {
  useAccounts,
  useTransactions,
  useTransactionCallbacks,
} from "./hooks.ts";

const App = () => {
  const [showCleared, setShowCleared] = useState(false);
  const currentIndex = useRef(0);

  const accounts = useAccounts();
  const transactions = useTransactions();

  if (accounts.error || transactions.error) return "Error";

  const transactionCallbacks = useTransactionCallbacks();

  const getCurrentId = () => accounts.data[currentIndex.current].id;

  return (
    <Stack paddingX={12} paddingY={6} gap={4}>
      <Tabs
        colorScheme="blue"
        onChange={(index) => {
          currentIndex.current = index;
        }}
      >
        <TabList>
          {accounts.data &&
            accounts.data.map((data) => <Tab key={data.id}>{data.name}</Tab>)}
        </TabList>
        <HStack paddingTop={4} gap={6}>
          <Button
            size="sm"
            colorScheme="blue"
            onClick={() =>
              accounts.data && transactionCallbacks.create(getCurrentId())
            }
          >
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
        <TabPanels>
          {!accounts.isPending &&
            !transactions.isPending &&
            accounts.data.map((data) => (
              <TabPanel key={data.id}>
                <Account
                  transactions={transactions.data.filter(
                    ({ accountId }) => accountId == data.id
                  )}
                  showCleared={showCleared}
                />
              </TabPanel>
            ))}
        </TabPanels>
      </Tabs>
    </Stack>
  );
};

export default App;
