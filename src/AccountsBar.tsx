import { Account, sumArray } from "./types.ts"
import AccountButton from "./AccountButton.tsx"

const AccountsBar = ({ accounts, showAccount }: {
  accounts: Account[]
  showAccount: Function
}) => {
  return (
    <div className="accounts-bar">
      <center><h3>Balance: ${sumArray(accounts.map(account => account.getBalance()))}</h3></center>
      {accounts.map(account => <AccountButton key={account.name} account={account} onClick={() => showAccount(account.name)}/>)}
    </div>
  )
}
  
export default AccountsBar
