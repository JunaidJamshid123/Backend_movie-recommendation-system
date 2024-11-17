const Reminder = require('../models/reminder_model');
const Movie = require('../models/movie_model');

exports.setReminder = async (req, res) => {
  try {
    const { movieId, reminderDate } = req.body;
    const userId = req.user.id;

    // Check if the movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Create a new reminder
    const reminder = new Reminder({ userId, movieId, reminderDate });
    await reminder.save();

    res.status(201).json({ message: 'Reminder set successfully', reminder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error setting reminder', error: error.message });
  }
};

exports.getReminders = async (req, res) => {
  try {
    const userId = req.user.id;

    const reminders = await Reminder.find({ userId }).populate('movieId', 'title releaseDate');
    res.json(reminders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching reminders', error: error.message });
  }
};

