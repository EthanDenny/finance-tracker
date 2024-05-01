const sumArray = (nums: number[]) => {
  return nums.reduce((a, v) => a + v, 0)
}

type Payee = string
type Category = string

type Allocation = {
  category: Category,
  amount: number
}

export enum TransactionType {
  Credit,
  Debit
}

export class Transaction {
  payee: Payee
  type: TransactionType
  allocations: Allocation[]

  constructor(
    payee: Payee,
    type: TransactionType,
    allocations: Allocation[]
  ) {
    this.payee = payee
    this.type = type
    this.allocations = allocations
  }

  getAmount = () => {
    const sum = sumArray(this.allocations.map(({ amount }) => amount))
    return this.type == TransactionType.Credit ? sum : -sum
  }
}

export class Account {
  name: string
  transactions: Transaction[]

  constructor(
    name: string = '',
    transactions: Transaction[] = []
  ) {
    this.name = name
    this.transactions = transactions
  }

  newTransaction = (payee: Payee, type: TransactionType, allocations: Allocation[]) => {
    this.transactions.push(new Transaction(payee, type, allocations));
  }

  addTransaction = (transaction: Transaction) => {
    this.transactions.push(transaction);
  }

  getBalance = (): number => {
    return sumArray(this.transactions.map((transaction) => transaction.getAmount()))
  }
}
