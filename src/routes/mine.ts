import express, { Request, Response } from 'express'
import Blockchain from '../Blockchain'

const tcoin = new Blockchain()
const router = express.Router()

router.post('/', (_: Request, res: Response) => {
  const minedBlock = tcoin.mine()

  if (!minedBlock) {
    res.json({
      status: 500,
      message: 'Mined failed',
      data: {
        block: null,
        blockchain: tcoin.toChain(),
      },
    })
  } else {
    res.json({
      status: 200,
      message: 'Mined data',
      data: {
        block: minedBlock,
        blockchain: tcoin.toChain(),
      },
    })
  }
})

export default router
