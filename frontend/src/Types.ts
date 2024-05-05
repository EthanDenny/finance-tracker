import { getAllocationBalance } from "./Helpers.ts"

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
    this.amount = getAllocationBalance(this)
    this.memo = memo
    this.cleared = cleared
  }
}

export class Account {
  name: string
  transactions: Transaction[]

  constructor(
    name: string = "",
    transactions: Transaction[] = []
  ) {
    this.name = name
    this.transactions = transactions
  }
}
