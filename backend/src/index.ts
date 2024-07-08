const express = require("express");
const cors = require("cors");
const db = require("./db");
import { AccountData, TransactionData } from "../../common/types.ts";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/accounts", (req: any, res: any) => {
  db.getAccounts().then((accounts: Object[]) => {
    res.json(accounts);
  });
});
app.post("/create/account", async (req: any, res: any) => {
  db.createAccount(req.body.name);
  res.json();
});
app.post("/delete/account", async (req: any, res: any) => {
  db.deleteAccount(req.body.id);
  res.json();
});

app.get("/balances", (req: any, res: any) => {
  db.getBalances().then((balances: Object[]) => {
    res.json(balances);
  });
});

app.post("/transactions", (req: any, res: any) => {
  if (req.body.id) {
    db.getTransaction(req.body.id).then((transaction: Object) => {
      res.json(transaction);
    });
  } else if (req.body.accountId) {
    db.getAccountTransactions(req.body.accountId).then(
      (transactions: Object[]) => {
        res.json(transactions);
      }
    );
  } else {
    res.json();
  }
});

app.post("/create/transaction", async (req: any, res: any) => {
  db.createTransaction(req.body.accountId);
  res.json();
});

app.post("/update/transaction", (req: any, res: any) => {
  db.updateTransaction(req.body.id, req.body.data);
  res.json();
});

app.post("/delete/transaction", async (req: any, res: any) => {
  db.deleteTransaction(req.body.id);
  res.json();
});

app.listen(PORT, () =>
  console.log(`Express server currently running on port ${PORT}`)
);
