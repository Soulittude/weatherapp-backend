const express = require('express');
const router = express.Router();
const { param, validationResult } = require('express-validator');
const { getWeather } = require('../controllers/weatherController');
const createError = require('http-errors');

const validateLocation = [
    param('location')
        .trim()
        .notEmpty()
        .withMessage('Location is required')
        .escape(),
];

router.get('/:location', validateLocation, getWeather);

module.exports = router;
