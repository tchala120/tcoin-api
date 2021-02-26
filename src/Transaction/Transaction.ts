import dayjs from 'dayjs'
import { ITransaction } from '.'

class Transaction implements ITransaction {
  constructor(
    public id: string = id,
    public amount: number = amount,
    public sender: string = sender,
    public recipient: string = recipient,
    public timestamp: number = dayjs().valueOf()
  ) {}
}

export default Transaction
