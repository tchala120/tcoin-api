import dayjs from 'dayjs'
import { ITransaction } from '.'
import { generateNewUUID } from '../utils/crypto'

class Transaction implements ITransaction {
  id: string

  amount: number

  sender: string

  recipient: string

  timestamp: number

  constructor(amount: number, sender: string, recipient: string) {
    this.id = generateNewUUID()
    this.amount = amount
    this.sender = sender
    this.recipient = recipient
    this.timestamp = dayjs().valueOf()
  }
}

export default Transaction
