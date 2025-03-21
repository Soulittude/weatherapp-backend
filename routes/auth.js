const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { body, validationResult } = require("express-validator");

// Register user
router.post(
    "/register",
    [
        body("username").trim().notEmpty().withMessage("Username is required"),
        body("email").isEmail().withMessage("Invalid email"),
        body("password").isLength({ min: 6 }).withMessage("Password must be 6+ characters"),
    ],
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { username, email, password } = req.body;

            // Check if user exists
            const existingUser = await User.findOne({ $or: [{ email }, { username }] });
            if (existingUser) {
                return res.status(400).json({ error: "User already exists" });
            }

            const user = await User.create({ username, email, password });

            // Generate JWT
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRE,
            });

            res.status(201).json({ token });
        } catch (err) {
            next(err);
        }
    }
);

// Login user
router.post(
    "/login",
    [
        body("email").isEmail().withMessage("Invalid email"),
        body("password").notEmpty().withMessage("Password is required"),
    ],
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { email, password } = req.body;

            // Check user exists
            const user = await User.findOne({ email }).select("+password");
            if (!user) {
                return res.status(401).json({ error: "Invalid credentials" });
            }

            // Verify password
            const isMatch = await user.matchPassword(password);
            if (!isMatch) {
                return res.status(401).json({ error: "Invalid credentials" });
            }

            // Generate JWT
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRE,
            });

            res.json({ token });
        } catch (err) {
            next(err);
        }
    }
);

module.exports = router;