const express = require('express');
const router = express.Router();
// Import BOTH functions now
const { register, login } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login); // <--- Added this line

module.exports = router;