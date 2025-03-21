const express = require('express');
const router = express.Router();
const axios = require('axios');

// Fetch weather for a location
router.get('/:location', async (req, res) => {
    try {
        const { location } = req.params;
        const apiKey = process.env.OPENWEATHER_API_KEY;
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`
        );
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

module.exports = router;