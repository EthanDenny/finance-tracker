import { ReactNode } from "react";
import { Button, Text, HStack } from "@chakra-ui/react";

export const IconTextButton = ({
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
