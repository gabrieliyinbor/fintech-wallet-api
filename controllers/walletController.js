const mongoose = require('mongoose');
const Wallet = require('../models/Wallet');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// TRANSFER MONEY
exports.transferMoney = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { amount, receiverEmail, description } = req.body;
    const senderId = req.user.id;

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

    // 3. MOVING THE MONEY
    senderWallet.balance -= amount;
    await senderWallet.save({ session });

    receiverWallet.balance += amount;
    await receiverWallet.save({ session });

    // 4. Create Receipts (Uniqueness Fix: Adding -DB and -CR)
    const baseRef = 'TRX-' + Date.now();

    await Transaction.create([{
      userId: senderId,
      type: 'debit',
      amount: amount,
      description: `Transfer to ${receiverEmail}: ${description}`,
      reference: baseRef + '-DB' // <--- Added -DB to make it unique
    }], { session });

    await Transaction.create([{
      userId: receiverUser._id,
      type: 'credit',
      amount: amount,
      description: `Received from ${req.user.email}: ${description}`,
      reference: baseRef + '-CR' // <--- Added -CR to make it unique
    }], { session });

    // 5. Commit
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: 'Transfer successful', reference: baseRef });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: 'Transfer failed', error: error.message });
  }
};