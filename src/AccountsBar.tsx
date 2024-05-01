import { Account } from './types.ts'
import AccountButton from './AccountButton.tsx'

function AccountsBar({ accounts, showAccount }: {
  accounts: Account[]
  showAccount: Function
}) {
  return (
    <div className='accounts-bar'>
      {accounts.map(account => <AccountButton key={account.name} account={account} onClick={() => showAccount(account.name)}/>)}
    </div>
  )
}
  
export default AccountsBar
