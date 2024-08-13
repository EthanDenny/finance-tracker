const express = require("express");
const cors = require("cors");
const db = require("./db");
import { Request, Response } from "express";
import { TransactionQueryResult } from "../../common/types.ts";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

interface AccountQueryResult {
  ID: number;
  Name: string;
}
app.get("/accounts", async (req: Request, res: Response) => {
  db.getAccounts().then((accounts: AccountQueryResult[]) => {
    res.json(accounts);
  });
});

app.post("/create/account", async (req: Request, res: Response) => {
  db.createAccount(req.body.name);
  res.json();
});

app.post("/delete/account", async (req: Request, res: Response) => {
  db.deleteAccount(req.body.id);
  res.json();
});

interface BalanceQueryResult {
  AccountID: number;
  Balance: number;
}
app.get("/balances", async (req: Request, res: Response) => {
  db.getBalances().then((balances: BalanceQueryResult[]) => {
    res.json(balances);
  });
});

app.post("/transactions", async (req: Request, res: Response) => {
  if (req.body.id) {
    db.getTransaction(req.body.id).then(
      (transaction: TransactionQueryResult) => {
        res.json(transaction);
      }
    );
  } else if (req.body.accountId) {
    db.getAccountTransactions(req.body.accountId).then(
      (transactions: TransactionQueryResult[]) => {
        res.json(transactions);
      }
    );
  } else {
    res.json();
  }
});

app.post("/create/transaction", async (req: Request, res: Response) => {
  db.createTransaction(req.body.accountId);
  res.json();
});

app.post("/update/transaction", async (req: Request, res: Response) => {
  db.updateTransaction(req.body.id, req.body.data);
  res.json();
});

app.post("/delete/transaction", async (req: Request, res: Response) => {
  db.deleteTransaction(req.body.id);
  res.json();
});

app.listen(PORT, () =>
  console.log(`Express server currently running on port ${PORT}`)
);
