# A Simple Blockchain

A simple blockchain with an api for make new transaction or mining 😊

# Setup project

**Clone Project**

```bash
git clone https://github.com/tchala120/simple-blockchain.git
cd simple-blockchain
```

**Install Dependencies**

```bash
npm install
```

**Create mock Database**

- Create file with name `database.json`

```json
// database.json
{
  "blockchain": [],
  "transactions": [],
  "wallets": [],
  "difficulty": 5,
  "reward": 10
}
```

**Start Project**

```bash
npm start

# Listening on port 3000...
```

**API Endpoint**

- /blockchain - Route for check all blocks data.
- /transactions - Route for make new transaction and get all pending transactions in lists.
- /mine - Route for mining.
