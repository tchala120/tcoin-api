import fs from 'fs'
import stringify from 'json-stable-stringify'
import path from 'path'
import Block from '../Block'
import Transaction from '../Transaction'

const dbPath = path.join(__dirname, '../../', 'database.json')

export interface Data {
  blockchain: Block[]
  transactions: Transaction[]
  reward: number
  difficulty: number
}

export interface ITransaction {
  transactions: Transaction[]
}

export const retreiveData = (): Data => {
  const { blockchain, reward, difficulty, transactions }: Data = JSON.parse(fs.readFileSync(dbPath, 'utf-8'))

  return { blockchain, reward, difficulty, transactions }
}

export const saveData = ({ blockchain, transactions, difficulty, reward }: Data) => {
  fs.writeFileSync(
    dbPath,
    stringify({
      blockchain,
      transactions,
      difficulty,
      reward,
    })
  )

  console.log('Save data success.')
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
  resetData,
}
