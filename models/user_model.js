const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  preferences: {
    genres: [String],
    actors: [String],
  },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }], // Watchlist for movies
  savedLists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'List' }], // Custom and followed lists
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
