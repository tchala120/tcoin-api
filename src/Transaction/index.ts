export interface ITransaction {
  amount: number
  sender: string
  recipient: string
  timestamp: number
}

export { default } from './Transaction'
