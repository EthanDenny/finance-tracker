export const sumArray = (nums: number[]) => {
  return nums.reduce((a, v) => a + v, 0)
}

type Payee = string
type Category = string

export type Allocation = {
  category: Category,
  amount: number
}

export enum TransactionType {
  Inflow,
  Outflow
}

export class Transaction {
  date: Date
  payee: Payee
  type: TransactionType
  allocations: Allocation[]
  amount: number = 0
  memo: string
  cleared: boolean

  constructor(
    date: Date = new Date(),
    payee: Payee = "",
    type: TransactionType = TransactionType.Outflow,
    allocations: Allocation[] = [ { category: "", amount: 0 } ],
    memo: string = "",
    cleared: boolean = false
  ) {
    this.date = date
    this.payee = payee
    this.type = type
    this.allocations = allocations
    this.amount = this.allocationBalance()
    this.memo = memo
    this.cleared = cleared
  }

  allocationBalance = () => {
    return sumArray(this.allocations.map(({ amount }) => amount))
  }
}

export class Account {
  name: string
  transactions: Transaction[]

  constructor(
    name: string = "",
  ) {
    this.name = name
    this.transactions = []
  }

  newTransaction = () => {
    this.transactions = [
      new Transaction(),
      ...this.transactions
    ]
  }

  addTransaction = (transaction: Transaction) => {
    this.transactions.push(transaction)
  }

  getBalance = (): number => {
    return sumArray(
      this.transactions.map((transaction) =>
        transaction.type == TransactionType.Inflow ? transaction.amount : -transaction.amount
    ))
  }
}
