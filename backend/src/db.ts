import { TransactionEdit, TransactionType } from "../../common/types.ts";

const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "main",
  port: 3306,
});

const query = async (query: any) => {
  let [rows, _] = await pool.execute(query);
  return rows;
};

module.exports = {
  getAccounts: async () => {
    return await query("SELECT * FROM Accounts");
  },
  getBalances: async () => {
    return await query(
      `SELECT AccountID, SUM(CASE WHEN Type = 1 THEN Amount WHEN Type = 2 THEN -Amount ELSE 0 END) AS Balance FROM Transactions GROUP BY AccountID;`
    );
  },
  getAccountTransactions: async (accountId: number) => {
    return await query(
      `SELECT * FROM Transactions WHERE AccountID = ${accountId} ORDER BY CreationTime DESC`
    );
  },
  getTransaction: async (id: number) => {
    return await query(`SELECT * FROM Transactions WHERE Id = ${id}`);
  },
  createTransaction: async (accountId: number) => {
    const { insertId } = await query(
      `INSERT INTO Transactions (AccountId, CreationTime, Date, Payee, Category, Memo, Amount, Type, Cleared) VALUES (${accountId}, NOW(), CURDATE(), "", "", "", NULL, 0, 0)`
    );
    return insertId;
  },
  updateTransaction: async (id: number, data: TransactionEdit) => {
    let sql_query = "UPDATE Transactions SET";

    console.log(data);

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

    console.log(sql_query);

    await query(sql_query);
  },
  deleteTransaction: async (id: number) => {
    await query(`DELETE FROM Transactions WHERE Id = ${id}`);
  },
};