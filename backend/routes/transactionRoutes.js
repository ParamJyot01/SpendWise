import express from 'express'
import Transaction from '../models/Transaction.js'

const router = express.Router()

// GET all transactions
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find()
    res.status(200).json(transactions)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST a new transaction
router.post('/', async (req, res) => {
  try {
    const newTransaction = new Transaction(req.body)
    const savedTransaction = await newTransaction.save()
    res.status(201).json(savedTransaction)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// DELETE a transaction
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Transaction.findByIdAndDelete(req.params.id)
    if (!deleted) {
      return res.status(404).json({ message: 'Transaction not found' })
    }
    res.status(200).json({ message: 'Transaction deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router