const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  reviewText: { type: String },
  isHighlighted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Review', ReviewSchema);
