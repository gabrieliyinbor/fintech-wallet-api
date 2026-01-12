const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['DEPOSIT', 'TRANSFER'], // We only allow these two types
    required: true
  },
  status: {
    type: String,
    enum: ['SUCCESS', 'FAILED', 'PENDING'],
    default: 'PENDING'
  }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);