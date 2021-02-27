import Transaction from 'src/Transaction'

export interface IBlock {
  index: number
  hash: string
  previousHash: string
  nonce: number
  totalAmount: number
  transactions: Transaction[]
  timestamp: number
  difficulty: number

  proofOfWork(previousHash: string, transactions: Transaction[]): void
}

export { default } from './Block'
