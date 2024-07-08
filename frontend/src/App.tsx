import { useState, useRef, useMemo } from "react";
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
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Account from "./Account.tsx";
import { useAccounts, useBalances, accountQueryKey } from "./hooks.ts";
import { post } from "./utils.ts";

const App = () => {
  const [showCleared, setShowCleared] = useState(true);

  const accounts = useAccounts();
  if (accounts.error) return "Error";

  console.log(accounts);

  const balances = useBalances();
  if (balances.error) return "Error";

  const tabHeadings = useMemo(() => {
    if (accounts.isPending) {
      return [];
    }

    if (balances.isPending) {
      return accounts.data.map(({ id, name }) => {
        return { id, heading: name };
      });
    }

    return accounts.data.map(({ id, name }) => {
      const balance = balances.data.get(id);
      return {
        id,
        heading: `${name}: ${
          balance ? (balance < 0 ? "-" : "") : ""
        }$${Math.abs(balance ?? 0).toFixed(2)}`,
      };
    });
  }, [accounts, balances]);

  const currentIndex = useRef(0);
  const getCurrentID = () => accounts.data[currentIndex.current].id;

  const queryClient = useQueryClient();

  const newAccount = useMutation({
    mutationFn: () =>
      post(`http://localhost:3000/create/account`, {
        name: prompt("Account Name"),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["accounts"],
      });
      queryClient.invalidateQueries({
        queryKey: ["balances"],
      });
    },
  }).mutate;

  const deleteAccount = useMutation({
    mutationFn: (accountId: number) =>
      post(`http://localhost:3000/delete/account`, { id: accountId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["accounts"],
      });
    },
  }).mutate;

  const newTransaction = useMutation({
    mutationFn: () =>
      post(`http://localhost:3000/create/transaction`, {
        accountId: getCurrentID(),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [accountQueryKey(getCurrentID())],
      });
    },
  }).mutate;

  return (
    <Stack paddingX={12} gap={4}>
      <HStack paddingTop={6} gap={6}>
        <Button size="sm" colorScheme="blue" onClick={() => newAccount()}>
          <HStack>
            <AddIcon />
            <Text>New Account</Text>
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
      <Tabs
        colorScheme="blue"
        onChange={(index) => {
          currentIndex.current = index;
        }}
      >
        <TabList>
          {tabHeadings.map(({ id, heading }) => (
            <Tab key={id}>{heading}</Tab>
          ))}
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
          <Button
            size="sm"
            colorScheme="blue"
            onClick={() => deleteAccount(getCurrentID())}
          >
            <HStack>
              <DeleteIcon />
              <Text>Delete Account</Text>
            </HStack>
          </Button>
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
