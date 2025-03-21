const express = require('express');
const connectDB = require('./config/db');

const cors = require('cors');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const apiLimiter = require('./middlewares/rateLimiter');

const swaggerUI = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const auth = require('./routes/auth.routes'); // Add this line
const history = require('./routes/history.routes'); // Add this line
const weather = require('./routes/weather.routes'); // Add this line

const axios = require('axios');


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

// JSON Parsing Check
app.use(express.json({ strict: true })); // Reject non-JSON requests
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError) {
    res.status(400).json({ error: "Invalid JSON syntax" });
  } else {
    next();
  }
});

// Routes
app.use("/api/auth", auth); // Add this line
app.use("/api/weather", weather);
app.use("/api/history", history);

// Error handling (MUST be after routes)
app.use(notFound); // 404 handler
app.use(errorHandler); // Global error handler

//Docs
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Check OpenWeatherMap API health on startup
const testWeatherAPI = async () => {
  try {
    const testLocation = 'London';
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${testLocation}&appid=${process.env.OPENWEATHER_API_KEY}`
    );
    console.log('Weather API is active ✅');
  } catch (err) {
    console.error('Weather API connection failed ❌:', err.message);
  }
};

testWeatherAPI(); // Call the health check