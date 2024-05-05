import { useEffect, useState } from "react"
import { Account, Transaction } from "./Types.ts"
import DropdownContext from "./DropdownContext.tsx"
import AccountsBar from "./AccountsBar.tsx"
import AccountDetails from "./AccountDetails.tsx"
import "./App.css"

const App = () => {
  const [accounts, updateAccounts]: [Account[], Function] = useState([])

  useEffect(() => {
    fetch("http://localhost:3000/accounts/")
      .then(response => response.json())
      .then(json => {
        const accounts = json.map((account: Account) => {
          account.transactions = account.transactions.map(
            (transaction: Transaction) => {
              transaction.date = new Date(transaction.date)
              return transaction
            }
          )
          return account
        })
        updateAccounts(accounts)
      })
      .catch(() => {
        console.log("Failed to load accounts")
      })
  })

  const updateAccount = (newAccount: Account) => {
    const nextAccounts = accounts.map((account) => {
      return account.name === newAccount.name ? newAccount : account
    })
    updateAccounts(nextAccounts)
  }

  const [selectedIndex, setSelectedIndex]: [number, Function] = useState(0);
  const selectAccount = (selectName: string) => {
    accounts.map(({ name }, i) => {
      if (name === selectName) {
        setSelectedIndex(i)
      }
    })
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
