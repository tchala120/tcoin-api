import fs from 'fs'
import stringify from 'json-stable-stringify'
import path from 'path'
import Block from '../Block'
import Transaction from '../Transaction'

const dbPath = path.join(__dirname, '../../', 'database/blockchain.json')

const transactionPath = path.join(__dirname, '../../', 'database/transactions.json')

export interface Data {
  blockchain: Block[]
  reward: number
  difficulty: number
}

export interface ITransaction {
  transactions: Transaction[]
}

export const retreiveData = (): Data => {
  const { blockchain, reward, difficulty } = JSON.parse(fs.readFileSync(dbPath, 'utf-8'))

  return { blockchain, reward, difficulty }
}

export const retreiveTransactionsData = (): Transaction[] => {
  const { transactions } = JSON.parse(fs.readFileSync(transactionPath, 'utf-8'))

  return transactions
}

export const saveData = ({ blockchain, difficulty, reward }: Data) => {
  fs.writeFileSync(
    dbPath,
    stringify({
      blockchain,
      difficulty,
      reward,
    })
  )

  console.log('Save data success.')
}

export const saveTransactionData = ({ transactions }: ITransaction) => {
  fs.writeFileSync(
    transactionPath,
    stringify({
      transactions,
    })
  )
}

export const resetData = () => {
  fs.writeFileSync(
    dbPath,
    stringify({
      blockchain: [],
      difficulty: 4,
      reward: 10,
    })
  )
}

export default {
  retreiveData,
  saveData,
  retreiveTransactionsData,
  saveTransactionData,
  resetData,
}
