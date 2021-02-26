import Block from '../Block'
import Transaction from '../Transaction'

export interface IBlockchain {
  chain: Block[]
  pendingTransactions: Transaction[]
  difficulty: number
  reward: number
  publicKey: string

  createNewBlock(
    index: number,
    nonce: number,
    previousHash: string,
    hash: string,
    totalAmount: number,
    transactions: Transaction[]
  ): Block
  signTransaction(transaction: Transaction): Transaction
  validateTransaction(transaction: Transaction): boolean
  addNewBlock(block: Block): void
  getLastBlock(): Block

  mine(): Block | boolean

  isChainValid(): boolean
  toChain(): Block[]
}

export { default } from './Blockchain'
