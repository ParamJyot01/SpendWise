import express from 'express'
import Transaction from '../models/Transaction.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(authMiddleware)

// GET all transactions (only for logged-in user)
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.userId })
    res.status(200).json(transactions)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST a new transaction
router.post('/', async (req, res) => {
  try {
    const newTransaction = new Transaction({
      ...req.body,
      userId: req.userId
    })
    const savedTransaction = await newTransaction.save()
    res.status(201).json(savedTransaction)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// DELETE a transaction (only if it belongs to the logged-in user)
router.delete('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' })
    }

    if (transaction.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this transaction' })
    }

    await Transaction.findByIdAndDelete(req.params.id)
    res.status(200).json({ message: 'Transaction deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ... (GET, POST, DELETE routes stay exactly as they are above) ...

// UPDATE a transaction (only if it belongs to the logged-in user)
router.put('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' })
    }

    if (transaction.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to edit this transaction' })
    }

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    res.status(200).json(updatedTransaction)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

export default router