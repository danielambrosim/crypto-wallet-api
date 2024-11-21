const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wallet',
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wallet',
  },
  walletId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wallet',
  },
  action: {
    type: String,
    enum: ['transfer', 'buy', 'sell'],
    required: true,
  },
  crypto: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);

