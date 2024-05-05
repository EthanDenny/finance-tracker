import { MouseEventHandler } from "react"
import { Account } from "./Types.ts"
import { getAccountBalance } from "./Helpers.ts"

const AccountButton = ({ account, onClick }: {
  account: Account
  onClick: MouseEventHandler<HTMLButtonElement>
}) => {
  const balance = getAccountBalance(account);
  return (
    <div className="account-button">
      <button onClick={onClick}>{account.name + ": " + (balance < 0 ? "-" : "")  + "$" + Math.abs(balance)}</button>
    </div>
  )
}
  
export default AccountButton
