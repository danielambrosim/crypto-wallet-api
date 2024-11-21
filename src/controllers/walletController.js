const Wallet = require('../models/wallet');
const Transaction = require('../models/transaction');

exports.createWallet = async (req, res) => {
  try {
    const { owner } = req.body;
    const newWallet = new Wallet({ owner });
    await newWallet.save();
    res.status(201).json(newWallet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getWallet = async (req, res) => {
  try {
    const wallet = await Wallet.findById(req.params.id);
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }
    res.json(wallet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateWallet = async (req, res) => {
  try {
    const { crypto, amount } = req.body;
    const wallet = await Wallet.findById(req.params.id);
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }
    wallet.balance.set(crypto, (wallet.balance.get(crypto) || 0) + amount);
    await wallet.save();
    res.json(wallet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteWallet = async (req, res) => {
  try {
    const wallet = await Wallet.findByIdAndDelete(req.params.id);
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.transferCrypto = async (req, res) => {
  try {
    const { toWalletId, crypto, amount } = req.body;
    const fromWallet = await Wallet.findById(req.params.id);
    const toWallet = await Wallet.findById(toWalletId);

    if (!fromWallet || !toWallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    if ((fromWallet.balance.get(crypto) || 0) < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    fromWallet.balance.set(crypto, fromWallet.balance.get(crypto) - amount);
    toWallet.balance.set(crypto, (toWallet.balance.get(crypto) || 0) + amount);

    const transaction = new Transaction({
      from: fromWallet._id,
      to: toWallet._id,
      crypto,
      amount,
      action: 'transfer'
    });

    await Promise.all([fromWallet.save(), toWallet.save(), transaction.save()]);

    res.json({ fromWallet, toWallet, transaction });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getTransactionHistory = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      $or: [{ from: req.params.id }, { to: req.params.id }],
    }).sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.tradeCrypto = async (req, res) => {
  try {
    const { action, crypto, amount } = req.body;
    const wallet = await Wallet.findById(req.params.id);

    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    if (action === 'buy') {
      wallet.balance.set(crypto, (wallet.balance.get(crypto) || 0) + amount);
    } else if (action === 'sell') {
      if ((wallet.balance.get(crypto) || 0) < amount) {
        return res.status(400).json({ message: 'Insufficient balance' });
      }
      wallet.balance.set(crypto, wallet.balance.get(crypto) - amount);
    } else {
      return res.status(400).json({ message: 'Invalid action' });
    }

    const transaction = new Transaction({
      walletId: wallet._id,
      action,
      crypto,
      amount,
    });

    await Promise.all([wallet.save(), transaction.save()]);

    res.json({ wallet, transaction });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

