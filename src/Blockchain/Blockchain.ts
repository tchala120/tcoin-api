import stringify from 'json-stable-stringify'
import { BlockParams, IBlockchain, TransactionParams, Wallets } from '.'
import Block from '../Block'
import Transaction from '../Transaction'
import { generateNewHash, signWithPrivateKey, verifySignature } from '../utils/crypto'
import { retreiveData, saveData } from '../utils/db'

class Blockchain implements IBlockchain {
  chain: Block[]

  pendingTransactions: Transaction[]

  difficulty: number = 5

  reward: number = 10

  wallets: Wallets = {}

  publicKey: string = ''

  private signature: string

  constructor() {
    this.chain = retreiveData().blockchain || [this.createGenesisBlock()]
    this.pendingTransactions = retreiveData().transactions || []
    this.difficulty = retreiveData().difficulty || 5
    this.reward = retreiveData().reward || 10
    this.signature = ''
  }

  public createNewBlock({ index, previousHash, totalAmount, transactions }: BlockParams): Block {
    const newBlock = new Block(index, previousHash, totalAmount, transactions, this.difficulty)

    return newBlock
  }

  public addNewTransaction({ amount, recipient, sender }: TransactionParams): Transaction {
    const newTransaction = this.createNewTransaction({ amount, sender, recipient })

    this.pendingTransactions = [...retreiveData().transactions]

    if (this.validateTransaction(newTransaction)) {
      this.pendingTransactions.push(newTransaction)
      saveData({
        blockchain: this.chain,
        transactions: this.pendingTransactions,
        difficulty: this.difficulty,
        reward: this.reward,
      })
    }

    return newTransaction
  }

  public createNewTransaction({ amount, recipient, sender }: TransactionParams): Transaction {
    const newTransaction = new Transaction(amount, sender, recipient)

    return this.signTransaction(newTransaction)
  }

  public signTransaction(transaction: Transaction): Transaction {
    const transactionHash: string = generateNewHash(stringify(transaction))
    const signature: string = signWithPrivateKey(this.wallets[this.publicKey].getPrivateKey(), transactionHash)

    this.signature = signature

    return transaction
  }

  public validateTransaction(transaction: Transaction): boolean {
    const transactionHash: string = generateNewHash(stringify(transaction))

    const isTransactionVerify = verifySignature(transactionHash, this.publicKey, this.signature)

    this.signature = ''

    return isTransactionVerify
  }

  public getLastBlock(): Block {
    return this.chain.slice(-1)[0]
  }

  public mine(): Block {
    if (!this.isChainValid()) throw new Error('This chain is currently not valid.')
    else {
      const lastBlock = this.getLastBlock()

      const totalAmount = this.calTotalAmount(this.pendingTransactions)

      const minedBlock = this.createNewBlock({
        index: this.getLastIndexOfChain(),
        previousHash: lastBlock.hash,
        totalAmount,
        transactions: this.pendingTransactions,
      })

      minedBlock.proofOfWork()

      this.chain.push(minedBlock)

      this.pendingTransactions = [
        this.createNewTransaction({ amount: this.reward, recipient: 'System', sender: 'test' }),
      ]

      saveData({
        blockchain: this.chain,
        transactions: this.pendingTransactions,
        difficulty: this.difficulty,
        reward: this.reward,
      })

      return minedBlock
    }
  }

  public isChainValid(): boolean {
    let isValid = true

    if (this.chain.length > 0)
      for (let index = 1; index < this.chain.length; index++) {
        const currentBlock = this.chain[index]
        const previousBlock = this.chain[index - 1]

        if (
          currentBlock.hash !==
            generateNewHash(
              stringify({
                nonce: currentBlock.nonce,
                previousHash: currentBlock.previousHash,
                transactions: currentBlock.transactions,
              })
            ) ||
          currentBlock.previousHash !== previousBlock.hash
        ) {
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
    return this.createNewBlock({
      index: this.getLastIndexOfChain(),
      previousHash: '',
      totalAmount: 0,
      transactions: [],
    })
  }

  private getLastIndexOfChain(): number {
    return this.chain.length
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
