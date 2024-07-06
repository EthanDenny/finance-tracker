import {
  Stack,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import Account from "./Account.tsx";

const accounts = ["Spending", "Saving"];

function App() {
  return (
    <Stack paddingX={12} paddingY={6} gap={4}>
      <Tabs colorScheme="blue">
        <TabList>
          {accounts.map((name) => (
            <Tab key={name}>{name}</Tab>
          ))}
        </TabList>
        <TabPanels>
          <TabPanel>
            <Account />
          </TabPanel>
          <TabPanel>
            <Account />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Stack>
  );
}

export default App;
