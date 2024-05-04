import { createContext, useContext, useState } from 'react'
import { Transaction, TransactionType } from "./types.ts"
import { moneyText } from './Helpers.tsx'
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
          <FieldSelector
            getField={
              (transaction: Transaction) =>
                transaction.payee
            }
            setField={
              (transaction: Transaction, payee: string) =>
                transaction.payee = payee
            }
            items={ dropdownContext.payees }
            promptText="Add Payee"
          />
        </td>
        <td>
          {
            transaction.allocations.length == 1 &&
            <FieldSelector
              getField={
                (transaction: Transaction) =>
                  transaction.allocations[0].category
              }
              setField={
                (transaction: Transaction, category: string) =>
                  transaction.allocations[0].category = category
              }
              items={ dropdownContext.categories }
              promptText="Add Payee"
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
              Allocation difference: { moneyText(allocationDifference, true) }
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
          <FieldSelector
              getField={
                (transaction: Transaction) =>
                  getAllocation(transaction).category
              }
              setField={
                (transaction: Transaction, category: string) =>
                  getAllocation(transaction).category = category
              }
              items={ dropdownContext.categories }
              promptText="Add Category"
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

const FieldSelector = ({ getField, setField, items, promptText }: {
  getField: Function
  setField: Function
  items: string[]
  promptText: string
}) => {
  const transactionContext = useContext(TransactionContext)

  const [prevValue, setPrevValue] = useState("")

  if (transactionContext) {
    const { transaction, update } = transactionContext

    return (
      <>
        <select
          value={getField(transaction)}
          onChange={
            e => update((transaction: Transaction) => {
              setPrevValue(getField(transaction))
              setField(transaction, e.target.value)
              return transaction
            })
          }>
          { getField(transaction) === "" ?
              <option></option> :
              ( prevValue !== "" &&
                !items.find(e => e === prevValue) &&
                <option>{prevValue}</option> ) }
          { items.map(payee => <option>{payee}</option>) }
        </select>
        <button
          onClick={ () => {
              const item = prompt(promptText, getField(transaction))
              if (item) {
                update((transaction: Transaction) => {
                  setField(transaction, item)
                  return transaction
                })
              }
          } }
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
