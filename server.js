const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth_routes');
const movieRoutes = require('./routes/movie_routes');
const reminderRoutes = require('./routes/reminder_routes');
require('./utils/scheduler'); // Start the notification scheduler

dotenv.config();

const app = express();
app.use(express.json());

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

// Routes
app.use('/auth', authRoutes);
app.use('/movies', movieRoutes);
app.use('/reminders', reminderRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
});
