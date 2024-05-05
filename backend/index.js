const express = require('express');
var cors = require('cors');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

let accounts = [
  {
    "name": "Spending",
    "transactions": [
      {
        "date": "2024-05-05T17:33:07.963Z",
        "payee": "ALDO",
        "type": 1,
        "allocations": [
          {
            "category": "Clothes",
            "amount": 100
          }
        ],
        "amount": 100,
        "memo": "",
        "cleared": false
      },
      {
        "date": "2024-05-05T17:33:07.963Z",
        "payee": "A&W",
        "type": 1,
        "allocations": [
          {
            "category": "Food",
            "amount": 15
          },
          {
            "category": "Girlfriend",
            "amount": 12
          }
        ],
        "amount": 27,
        "memo": "",
        "cleared": false
      }
    ]
  },
  {
    "name": "Savings",
    "transactions": [
      {
        "date": "2024-05-05T17:33:07.963Z",
        "payee": "Google",
        "type": 0,
        "allocations": [
          {
            "category": "Payroll",
            "amount": 1000000
          }
        ],
        "amount": 1000000,
        "memo": "",
        "cleared": false
      }
    ]
  }
];

app.get('/accounts', (request, response) => {
  response.json(accounts);
});
  
app.listen(PORT, () => console.log(`Express server currently running on port ${PORT}`));
