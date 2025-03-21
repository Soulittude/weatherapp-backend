const express = require('express');
const router = express.Router();
const WeatherSearch = require('../models/WeatherSearch');


const validateHistory = [
    body('location')
        .trim()
        .notEmpty()
        .withMessage('Location is required')
        .escape(),
];

// Save a search to history
// Save search history with validation
router.post('/', validateHistory, async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw createError(400, errors.array()[0].msg);
        }

        const { location } = req.body;
        const search = new WeatherSearch({ location });
        await search.save();
        res.status(201).json(search);
    } catch (err) {
        next(err);
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