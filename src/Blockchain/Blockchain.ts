import stringify from 'json-stable-stringify'
import { IBlockchain } from '.'
import Block from '../Block'
import Transaction from '../Transaction'
import { generateKeyPair, generateNewHash, generateNewUUID, signWithPrivateKey, verifySignature } from '../utils/crypto'
import { resetData, retreiveData, retreiveTransactionsData, saveData, saveTransactionData } from '../utils/db'

class Blockchain implements IBlockchain {
  chain: Block[]

  pendingTransactions: Transaction[]

  difficulty: number = 5

  reward: number = 10

  publicKey: string

  private privateKey: string

  private currentSignature: Buffer

  constructor() {
    this.chain = retreiveData().blockchain || []
    this.difficulty = retreiveData().difficulty || 4
    this.reward = retreiveData().reward || 10
    this.pendingTransactions = retreiveTransactionsData() || []

    this.publicKey = generateKeyPair().publicKey
    this.privateKey = generateKeyPair().privateKey

    this.currentSignature = Buffer.from('')

    if (this.chain.length === 0) this.addNewBlock(this.createGenesisBlock())
  }

  public createNewBlock(
    index: number,
    nonce: number,
    previousHash: string,
    hash: string,
    totalAmount: number,
    transactions: Transaction[]
  ): Block {
    const newBlock = new Block(index, nonce, previousHash, hash, totalAmount, transactions)

    return newBlock
  }

  public transactionState(amount: number, sender: string, recipient: string): Transaction[] {
    const coinbaseTransaction: Transaction = this.signTransaction(this.createNewTransaction(amount, sender, recipient))

    this.pendingTransactions = [coinbaseTransaction, ...retreiveTransactionsData()]

    saveTransactionData({ transactions: this.pendingTransactions })

    return this.pendingTransactions
  }

  public createNewTransaction(amount: number, sender: string, recipient: string): Transaction {
    const newTransaction = new Transaction(generateNewUUID(), amount, sender, recipient)

    return {
      ...newTransaction,
    }
  }

  public signTransaction(transaction: Transaction): Transaction {
    const transactionHash: Buffer = Buffer.from(generateNewHash(stringify(transaction)))
    const signature: Buffer = signWithPrivateKey(this.privateKey, transactionHash)

    this.currentSignature = signature

    return transaction
  }

  public validateTransaction(transaction: Transaction): boolean {
    const transactionHash: Buffer = Buffer.from(generateNewHash(stringify(transaction)))

    const isTransactionVerify = verifySignature(transactionHash, transaction.sender, this.currentSignature)

    this.currentSignature = Buffer.from('')

    return isTransactionVerify
  }

  public addNewBlock(block: Block): void {
    this.chain.push(block)
  }

  public getLastBlock(): Block {
    return this.chain.slice(-1)[0]
  }

  public mine(): Block | boolean {
    if (this.isChainValid()) {
      const blockchain = retreiveData().blockchain || []

      const coinbaseTransaction: Transaction = this.signTransaction(
        this.createNewTransaction(this.reward, this.publicKey, this.publicKey)
      )

      const transactions: Transaction[] = [coinbaseTransaction, ...retreiveTransactionsData()]
      const lastBlock: Block = this.getLastBlock()
      const nonce = this.proofOfWork(lastBlock.hash, transactions)
      const blockHash = generateNewHash(
        stringify({
          nonce,
          previousHash: lastBlock.hash,
          transactions,
        })
      )

      const totalAmount = this.calTotalAmount(transactions)

      const minedBlock: Block = this.createNewBlock(
        this.getLastIndexOfChain(),
        nonce,
        lastBlock.hash,
        blockHash,
        totalAmount,
        transactions
      )

      this.addNewBlock(minedBlock)

      blockchain.push(minedBlock)

      saveData({ blockchain, difficulty: this.difficulty, reward: this.reward })

      this.pendingTransactions = []

      saveTransactionData({ transactions: [] })

      return minedBlock
    } else {
      console.log('This chain is currenly not valid, reset now...')
      resetData()

      this.chain = []

      return false
    }
  }

  public isChainValid(): boolean {
    let isValid = true

    if (this.chain.length > 0)
      for (let index = 1; index < this.chain.length; index++) {
        const currentBlock = this.chain[index]
        const previousBlock = this.chain[index - 1]

        if (currentBlock.previousHash !== previousBlock.hash) {
          isValid = false
          break
        }
      }

    return isValid
  }

  public toChain(): Block[] {
    return this.chain
  }

  private createGenesisBlock(): Block {
    return new Block(this.getLastIndexOfChain(), 0, '', '', 0, [])
  }

  private getLastIndexOfChain(): number {
    return this.chain.length
  }

  private proofOfWork(previousHash: string, transactions: Transaction[]): number {
    let nonce = 0

    let currentHash = generateNewHash(stringify({ nonce, previousHash, transactions }))

    while (!currentHash.startsWith('0'.repeat(this.difficulty))) {
      nonce++
      currentHash = generateNewHash(stringify({ nonce, previousHash, transactions }))
    }

    return nonce
  }

  private calTotalAmount = (transactions: Transaction[]) => {
    let total = 0

    transactions.forEach((transaction) => {
      total += transaction.amount
    })

    return total
  }
}

export default Blockchain
