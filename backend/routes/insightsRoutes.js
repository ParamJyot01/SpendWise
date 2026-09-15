import express from 'express'
import { GoogleGenerativeAI } from '@google/generative-ai'
import Transaction from '../models/Transaction.js'
import Budget from '../models/Budget.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(authMiddleware)

router.get('/', async (req, res) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' })

    const transactions = await Transaction.find({ userId: req.userId })
    const budgets = await Budget.find({ userId: req.userId })

    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)

    const totalExpense = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)

    const categoryBreakdown = {}
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        categoryBreakdown[t.category] = (categoryBreakdown[t.category] || 0) + t.amount
      })

    const summary = {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      categoryBreakdown,
      budgets: budgets.map((b) => ({ category: b.category, limit: b.limit }))
    }

    const prompt = `You are a friendly personal finance advisor. Based on this user's financial data, give exactly 3 short, practical, specific suggestions to help them manage money better. Keep each suggestion to one sentence. Be encouraging, not preachy.

Financial data:
${JSON.stringify(summary, null, 2)}

Respond with ONLY a JSON array of 3 strings, nothing else, no markdown formatting, no backticks. Example format: ["suggestion 1", "suggestion 2", "suggestion 3"]`

    const result = await model.generateContent(prompt)
    const responseText = result.response.text()

    const cleanedText = responseText.replace(/```json|```/g, '').trim()
    const suggestions = JSON.parse(cleanedText)

    res.status(200).json({ suggestions })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router