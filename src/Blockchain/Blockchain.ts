import stringify from 'json-stable-stringify'
import { IBlockchain } from '.'
import Block from '../Block'
import Transaction from '../Transaction'
import { generateKeyPair, generateNewHash, signWithPrivateKey, verifySignature } from '../utils/crypto'
import { retreiveData, saveData } from '../utils/db'
import Wallet from '../Wallet'

class Blockchain implements IBlockchain {
  chain: Block[]

  pendingTransactions: Transaction[]

  wallets: Wallet[]

  difficulty: number = 5

  reward: number = 10

  publicKey: string

  private privateKey: string

  private signature: string

  constructor() {
    this.publicKey = generateKeyPair().publicKey

    this.privateKey = generateKeyPair().privateKey

    this.chain = retreiveData().blockchain || []

    this.pendingTransactions = retreiveData().transactions || []

    this.difficulty = retreiveData().difficulty || 5

    this.reward = retreiveData().reward || 10

    this.wallets = retreiveData().wallets || [new Wallet(this.publicKey, 0)]

    this.signature = ''

    if (this.chain.length === 0) this.addNewBlock(this.createGenesisBlock())
  }

  public createNewBlock(index: number, previousHash: string, totalAmount: number, transactions: Transaction[]): Block {
    const newBlock = new Block(index, previousHash, totalAmount, transactions, this.difficulty)

    return newBlock
  }

  public addNewTransaction(amount: number, sender: string, recipient: string): Transaction {
    const newTransaction = this.createNewTransaction(amount, sender, recipient)

    this.pendingTransactions = [...retreiveData().transactions]

    if (this.validateTransaction(newTransaction)) {
      this.pendingTransactions.push(newTransaction)
      saveData({
        blockchain: this.chain,
        transactions: this.pendingTransactions,
        wallets: this.wallets,
        difficulty: this.difficulty,
        reward: this.reward,
      })
    }

    return newTransaction
  }

  public createNewTransaction(amount: number, sender: string, recipient: string): Transaction {
    const newTransaction = new Transaction(amount, sender, recipient)

    return this.signTransaction(newTransaction)
  }

  public signTransaction(transaction: Transaction): Transaction {
    const transactionHash: string = generateNewHash(stringify(transaction))
    const signature: string = signWithPrivateKey(this.privateKey, transactionHash)

    this.signature = signature

    return transaction
  }

  public validateTransaction(transaction: Transaction): boolean {
    const transactionHash: string = generateNewHash(stringify(transaction))

    const isTransactionVerify = verifySignature(transactionHash, this.publicKey, this.signature)

    this.signature = ''

    return isTransactionVerify
  }

  public addNewBlock(block: Block): void {
    this.chain.push(block)

    this.wallets = this.calWalletBalance()

    this.pendingTransactions = [this.createNewTransaction(this.reward, 'System', this.publicKey)]

    saveData({
      blockchain: this.chain,
      transactions: this.pendingTransactions,
      wallets: this.wallets,
      difficulty: this.difficulty,
      reward: this.reward,
    })
  }

  public getLastBlock(): Block {
    return this.chain.slice(-1)[0]
  }

  public mine(): Block {
    if (!this.isChainValid()) throw new Error('This chain is currently not valid.')
    else {
      const lastBlock = this.getLastBlock()

      const transactions: Transaction[] = [...retreiveData().transactions]

      const totalAmount = this.calTotalAmount(transactions)

      const minedBlock = new Block(
        this.getLastIndexOfChain(),
        lastBlock.hash,
        totalAmount,
        transactions,
        this.difficulty
      )

      minedBlock.proofOfWork()

      this.addNewBlock(minedBlock)

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
    return new Block(this.getLastIndexOfChain(), '', 0, [], this.difficulty)
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

  private calWalletBalance = (): Wallet[] => {
    const wallets = this.wallets

    wallets.forEach((wallet) => {
      this.pendingTransactions.forEach((tx) => {
        if (wallet.address === tx.sender) wallet.balance -= tx.amount
        if (wallet.address === tx.recipient) wallet.balance += tx.amount
      })
    })

    return wallets
  }
}

export default Blockchain
