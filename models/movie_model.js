const mongoose = require('mongoose');

// Define the Movie schema
const MovieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genre: { type: [String], required: true },
  director: { type: String, required: true },
  cast: { type: [String], required: true },
  releaseDate: { type: Date, required: true },
  runtime: { type: Number, required: true }, // in minutes
  synopsis: { type: String, required: true },
  averageRating: { type: Number, default: 0, min: 0, max: 10 },
  trivia: { type: [String] },
  goofs: { type: [String] },
  soundtrack: { type: [String] },
  ageRating: { type: String }, // e.g., 'PG', 'R', 'G'
  boxOffice: {
    openingWeekend: { type: Number },
    totalEarnings: { type: Number },
    internationalRevenue: { type: Number },
  },
}, { timestamps: true });

// Export the Movie model
module.exports = mongoose.model('Movie', MovieSchema);
