import { Account } from './types.ts'
import TransactionDetails from './TransactionDetails.tsx'

function AccountDetails({ account }: {
  account: Account | undefined
}) {
  return (
    <div className='account-details'>
      {account && account.transactions.map((t, i) => <TransactionDetails key={i} transaction={t} />)}
    </div>
  )
}
  
export default AccountDetails
