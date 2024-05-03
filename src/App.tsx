import { useState } from "react"
import { Account, Transaction, TransactionType } from "./types.ts"
import DropdownContext from "./DropdownContext.tsx"
import AccountsBar from "./AccountsBar.tsx"
import AccountDetails from "./AccountDetails.tsx"
import "./App.css"

const getInitialAccounts = () => {
  const accounts = [
    new Account("Spending"),
    new Account("Savings")
  ]
  accounts[0].addTransaction(new Transaction(
    new Date(),
    "ALDO",
    TransactionType.Outflow,
    [ { category: "Clothes", amount: 100 } ]
  ))
  accounts[0].addTransaction(new Transaction(
    new Date(),
    "A&W",
    TransactionType.Outflow,
    [ { category: "Food", amount: 15},
      { category: "Girlfriend", amount: 12 } ]
  ))
  accounts[1].addTransaction(new Transaction(
    new Date(),
    "Google",
    TransactionType.Inflow,
    [ { category: "Payroll", amount: 1000000 } ]
  ))

  return accounts
}

const App = () => {
  const [accounts, updateAccounts]: [Account[], Function] = useState(getInitialAccounts())
  const updateAccount = (newAccount: Account) => {
    const nextAccounts = accounts.map((account) => {
      return account.name === newAccount.name ? newAccount : account
    })
    updateAccounts(nextAccounts)
  }

  const [selectedIndex, setSelectedIndex]: [number, Function] = useState(0);
  const selectAccount = (selectName: string) => {
    let index = -1
    accounts.find(({ name }, i) => {
      index = i
      return name === selectName
    })

    if (index !== -1) {
      setSelectedIndex(index)
    }
  }

  let payees: string[] = []
  accounts.map(account => {
    account.transactions.map(transaction => {
      const payee = transaction.payee
      if (payee !== "" && !payees.find(e => e === payee)) {
        payees.push(payee)
      }
    })
  })

  let categories: string[] = []
  accounts.map(account => {
    account.transactions.map(transaction => {
      transaction.allocations.map(allocation => {
        const category = allocation.category
        if (category !== "" && !categories.find(e => e === category)) {
          categories.push(category)
        }
      })
    })
  })
  
  return (
    <>
      {
        accounts.length > 0 &&
        <AccountsBar
          accounts={accounts}
          showAccount={selectAccount}
        />
      }
      {
        accounts[selectedIndex] &&
        <DropdownContext.Provider value={{ payees: payees, categories: categories }}>
          <AccountDetails
          account={accounts[selectedIndex]}
          updateAccount={updateAccount}
        />
        </DropdownContext.Provider>
      }
    </>
  )
}

export default App
