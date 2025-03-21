const express = require('express');
const router = express.Router();
const axios = require('axios');
const { param, validationResult } = require('express-validator');

// Validate location input
const validateLocation = [
    param('location')
        .trim()
        .notEmpty()
        .withMessage('Location is required')
        .escape(),
];

// Fetch weather with validation
router.get('/:location', validateLocation, async (req, res, next) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw createError(400, errors.array()[0].msg);
        }

        const { location } = req.params;
        const apiKey = process.env.OPENWEATHER_API_KEY;
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`
        );

        res.json(response.data);
    } catch (err) {
        next(err); // Pass errors to errorHandler
    }
});

module.exports = router;