import express from 'express'
import Budget from '../models/Budget.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(authMiddleware)

// GET all budgets for logged-in user
router.get('/', async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.userId })
    res.status(200).json(budgets)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST a new budget
router.post('/', async (req, res) => {
  try {
    const newBudget = new Budget({
      ...req.body,
      userId: req.userId
    })
    const savedBudget = await newBudget.save()
    res.status(201).json(savedBudget)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// DELETE a budget (only if it belongs to the logged-in user)
router.delete('/:id', async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id)

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' })
    }

    if (budget.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this budget' })
    }

    await Budget.findByIdAndDelete(req.params.id)
    res.status(200).json({ message: 'Budget deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router