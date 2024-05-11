const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "mysql",
  port: 3306,
});

const query = async (query) => {
  let [rows, _] = await pool.execute(query);
  return rows;
};

module.exports = {
  getAccounts: async () => {
    return await query("SELECT * FROM Accounts");
  },
  getTransactions: async () => {
    return await query("SELECT * FROM Transactions");
  },
  getAllocations: async () => {
    return await query("SELECT * FROM Allocations");
  },
  updateTransaction: async (id, fields) => {
    if (fields.date) {
      await query(
        'UPDATE Transactions SET Date = "' + fields.date + '" WHERE Id = ' + id
      );
    }
    if (fields.payee) {
      await query(
        "UPDATE Transactions SET Payee = " + fields.payee + " WHERE Id = " + id
      );
    }
    if (fields.category) {
      await query(
        "UPDATE Transactions SET Category = " +
          fields.category +
          " WHERE Id = " +
          id
      );
    }
    if (fields.memo) {
      await query(
        "UPDATE Transactions SET Memo = " + fields.memo + " WHERE Id = " + id
      );
    }
    if (fields.type) {
      await query(
        'UPDATE Transactions SET Type = "' +
          fields.type.toUpperCase() +
          '" WHERE Id = ' +
          id
      );
    }
    if (fields.amount) {
      await query(
        "UPDATE Transactions SET Amount = " +
          fields.amount +
          " WHERE Id = " +
          id
      );
    }
    if (fields.cleared) {
      await query(
        "UPDATE Transactions SET Cleared = " +
          fields.cleared +
          " WHERE Id = " +
          id
      );
    }
  },
  updateAllocation: async (id, fields) => {
    if (fields.category) {
      await query(
        "UPDATE Allocations SET Category = " +
          fields.category +
          " WHERE Id = " +
          id
      );
    }
    if (fields.amount) {
      await query(
        "UPDATE Allocations SET Amount = " + fields.amount + " WHERE Id = " + id
      );
    }
  },
  createAccount: async (name) => {
    await query("INSERT INTO Accounts (Name) VALUES (" + name + ")");
  },
  createTransaction: async (accountId) => {
    await query(
      "INSERT INTO Transactions (AccountId, Date, Payee, Type, Amount, Memo, Cleared) VALUES (" +
        accountId +
        ', "' +
        new Date().toISOString().slice(0, 10) +
        '", "", "OUTFLOW", 0, "", 0)'
    );
  },
};
