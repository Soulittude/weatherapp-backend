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

/**
 * @swagger
 * tags:
 *   name: History
 *   description: User search history
 */

/**
 * @swagger
 * /api/history:
 *   post:
 *     summary: Save a search to history
 *     tags: [History]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [location]
 *             properties:
 *               location:
 *                 type: string
 *     responses:
 *       201:
 *         description: Search saved
 *       400:
 *         description: Invalid location or duplicate
 *       401:
 *         description: Unauthorized
 */

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

/**
 * @swagger
 * /api/history:
 *   get:
 *     summary: Fetch user's search history
 *     tags: [History]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of recent searches
 *       401:
 *         description: Unauthorized
 */

router.get('/', protect, getHistory);

module.exports = router;