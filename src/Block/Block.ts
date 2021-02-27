import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import stringify from 'json-stable-stringify'
import Transaction from 'src/Transaction'
import { IBlock } from '.'
import { generateNewHash } from '../utils/crypto'
dayjs.extend(relativeTime)

class Block implements IBlock {
  index: number

  nonce: number

  previousHash: string

  hash: string

  totalAmount: number

  transactions: Transaction[]

  timestamp: number

  difficulty: number

  constructor(
    index: number,
    previousHash: string,
    totalAmount: number,
    transactions: Transaction[],
    difficulty: number
  ) {
    this.index = index
    this.nonce = 0
    this.previousHash = previousHash
    this.hash = generateNewHash(stringify({ nonce: 0, previousHash, transactions }))
    this.totalAmount = totalAmount
    this.transactions = transactions
    this.timestamp = dayjs().valueOf()
    this.difficulty = difficulty
  }

  public proofOfWork(): void {
    while (!this.hash.startsWith('0'.repeat(this.difficulty))) {
      this.nonce++
      this.hash = generateNewHash(
        stringify({ nonce: this.nonce, previousHash: this.previousHash, transactions: this.transactions })
      )
    }
  }
}

export default Block
