import { useState, useRef, useMemo, ReactNode } from "react";
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
import { Account } from "./Account.tsx";
import { useAccounts, useBalances } from "./hooks.ts";
import { post, backendAddress } from "./utils.ts";

export const App = () => {
  const [showCleared, setShowCleared] = useState(true);

  const accounts = useAccounts();
  if (accounts.error) return "Error";

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
  const getCurrentID = () =>
    accounts.data ? accounts.data[currentIndex.current].id : -1;

  const queryClient = useQueryClient();

  const { mutate: newAccount } = useMutation({
    mutationFn: () =>
      post(`http://${backendAddress}/create/account`, {
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
  });

  const { mutate: deleteAccount } = useMutation({
    mutationFn: (accountId: number) =>
      post(`http://${backendAddress}/delete/account`, {
        id: accountId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["accounts"],
      });
    },
  });

  const { mutate: newTransaction } = useMutation({
    mutationFn: () =>
      post(`http://${backendAddress}/create/transaction`, {
        accountId: getCurrentID(),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["account_transactions", getCurrentID()],
      });
    },
  });

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
            onClick={() => deleteAccount(getCurrentID())}
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

const IconTextButton = ({
  icon,
  text,
  onClick,
}: {
  icon: ReactNode;
  text: string;
  onClick: () => void;
}) => {
  return (
    <Button size="sm" colorScheme="blue" onClick={onClick}>
      <HStack>
        {icon}
        <Text>{text}</Text>
      </HStack>
    </Button>
  );
};
