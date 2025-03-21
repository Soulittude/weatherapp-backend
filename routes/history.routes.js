const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator'); // Add this
const { protect } = require('../middlewares/auth');
const { addHistory, getHistory } = require('../controllers/historyController');

const validateHistory = [
    body('location')
        .trim()
        .notEmpty()
        .withMessage('Location is required')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Location must contain only letters and spaces')
        .escape(),
];

// Add validation check middleware
router.post(
    '/',
    protect,
    validateHistory,
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    addHistory
);

router.get('/', protect, getHistory);

module.exports = router;