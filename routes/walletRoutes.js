const express = require('express');
const router = express.Router();
const { transferMoney } = require('../controllers/walletController');
const auth = require('../middleware/authMiddleware');

// Route: POST /api/wallet/transfer
// Protection: Private (Only logged in users)
router.post('/transfer', auth, transferMoney);

module.exports = router;