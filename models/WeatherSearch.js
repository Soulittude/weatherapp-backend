const mongoose = require('mongoose');

const WeatherSearchSchema = new mongoose.Schema({
  location: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('WeatherSearch', WeatherSearchSchema);