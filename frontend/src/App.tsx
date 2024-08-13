import { useState, useRef, useCallback } from "react";
import {
  Stack,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  HStack,
  Checkbox,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { Account } from "./Account.tsx";
import {
  useAccounts,
  useBalances,
  useTabHeadings,
  useNewAccount,
  useDeleteAccount,
  useNewTransaction,
} from "./hooks.ts";
import { IconTextButton } from "./IconTextButton.tsx";

export const App = () => {
  const [showCleared, setShowCleared] = useState(true);

  const accounts = useAccounts();
  const balances = useBalances();
  const tabHeadings = useTabHeadings(accounts, balances);

  const currentIndex = useRef(0);
  const getCurrentID = useCallback(
    () => (accounts.data ? accounts.data[currentIndex.current].id : -1),
    [accounts.data]
  );

  const newAccount = useNewAccount();
  const deleteCurrentAccount = useDeleteAccount(getCurrentID);
  const newTransaction = useNewTransaction(getCurrentID);

  if (accounts.error || balances.error) {
    return "Error";
  }

  return (
    <Stack paddingX={12} gap={4}>
      <HStack paddingTop={6} gap={6}>
        <IconTextButton
          icon={<AddIcon />}
          text="New Account"
          onClick={() => newAccount()}
        />
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
          <IconTextButton
            icon={<AddIcon />}
            text="Add Transaction"
            onClick={() => accounts.data && newTransaction()}
          />
          <IconTextButton
            icon={<DeleteIcon />}
            text="Delete Account"
            onClick={() => deleteCurrentAccount()}
          />
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
