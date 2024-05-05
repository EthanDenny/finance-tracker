import { Account, Transaction } from "./Types.ts"
import { insertNewTransaction } from "./Helpers.ts"
import TransactionDetails from "./TransactionDetails.tsx"

const AccountDetails = ({ account, updateAccount }: {
  account: Account
  updateAccount: Function
}) => {
  const addTransaction = () => {
    insertNewTransaction(account)
    updateAccount(account)
  }

  return (
    <div className="account-details">
      <h1 style={{ marginLeft: "20px" }}>{account && account.name}</h1>
      <button onClick={addTransaction}>+ Add Transaction</button>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Payee</th>
            <th>Category</th>
            <th>Memo</th>
            <th>Type</th>
            <th>Amount</th>
            <th>(C)</th>
          </tr>
        </thead>
        <tbody>
          {
            account &&
            account.transactions.map((t, i) =>
              <TransactionDetails
                key={i}
                transaction={t}
                update={(transaction: Transaction) => {
                  account.transactions[i] = transaction;
                  updateAccount(account)
                }}
              />
            )
          }
        </tbody>
      </table>
    </div>
  )
}
  
export default AccountDetails
