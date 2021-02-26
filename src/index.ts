import express, { Request, Response } from 'express'

import transactionRouter from './routes/transaction'
import mineRouter from './routes/mine'
import blockchainRouter from './routes/blockchain'

const app = express()

app.use(express.json())

app.use('/transaction', transactionRouter)
app.use('/mine', mineRouter)
app.use('/blockchain', blockchainRouter)

app.get('/', (_: Request, res: Response) => {
  res.json({
    status: 200,
    message: 'Hello world',
  })
})

const port = process.env.PORT || 3000

app.listen(port, () => console.log(`Listening on port ${port}...`))
