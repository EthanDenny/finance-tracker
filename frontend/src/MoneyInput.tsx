import { useState } from "react";
import { Input } from "@chakra-ui/react";

const numerals = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

const ValidMoneyValue = (value: string): boolean => {
  let decimalFound = false;
  let centsFound = 0;

  for (let i = 0; i < value.length; i++) {
    const char = value.charAt(i);
    const numeral = numerals.includes(char);
    const decimal = char == ".";

    if (decimal) {
      decimalFound = true;
    } else if (decimalFound) {
      if (decimal) {
        return false;
      } else if (numeral) {
        centsFound++;
        if (centsFound > 2) {
          return false;
        }
      } else {
        return false;
      }
    } else if (!numeral) {
      return false;
    }
  }

  return true;
};

const CreateValidString = (value: string) => {
  let decimalFound = false;
  let centsFound = 0;

  for (let i = 0; i < value.length; i++) {
    const char = value.charAt(i);
    const isNumeral = numerals.includes(char);

    if (char == ".") {
      decimalFound = true;
    } else if (decimalFound && isNumeral) {
      centsFound++;
    }
  }

  value = value.replace(/^0+/, "");

  if (value.charAt(0) == ".") {
    value = "0" + value;
  }

  if (!decimalFound) {
    value += ".";
  }

  for (let i = centsFound; i < 2; i++) {
    value += "0";
  }

  return value;
};

interface MoneyInputProps {
  placeholder: string;
  amount: number;
  setAmount: (amount: number) => void;
  variant?: string;
}
const MoneyInput = ({
  placeholder,
  amount,
  setAmount,
  variant,
}: MoneyInputProps) => {
  const [value, setValue] = useState(CreateValidString(String(amount)));
  const [focused, setFocused] = useState(false);

  return (
    <Input
      variant={variant || "filled"}
      placeholder={placeholder}
      value={amount ? (focused ? value : `$${value}`) : ""}
      onChange={(event) => {
        if (ValidMoneyValue(event.target.value)) {
          setValue(event.target.value);
        }
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => {
        setValue(CreateValidString(value));
        setAmount(Number(value));
        setFocused(false);
      }}
    />
  );
};

export default MoneyInput;
