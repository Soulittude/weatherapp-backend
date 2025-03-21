const createError = require('http-errors');
const axios = require('axios');

exports.getWeather = async (req, res, next) => {
    try {
        const { location } = req.params;
        const apiKey = process.env.OPENWEATHER_API_KEY;
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`
        );
        res.json(response.data);
    } catch (err) {
        next(err);
    }
};