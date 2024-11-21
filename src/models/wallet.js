const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  owner: {
    type: String,
    required: true,
  },
  balance: {
    type: Map,
    of: Number,
    default: {},
  },
}, { timestamps: true });

module.exports = mongoose.model('Wallet', walletSchema);

