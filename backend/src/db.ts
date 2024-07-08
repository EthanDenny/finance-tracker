import { TransactionEdit } from "../../common/types.ts";

const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "main",
  port: 3306,
});

const query = async (query: string) => {
  let [rows, _] = await pool.execute(query);
  return rows;
};

export const getAccounts = async () => {
  return await query("SELECT * FROM Accounts");
};

export const getBalances = async () => {
  return await query(
    `SELECT AccountID, SUM(CASE WHEN Type = 1 THEN Amount WHEN Type = 2 THEN -Amount ELSE 0 END) AS Balance FROM Transactions GROUP BY AccountID;`
  );
};

export const getAccountTransactions = async (accountId: number) => {
  return await query(
    `SELECT * FROM Transactions WHERE AccountID = ${accountId} ORDER BY CreationTime DESC`
  );
};

export const createAccount = async (name: string) => {
  return await query(`INSERT INTO Accounts (Name) VALUES ("${name}")`);
};

export const deleteAccount = async (id: number) => {
  return await query(`DELETE FROM Accounts WHERE ID = ${id}`);
};

export const getTransaction = async (id: number) => {
  return await query(`SELECT * FROM Transactions WHERE Id = ${id}`);
};

export const createTransaction = async (accountId: number) => {
  return await query(
    `INSERT INTO Transactions (AccountId, CreationTime, Date, Payee, Category, Memo, Amount, Type, Cleared) VALUES (${accountId}, NOW(), CURDATE(), "", "", "", NULL, 0, 0)`
  );
};

export const updateTransaction = async (id: number, data: TransactionEdit) => {
  let sql_query = "UPDATE Transactions SET";

  if (data.date !== undefined) {
    sql_query += ` Date = "${data.date}",`;
  }
  if (data.payee !== undefined) {
    sql_query += ` Payee = "${data.payee}",`;
  }
  if (data.category !== undefined) {
    sql_query += ` Category = "${data.category}",`;
  }
  if (data.memo !== undefined) {
    sql_query += ` Memo = "${data.memo}",`;
  }
  if (data.type !== undefined) {
    sql_query += ` Type = ${data.type},`;
  }
  if (data.amount !== undefined) {
    sql_query += ` Amount = ${data.amount ? data.amount : "NULL"},`;
  }
  if (data.cleared !== undefined) {
    sql_query += ` Cleared = ${data.cleared ? 1 : 0},`;
  }

  sql_query = sql_query.slice(0, sql_query.length - 1) + ` WHERE Id = ${id}`;

  return await query(sql_query);
};

export const deleteTransaction = async (id: number) => {
  return await query(`DELETE FROM Transactions WHERE Id = ${id}`);
};
