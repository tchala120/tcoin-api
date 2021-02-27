export interface ITransaction {
  id: string
  amount: number
  sender: string
  recipient: string
  timestamp: number
}

export { default } from './Transaction'
