const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const apiLimiter = require('./middlewares/rateLimiter');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiter (applies to all routes)
app.use(apiLimiter);

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/weather', require('./routes/weather'));
app.use('/api/history', require('./routes/history'));

// Error handling (MUST be after routes)
app.use(notFound); // 404 handler
app.use(errorHandler); // Global error handler

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));