const User = require('../models/User');
const Wallet = require('../models/Wallet');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register User
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 2. Hash the password (Security Best Practice)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create the User
    const user = new User({
      username,
      email,
      password: hashedPassword
    });

    // 4. Save User to Database
    await user.save();

    // 5. AUTOMATICALLY Create a Wallet for them (The Fintech Logic)
    const wallet = new Wallet({
      userId: user._id,
      balance: 0 // Start with 0
    });

    await wallet.save();

    res.status(201).json({ message: 'User registered and Wallet created!' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find User
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // 2. Check Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // 3. Generate Token (The "VIP Pass")
    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' } // Token lasts for 1 day
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};