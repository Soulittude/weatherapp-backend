const jwt = require('jsonwebtoken');
const User = require('../models/User');
const createError = require('http-errors');

exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        // Existing user check
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) throw createError(400, 'User already exists');

        const user = await User.create({ username, email, password });
        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE,
        });

        res.status(201).json({ token });
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');
        if (!user) throw createError(401, 'Invalid credentials');

        const isMatch = await user.matchPassword(password);
        if (!isMatch) throw createError(401, 'Invalid credentials');

        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE,
        });

        res.json({ token });
    } catch (err) {
        next(err);
    }
};