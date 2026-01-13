require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

// Import Routes
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(express.json());

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/wallet', require('./routes/walletRoutes'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));