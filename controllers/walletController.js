const Wallet = require('../models/Wallet');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

// TRANSFER MONEY
exports.transferMoney = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction(); // Start a "Safety Box" (Atomic Transaction)

  try {
    const { amount, receiverEmail, description } = req.body;
    const senderId = req.user.id; // Comes from the logged-in token

    // 1. Find Sender's Wallet
    const senderWallet = await Wallet.findOne({ userId: senderId }).session(session);
    
    if (senderWallet.balance < amount) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Insufficient funds' });
    }

    // 2. Find Receiver
    const receiverUser = await User.findOne({ email: receiverEmail }).session(session);
    if (!receiverUser) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Receiver not found' });
    }

    const receiverWallet = await Wallet.findOne({ userId: receiverUser._id }).session(session);

    // 3. MOVING THE MONEY (The Atomic Swap)
    
    // Deduct from Sender
    senderWallet.balance -= amount;
    await senderWallet.save({ session });

    // Add to Receiver
    receiverWallet.balance += amount;
    await receiverWallet.save({ session });

    // 4. Create Receipts (Two transactions: Debit for Sender, Credit for Receiver)
    const reference = 'TRX-' + Date.now();

    await Transaction.create([{
      userId: senderId,
      type: 'debit',
      amount: amount,
      description: `Transfer to ${receiverEmail}: ${description}`,
      reference: reference
    }], { session });

    await Transaction.create([{
      userId: receiverUser._id,
      type: 'credit',
      amount: amount,
      description: `Received from ${req.user.email}: ${description}`,
      reference: reference
    }], { session });

    // 5. Commit (Save everything)
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: 'Transfer successful', reference });

  } catch (error) {
    await session.abortTransaction(); // If ANYTHING fails, undo everything
    session.endSession();
    res.status(500).json({ message: 'Transfer failed', error: error.message });
  }
};