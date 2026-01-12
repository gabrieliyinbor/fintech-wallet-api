const mongoose = require('mongoose');

const WalletSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // This connects to the "User" model
    ref: 'User', // The exact name of the model we just created
    required: true
  },
  balance: {
    type: Number,
    default: 0 // Everyone starts with 0
  },
  currency: {
    type: String,
    default: 'NGN' // Nigerian Naira
  }
}, { timestamps: true });

module.exports = mongoose.model('Wallet', WalletSchema);