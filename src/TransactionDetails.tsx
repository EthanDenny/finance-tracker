import { Transaction, TransactionType } from './types.ts'

function TransactionDetails({ transaction }: {
  transaction: Transaction
}) {
  let typeString = transaction.type == TransactionType.Credit ? 'Credit' : 'Debit'

  return (
    <div className='transaction-details'>
      <p>{transaction.payee + ': ' + typeString + ', $' + Math.abs(transaction.getAmount())}</p>
      {transaction.allocations.map(allocation => (
        <p>{'|> ' + allocation.category + ': $' + Math.abs(allocation.amount)}</p>
      ))}
    </div>
  )
}

export default TransactionDetails
