import { createContext, useContext, useState } from 'react'
import { Transaction, TransactionType } from "./types.ts"
import DropdownContext from "./DropdownContext.tsx"

type TransactionContextObject = {
  transaction: Transaction
  update: Function
}

const TransactionContext = createContext<TransactionContextObject | undefined>(undefined)

const TransactionDetails = ({ transaction, update }: {
  transaction: Transaction
  update: Function
}) => {
  const submitUpdate = (getNew: Function) => {
    update(getNew(transaction))
  }

  return (
    <TransactionContext.Provider value={{
      transaction: transaction,
      update: submitUpdate
    }}>
      <TransactionMain />
      {
        transaction.allocations.length > 1 &&
        transaction.allocations.map((_, i) => 
          <TransactionSplit
            getAllocation={(transaction: Transaction) => transaction.allocations[i]}
          />)
      }
    </TransactionContext.Provider>
  )
}

const TransactionMain = () => {
  const transactionContext = useContext(TransactionContext)
  const dropdownContext = useContext(DropdownContext)

  if (transactionContext && dropdownContext) {
    const { transaction, update } = transactionContext
    const allocationDifference = transaction.amount - transaction.allocationBalance()
  
    return (
      <tr className="transaction-main">
        <td>
          <input
            type="date"
            value={transaction.date.toISOString().slice(0, 10)}
            onChange={
              e => update((transaction: Transaction) => {
                transaction.date = new Date(e.target.value)
                return transaction
              })
            }
          />
        </td>
        <td>
          <select
            value={transaction.payee}
            id="payees"
            onChange={
              e => update((transaction: Transaction) => {
                transaction.payee = e.target.value
                return transaction
              })
            }>
            { transaction.payee === "" && <option></option> }
            { dropdownContext.payees.map(payee => <option>{payee}</option>) }
          </select>
          <button
            onClick={
              () => {
                const payee = prompt("Add Payee", transaction.payee)
                if (payee) {
                  update((transaction: Transaction) => {
                    transaction.payee = payee
                    return transaction
                  })
                }
              }
            }>+</button>
        </td>
        <td>
          {
            transaction.allocations.length == 1 &&
            <CategorySelector
              getAllocation={(transaction: Transaction) => transaction.allocations[0]}
            />
          }
        </td>
        <td>
          <input
            className="input-text"
            value={transaction.memo}
            onChange={
              e => update((transaction: Transaction) => {
                transaction.memo = e.target.value
                return transaction
              })
            }
          />
        </td>
        <td>
          <TypeSelector />
        </td>
        <td>
          $
          <input type="number"
            value={transaction.amount}
            onChange={
              e => update((transaction: Transaction) => {
                transaction.amount = Number(e.target.value)
                if (transaction.allocations.length == 1) {
                  transaction.allocations[0].amount = transaction.amount
                }
                return transaction
              })
            }
          />
          {
            transaction.allocations.length > 1 &&
            allocationDifference != 0 &&
            <div>
              Allocation difference: {
                (allocationDifference < 0 ? '-' : '+') + '$' + Math.abs(allocationDifference)
              }
            </div>
          }
        </td>
        <td>
          <input
            type="checkbox"
            checked={transaction.cleared}
            onChange={
              () => update((transaction: Transaction) => {
                transaction.cleared = !transaction.cleared
                return transaction
              })
            }
          />
        </td>
      </tr>
    )
  }
}

const TransactionSplit = ({ getAllocation }: {
  getAllocation: Function
}) => {
  const transactionContext = useContext(TransactionContext)
  const dropdownContext = useContext(DropdownContext)

  if (transactionContext && dropdownContext) {
    const { transaction, update } = transactionContext

    return (
      <tr className="transaction-split">
        <td></td>
        <td></td>
        <td>
          <CategorySelector
            getAllocation={getAllocation}
          />
        </td>
        <td></td>
        <td></td>
        <td>
          $
          <input type="number"
            value={getAllocation(transaction).amount}
            onChange={
              e => update((transaction: Transaction) => {
                getAllocation(transaction).amount = Number(e.target.value)
                return transaction
              })
            }
          />
        </td>
        <td></td>
      </tr>
    )
  }
}

const CategorySelector = ({ getAllocation } : {
  getAllocation: Function
}) => {
  const transactionContext = useContext(TransactionContext)
  const dropdownContext = useContext(DropdownContext)

  const [prevValue, setPrevValue] = useState(null)

  if (transactionContext && dropdownContext) {
    const { transaction, update } = transactionContext

    return (
      <>
        <select
          value={getAllocation(transaction).category}
          onChange={
            e => update((transaction: Transaction) => {
              setPrevValue(getAllocation(transaction).category)
              getAllocation(transaction).category = e.target.value
              return transaction
            })
          }>
          { getAllocation(transaction).category === "" ?
              <option></option> :
              ( prevValue &&
                !dropdownContext.categories.find(e => e === prevValue) &&
                <option>{prevValue}</option> ) }
          { dropdownContext.categories.map(category => <option>{category}</option>) }
        </select>
        <button
          onClick={
            () => {
              const category = prompt("Add Category", getAllocation(transaction).category)
              if (category) {
                update((transaction: Transaction) => {
                  getAllocation(transaction).category = category
                  return transaction
                })}}}
        >+</button>
      </>
    )
  }
}

const TypeSelector = () => {
  const transactionContext = useContext(TransactionContext)

  if (transactionContext) {
    const { transaction, update } = transactionContext
    
    return (
      <select
        value={
          transaction.type === TransactionType.Outflow ? "Outflow" : "Inflow"
        }
        onChange={
          e => update((transaction: Transaction) => {
            transaction.type = e.target.value === "Outflow" ?
              TransactionType.Outflow : TransactionType.Inflow
            return transaction
          })
        }>
        <option>Outflow</option>
        <option>Inflow</option>
      </select>
    )
  }
}

export default TransactionDetails
