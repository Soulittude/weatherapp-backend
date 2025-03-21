const express = require('express');
const router = express.Router();
const { param, validationResult } = require('express-validator');
const { getWeather } = require('../controllers/weatherController');

const validateLocation = [
    param('location')
        .trim()
        .notEmpty()
        .withMessage('Location is required')
        .escape(),
];

/**
 * @swagger
 * tags:
 *   name: Weather
 *   description: Weather data
 */

/**
 * @swagger
 * /api/weather/{location}:
 *   get:
 *     summary: Get weather for a location
 *     tags: [Weather]
 *     parameters:
 *       - in: path
 *         name: location
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Weather data
 *       400:
 *         description: Invalid location
 *       404:
 *         description: Location not found
 */

router.get(
    '/:location',
    validateLocation,
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    getWeather
);

module.exports = router;
