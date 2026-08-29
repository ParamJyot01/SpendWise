import mongoose from 'mongoose'

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Food', 'Transport', 'Shopping', 'Entertainment', 'Education', 'Bills', 'Health', 'Travel', 'Other']
  },
  type: {
    type: String,
    required: true,
    enum: ['income', 'expense']
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

const Transaction = mongoose.model('Transaction', transactionSchema)

export default Transaction