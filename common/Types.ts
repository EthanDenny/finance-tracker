export class Account {
  id: number;
  name: string;

  constructor(id: number, name: string = "") {
    this.id = id;
    this.name = name;
  }
}

export enum TransactionType {
  Inflow,
  Outflow,
}

export class Transaction {
  id: number;
  accountId: number;
  date: string;
  payee: string;
  memo: string;
  type: TransactionType;
  amount: number = 0;
  cleared: boolean;

  constructor(
    id: number,
    accountId: number,
    date: string = "",
    payee: string = "",
    memo: string = "",
    type: TransactionType = TransactionType.Outflow,
    amount: number = 0,
    cleared: boolean = false
  ) {
    this.id = id;
    this.accountId = accountId;
    this.date = date;
    this.payee = payee;
    this.memo = memo;
    this.type = type;
    this.amount = amount;
    this.cleared = cleared;
  }
}

export class Allocation {
  id: number;
  transactionId: number;
  category: string;
  amount: number;

  constructor(
    id: number,
    transactionId: number,
    category: string,
    amount: number
  ) {
    this.id = id;
    this.transactionId = transactionId;
    this.category = category;
    this.amount = amount;
  }
}
