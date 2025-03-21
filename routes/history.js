const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const createError = require('http-errors'); // Ensure this is imported
const WeatherSearch = require('../models/WeatherSearch');
const { protect } = require('../middlewares/auth'); // Add JWT protection

// Validation middleware for location input
const validateHistory = [
    body('location')
        .trim()
        .notEmpty()
        .withMessage('Location is required')
        .escape(),
];

// Save search history (protected + validated)
router.post('/', protect, validateHistory, async (req, res, next) => {
    try {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw createError(400, errors.array()[0].msg);
        }

        const location = req.body.toLowerCase();
        const search = new WeatherSearch({
            location,
            user: req.user.id, // Associate with authenticated user
        });
        await search.save();
        res.status(201).json(search);
    } catch (err) {
        next(err);
    }
});

// Fetch user-specific history (protected)
router.get('/', protect, async (req, res, next) => {
    try {
        const history = await WeatherSearch.find({ user: req.user.id }) // Only user's history
            .sort({ timestamp: -1 })
            .limit(5);
        res.json(history);
    } catch (err) {
        next(err); // Use centralized error handling
    }
});

module.exports = router;