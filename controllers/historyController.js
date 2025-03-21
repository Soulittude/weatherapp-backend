const createError = require('http-errors');
const WeatherSearch = require('../models/WeatherSearch');

exports.addHistory = async (req, res, next) => {
    try {
        const { location } = req.body;
        const user = req.user.id;

        // Check for duplicate
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
};

exports.getHistory = async (req, res, next) => {
    try {
        const history = await WeatherSearch.find({ user: req.user.id })
            .sort({ timestamp: -1 })
            .limit(5);
        res.json(history);
    } catch (err) {
        next(err);
    }
};