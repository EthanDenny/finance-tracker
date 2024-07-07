CREATE TABLE Accounts (
    ID int NOT NULL AUTO_INCREMENT,
    Name varchar(255) NOT NULL,
    PRIMARY KEY (ID)
);

CREATE TABLE Transactions (
    ID int NOT NULL AUTO_INCREMENT,
    AccountID int NOT NULL,
    Category varchar(255) NOT NULL,
    Memo varchar(255) NOT NULL,
    Amount int,
    Type int NOT NULL,
    Cleared boolean NOT NULL,
    PRIMARY KEY (ID)
);
