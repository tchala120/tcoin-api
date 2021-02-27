import { IWallet } from '.'
import Transaction from '../Transaction'

class Wallet implements IWallet {
  address: string

  balance: number

  histories: Transaction[] = []

  constructor(address: string, balance: number) {
    this.address = address
    this.balance = balance
  }
}

export default Wallet
