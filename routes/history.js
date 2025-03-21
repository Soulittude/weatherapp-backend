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
        .matches(/^[a-zA-Z\s]+$/) // Allow letters and spaces
        .withMessage('Location must contain only letters and spaces')
        .escape(),
];

// Save search history (protected + validated)
router.post('/', protect, validateHistory, async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw createError(400, errors.array()[0].msg);
        }

        const { location } = req.body;
        const user = req.user.id;

        // Check if location already exists for this user
        const existingSearch = await WeatherSearch.findOne({ user, location });
        if (existingSearch) {
            throw createError(400, 'Location already exists in your history');
        }

        const search = new WeatherSearch({ location, user });
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