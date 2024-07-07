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
  db.getAccounts().then((accounts: AccountData[]) => {
    res.json(accounts);
  });
});

app.get("/transactions/", (req: any, res: any) => {
  db.getTransactions().then((transactions: TransactionData[]) => {
    res.json(transactions);
  });
});

app.post("/create/transaction/", async (req: any, res: any) => {
  db.createTransaction(req.body.accountId);
  res.json();
});

app.post("/update/transaction/", (req: any, res: any) => {
  console.log(req.body);
  db.updateTransaction(req.body.id, req.body.data);
  res.json();
});

app.post("/delete/transaction/", async (req: any, res: any) => {
  db.deleteTransaction(req.body.id);
  res.json();
});

app.listen(PORT, () =>
  console.log(`Express server currently running on port ${PORT}`)
);
