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
import { AccountData } from "./types.ts";
import { useTransactions } from "./hooks.ts";

const accounts: AccountData[] = [
  { id: 0, name: "Spending" },
  { id: 1, name: "Saving" },
];

function App() {
  const [showCleared, setShowCleared] = useState(false);
  const [transactions, transactionCallbacks] = useTransactions();
  const currentIndex = useRef(0);

  return (
    <Stack paddingX={12} paddingY={6} gap={4}>
      <Tabs
        colorScheme="blue"
        onChange={(index) => {
          currentIndex.current = index;
        }}
      >
        <TabList>
          {accounts.map((data) => (
            <Tab key={data.id}>{data.name}</Tab>
          ))}
        </TabList>
        <HStack paddingTop={4} gap={6}>
          <Button
            size="sm"
            colorScheme="blue"
            onClick={() =>
              transactionCallbacks.new(accounts[currentIndex.current].id)
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
          {accounts.map((data) => (
            <TabPanel key={data.id}>
              <Account
                id={data.id}
                transactions={transactions.filter(
                  ({ accountId }) => accountId == data.id
                )}
                transactionCallbacks={transactionCallbacks}
                showCleared={showCleared}
                setShowCleared={setShowCleared}
              />
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Stack>
  );
}

export default App;
