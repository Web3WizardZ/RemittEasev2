const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  currency: { type: String, required: true },
  walletAddress: { type: String, required: true, unique: true },
  walletSeed: { type: String, required: true },
  transactions: [
    {
      transactionId: String,
      type: String, // 'deposit' or 'withdraw'
      amount: Number,
      date: { type: Date, default: Date.now }
    }
  ],
  passwordHash: { type: String },
});

module.exports = mongoose.model('User', UserSchema);
