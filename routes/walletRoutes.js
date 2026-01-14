const express = require('express');
const router = express.Router();
const { transferMoney, getWallet } = require('../controllers/walletController'); // <--- Updated import
const auth = require('../middleware/authMiddleware');

// Route: GET /api/wallet
// Desc: Get current user's balance
router.get('/', auth, getWallet); // <--- New Route

// Route: POST /api/wallet/transfer
// Desc: Transfer money
router.post('/transfer', auth, transferMoney);

module.exports = router;