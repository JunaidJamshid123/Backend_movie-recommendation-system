const cron = require('node-cron');
const Reminder = require('../models/reminder_model');
const User = require('../models/user_model');
const Movie = require('../models/movie_model');
const { sendEmailNotification } = require('./notification_util');

cron.schedule('0 9 * * *', async () => {
  try {
    const today = new Date();
    const reminders = await Reminder.find({ reminderDate: { $lte: today }, notified: false })
      .populate('userId', 'email')
      .populate('movieId', 'title releaseDate');

    for (const reminder of reminders) {
      const { userId, movieId } = reminder;
      const email = userId.email;
      const subject = `Upcoming Release: ${movieId.title}`;
      const text = `Don't miss the release of "${movieId.title}" on ${movieId.releaseDate.toDateString()}.`;

      await sendEmailNotification(email, subject, text);

      // Mark the reminder as notified
      reminder.notified = true;
      await reminder.save();
    }

    console.log('Reminder notifications sent.');
  } catch (error) {
    console.error('Error sending reminders:', error);
  }
});
