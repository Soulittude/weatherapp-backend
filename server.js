const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); // Updated path
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB(); // Cleaner and reusable

// Routes
app.use('/api/weather', require('./routes/weather'));
app.use('/api/history', require('./routes/history'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));