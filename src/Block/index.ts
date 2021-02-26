import Transaction from 'src/Transaction'

export interface IBlock {
  index: number
  hash: string
  previousHash: string
  nonce: number
  totalAmount: number
  transactions: Transaction[]
  timestamp: number
  key: string
}

export { default } from './Block'
