const mongoose = require('mongoose');

const ReminderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  reminderDate: { type: Date, required: true },
  notified: { type: Boolean, default: false }, // Track if the user has already been notified
}, { timestamps: true });

module.exports = mongoose.model('Reminder', ReminderSchema);
