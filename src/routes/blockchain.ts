import express, { Request, Response } from 'express'
import Blockchain from '../Blockchain'

const tcoin = new Blockchain()
const router = express.Router()

router.get('/', (_: Request, res: Response) => {
  res.json({
    status: 200,
    message: 'Retreive data success',
    data: {
      blockchain: tcoin.toChain(),
    },
  })
})

export default router
