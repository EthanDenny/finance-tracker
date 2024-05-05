import { Account, Transaction, TransactionType } from "./Types.ts"

export const moneyText = (amount: number, showPositive: boolean) => {
  return (amount < 0 ? '-' : (showPositive ? '+' : '')) + '$' + Math.abs(amount)
}

export const sumArray = (nums: number[]) => {
  return nums.reduce((a, v) => a + v, 0)
}

export const getAccountBalance = (account: Account): number => {
  return sumArray(
    account.transactions.map((transaction) =>
      transaction.type == TransactionType.Inflow ? transaction.amount : -transaction.amount
  ))
}

export const getAllocationBalance = (transaction: Transaction) => {
  return sumArray(transaction.allocations.map(({ amount }) => amount))
}

export const insertNewTransaction = (account: Account) => {
  account.transactions = [
    new Transaction(),
    ...account.transactions
  ]
}
