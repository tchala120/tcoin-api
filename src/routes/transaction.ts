import express, { Request, Response } from 'express'
import Blockchain from '../Blockchain'
import Transaction from '../Transaction'
import { retreiveTransactionsData } from '../utils/db'

const tcoin = new Blockchain()
const router = express.Router()

router.get('/', (_: Request, res: Response) => {
  res.json({
    status: 200,
    message: 'Retreive data success',
    data: {
      pendingTransactions: retreiveTransactionsData(),
    },
  })
})

router.post('/', (req: Request, res: Response) => {
  const { amount, sender, recipient }: Transaction = req.body

  const transaction = tcoin.transactionState(amount, sender, recipient)

  res.json({
    status: 200,
    message: 'Retreive data success',
    data: {
      transaction: transaction[0],
      pendingTransactions: transaction,
    },
  })
})

export default router
