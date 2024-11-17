const mongoose = require('mongoose');

const ListSchema = new mongoose.Schema({
  name: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
  isPublic: { type: Boolean, default: false }, // Determines if the list can be shared
}, { timestamps: true });

module.exports = mongoose.model('List', ListSchema);
