import { IWallet } from '.'
import Transaction from '../Transaction'
import { getPrivateKeyWithPublicKey } from '../utils/crypto'

class Wallet implements IWallet {
  address: string

  balance: number

  histories: Transaction[] = []

  constructor(address: string) {
    this.address = address
    this.balance = this.calTotalWalletBalance()
  }

  public getPrivateKey() {
    return getPrivateKeyWithPublicKey(this.address)
  }

  private calTotalWalletBalance(): number {
    const transactions = this.histories

    let balance = 0

    if (transactions.length === 0) return balance

    transactions.forEach((tx) => {
      if (this.address === tx.sender) balance -= tx.amount
      if (this.address === tx.recipient) balance += tx.amount
    })

    return balance
  }
}

export default Wallet
