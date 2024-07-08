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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Account from "./Account.tsx";
import { useAccounts, accountQueryKey } from "./hooks.ts";
import { post } from "./utils.ts";

const App = () => {
  const [showCleared, setShowCleared] = useState(true);

  const accounts = useAccounts();
  if (accounts.error) return "Error";

  const currentIndex = useRef(0);
  const getCurrentID = () => accounts.data[currentIndex.current].id;

  const queryClient = useQueryClient();
  const newTransaction = useMutation({
    mutationFn: () =>
      post(`http://localhost:3000/create/transaction/`, {
        accountId: getCurrentID(),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [accountQueryKey(getCurrentID())],
      });
    },
  }).mutate;

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
            onClick={() => accounts.data && newTransaction()}
          >
            <HStack>
              <AddIcon />
              <Text>Add Transaction</Text>
            </HStack>
          </Button>
          <Checkbox
            colorScheme="blue"
            isChecked={showCleared}
            onChange={(event) => setShowCleared(event.target.checked)}
          >
            Show cleared
          </Checkbox>
        </HStack>
        <TabPanels>
          {!accounts.isPending &&
            accounts.data.map((data) => (
              <TabPanel key={data.id}>
                <Account id={data.id} showCleared={showCleared} />
              </TabPanel>
            ))}
        </TabPanels>
      </Tabs>
    </Stack>
  );
};

export default App;
