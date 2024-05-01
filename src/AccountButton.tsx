import { MouseEventHandler, useMemo } from 'react'
import { Account } from './types.ts'

function AccountButton({ account, onClick }: {
  account: Account
  onClick: MouseEventHandler<HTMLButtonElement>
}) {
  const balance = useMemo(account.getBalance, [account.transactions]);
  return (
    <div className='account-button'>
      <button onClick={onClick}>{account.name + ': ' + (balance < 0 ? '-' : '')  + '$' + Math.abs(balance)}</button>
    </div>
  )
}
  
export default AccountButton
