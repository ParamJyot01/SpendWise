import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import transactionRoutes from './routes/transactionRoutes.js'

dotenv.config()

const app = express()
const PORT = 5000

app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err))

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' })
})

app.use('/api/transactions', transactionRoutes)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})