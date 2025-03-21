const express = require('express');
const router = express.Router();
const WeatherSearch = require('../models/WeatherSearch');

// Save a search to history
router.post('/', async (req, res) => {
    try {
        const { location } = req.body;
        const search = new WeatherSearch({ location });
        await search.save();
        res.status(201).json(search);
    } catch (err) {
        res.status(500).json({ error: 'Failed to save search history' });
    }
});

// Fetch recent search history
router.get('/', async (req, res) => {
    try {
        const history = await WeatherSearch.find().sort({ timestamp: -1 }).limit(5);
        res.json(history);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch history' });
    }
});

module.exports = router;