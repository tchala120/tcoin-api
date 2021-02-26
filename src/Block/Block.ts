import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import stringify from 'json-stable-stringify'
import Transaction from 'src/Transaction'
import { IBlock } from '.'
dayjs.extend(relativeTime)

class Block implements IBlock {
  constructor(
    public index: number = index,
    public nonce: number = nonce,
    public previousHash: string = previousHash,
    public hash: string = hash,
    public totalAmount: number = totalAmount,
    public transactions: Transaction[] = transactions,
    public timestamp: number = dayjs().valueOf()
  ) {}

  get key() {
    return stringify(this.transactions + this.hash + this.previousHash + this.nonce + this.timestamp)
  }
}

export default Block
