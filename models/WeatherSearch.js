const mongoose = require('mongoose');

const WeatherSearchSchema = new mongoose.Schema({
  location: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('WeatherSearch', WeatherSearchSchema);