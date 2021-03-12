import Block from '../Block'
import Transaction from '../Transaction'
import { IWallet } from '../Wallet'

export interface BlockParams {
  index: number
  previousHash: string
  totalAmount: number
  transactions: Transaction[]
}

export interface TransactionParams {
  amount: number
  sender: string
  recipient: string
}

export interface Wallets {
  [key: string]: IWallet
}

export interface IBlockchain {
  chain: Block[]
  pendingTransactions: Transaction[]

  difficulty: number
  reward: number
  wallets: Wallets

  createNewBlock(params: BlockParams): Block
  signTransaction(transaction: Transaction): Transaction
  validateTransaction(transaction: Transaction): boolean
  getLastBlock(): Block

  addNewTransaction(params: TransactionParams): Transaction
  createNewTransaction(params: TransactionParams): Transaction

  mine(): Block | boolean

  isChainValid(): boolean
  toChain(): Block[]
}

export { default } from './Blockchain'
