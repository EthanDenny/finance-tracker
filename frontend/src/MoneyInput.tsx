import { useState } from "react";
import { Input } from "@chakra-ui/react";

const numerals = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

const IsValidMoneyValue = (value: string): boolean => {
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

const CreateStringRepr = (amount: number) => {
  let value = String(amount.toFixed(2));
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
  amount: number | null;
  setAmount: (amount: number | null) => void;
}
const MoneyInput = ({ placeholder, amount, setAmount }: MoneyInputProps) => {
  const [inputValue, setInputValue] = useState("");
  const [focused, setFocused] = useState(false);

  const stringRepr = amount ? CreateStringRepr(amount) : "";

  return (
    <Input
      variant="outline"
      placeholder={placeholder}
      value={focused ? inputValue : `${amount ? "$" : ""}${stringRepr}`}
      onChange={(event) => {
        if (IsValidMoneyValue(event.target.value)) {
          setInputValue(event.target.value);
        }
      }}
      onFocus={() => {
        setInputValue(stringRepr);
        setFocused(true);
      }}
      onBlur={() => {
        if (inputValue == "" || inputValue == ".") {
          setAmount(null);
        } else {
          setAmount(Number(inputValue));
        }
        setFocused(false);
      }}
    />
  );
};

export default MoneyInput;
