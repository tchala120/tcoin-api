import Transaction from '../Transaction'

export interface IWallet {
  address: string
  balance: number
  histories: Transaction[]
}

export { default } from './Wallet'
