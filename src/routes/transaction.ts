import express, { Request, Response } from 'express'
import Blockchain from '../Blockchain'
import Transaction from '../Transaction'
import { retreiveData } from '../utils/db'

const tcoin = new Blockchain()
const router = express.Router()

router.get('/', (_: Request, res: Response) => {
  res.json({
    status: 200,
    message: 'Retreive data success',
    data: {
      pendingTransactions: retreiveData().transactions,
    },
  })
})

router.post('/', (req: Request, res: Response) => {
  const { amount, sender, recipient }: Transaction = req.body

  const transaction = tcoin.addNewTransaction(amount, sender, recipient)

  const pendingTransactions = tcoin.pendingTransactions

  res.json({
    status: 200,
    message: 'Retreive data success',
    data: {
      transaction,
      pendingTransactions,
    },
  })
})

export default router
