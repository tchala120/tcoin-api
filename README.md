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

- Create directory with name `database`
- Create 2 file inside `database` directory with names `blockchain.json` and `transactions.json` with empty object `{}`

**Start Project**

```bash
npm start

# Listening on port 3000...
```

**API Endpoint**

- /blockchain - Route for check all blocks data.
- /transactions - Route for make new transaction and get all pending transactions in lists.
- /mine - Route for mining.
