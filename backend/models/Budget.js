import mongoose from 'mongoose'

const budgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Food', 'Transport', 'Shopping', 'Entertainment', 'Education', 'Bills', 'Health', 'Travel', 'Other']
  },
  limit: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
})

const Budget = mongoose.model('Budget', budgetSchema)

export default Budget