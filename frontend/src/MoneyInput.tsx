import { useState, useMemo } from "react";
import { Input } from "@chakra-ui/react";

const numerals = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

const isValidMoneyValue = (value: string): boolean => {
  let decimalFound = false;
  let centsFound = 0;

  for (let i = 0; i < value.length; i++) {
    const char = value.charAt(i);
    const numeral = numerals.includes(char);
    const decimal = char == ".";

    if (decimal) {
      if (decimalFound) {
        return false;
      }
      decimalFound = true;
    } else if (decimalFound) {
      if (numeral) {
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

interface MoneyInputProps {
  placeholder: string;
  amount: number | null;
  setTransactionFocused: () => void;
  setAmount: (amount: number | null) => void;
}
export const MoneyInput = ({
  placeholder,
  amount,
  setTransactionFocused,
  setAmount,
}: MoneyInputProps) => {
  const [inputValue, setInputValue] = useState("");
  const [focused, setFocused] = useState(false);

  const stringRepr = useMemo(
    () => (amount != null ? String(amount.toFixed(2)) : ""),
    [amount]
  );

  return (
    <Input
      variant="outline"
      placeholder={placeholder}
      value={focused ? inputValue : (amount ? "$" : "") + stringRepr}
      onChange={(event) => {
        if (isValidMoneyValue(event.target.value)) {
          setInputValue(event.target.value);
        }
      }}
      onFocus={() => {
        setInputValue(stringRepr);
        setTransactionFocused();
        setFocused(true);
      }}
      onBlur={() => {
        setAmount(
          inputValue != "" && inputValue != "." ? Number(inputValue) : null
        );
        setFocused(false);
      }}
    />
  );
};
