const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');

// CRUD operations
router.post('/', walletController.createWallet);
router.get('/:id', walletController.getWallet);
router.put('/:id', walletController.updateWallet);
router.delete('/:id', walletController.deleteWallet);

// Additional operations
router.post('/:id/transfer', walletController.transferCrypto);
router.get('/:id/transactions', walletController.getTransactionHistory);
router.post('/:id/trade', walletController.tradeCrypto);

module.exports = router;

