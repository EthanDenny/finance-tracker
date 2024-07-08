CREATE TABLE Accounts (
    ID INT NOT NULL AUTO_INCREMENT,
    Name VARCHAR(255) NOT NULL,
    PRIMARY KEY (ID)
);

CREATE TABLE Transactions (
    ID INT NOT NULL AUTO_INCREMENT,
    AccountID INT NOT NULL,
    CreationTime DATETIME NOT NULL,
    Date DATE NOT NULL,
    Payee VARCHAR(255) NOT NULL,
    Category VARCHAR(255) NOT NULL,
    Memo VARCHAR(255) NOT NULL,
    Amount FLOAT,
    Type INT NOT NULL,
    Cleared BOOLEAN NOT NULL,
    PRIMARY KEY (ID)
);
