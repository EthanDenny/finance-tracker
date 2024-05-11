import { MouseEventHandler } from "react";

const AccountButton = ({
  name,
  balance,
  onClick,
}: {
  name: string;
  balance: number;
  onClick: MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <div className="account-button">
      <button onClick={onClick}>
        {name + ": " + (balance < 0 ? "-" : "") + "$" + Math.abs(balance)}
      </button>
    </div>
  );
};

export default AccountButton;
