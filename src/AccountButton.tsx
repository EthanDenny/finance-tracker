import { MouseEventHandler } from "react"
import { Account } from "./types.ts"

const AccountButton = ({ account, onClick }: {
  account: Account
  onClick: MouseEventHandler<HTMLButtonElement>
}) => {
  const balance = account.getBalance();
  return (
    <div className="account-button">
      <button onClick={onClick}>{account.name + ": " + (balance < 0 ? "-" : "")  + "$" + Math.abs(balance)}</button>
    </div>
  )
}
  
export default AccountButton
