const express = require("express");
const cors = require("cors");
const db = require("./db");
import { Account, Allocation, Transaction } from "../common/Types.ts";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

app.get("/accounts", (req: any, res: any) => {
  db.getAccounts().then((accounts: Account[]) => {
    res.json(accounts);
  });
});

app.get("/transactions/", (req: any, res: any) => {
  db.getTransactions().then((transactions: Transaction[]) => {
    res.json(transactions);
  });
});

app.get("/allocations/", (req: any, res: any) => {
  db.getAllocations().then((allocations: Allocation[]) => {
    res.json(allocations);
  });
});

app.get("/update/transaction/", (req: any, res: any) => {
  db.updateTransaction(req.query.id, req.query);
  res.json();
});

app.get("/update/allocation/", (req: any, res: any) => {
  db.updateAllocation(req.query.id, req.query);
  res.json();
});

app.get("/create/account/", (req: any, res: any) => {
  db.createAccount(req.query.name);
  res.json();
});

app.get("/create/transaction/", (req: any, res: any) => {
  db.createTransaction(req.query.accountId);
  res.json();
});

app.listen(PORT, () =>
  console.log(`Express server currently running on port ${PORT}`)
);
