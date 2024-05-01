import { useState } from 'react'
import { Account, TransactionType } from './types.ts'
import AccountsBar from './AccountsBar.tsx'
import AccountDetails from './AccountDetails.tsx'
import './App.css'

function App() {
  const accounts: Account[] = [
    new Account('Spending'),
    new Account('Savings')
  ]

  accounts[0].newTransaction(
    'A&W',
    TransactionType.Debit,
    [ { category: 'Food', amount: 15},
      { category: 'Julia', amount: 12 } ]
  )

  const [selectedAccount, setSelectedAccount] = useState(accounts[0].name);

  return (
    <>
      <AccountsBar accounts={accounts} showAccount={(name: string) => setSelectedAccount(name)} />
      <AccountDetails account={accounts.find(({ name }) => name === selectedAccount)} />
    </>
  )
}

export default App
