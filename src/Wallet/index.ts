import Transaction from '../Transaction'

export interface IWallet {
  address: string
  balance: number
  histories: Transaction[]

  getPrivateKey(): string
}

export { default } from './Wallet'
