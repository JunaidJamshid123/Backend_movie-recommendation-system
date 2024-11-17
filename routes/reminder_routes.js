const express = require('express');
const router = express.Router();
const reminderController = require('../controllers/reminder_controller');
const { authenticate } = require('../middlewares/auth_middleware');

// Set a new reminder
router.post('/set', authenticate, reminderController.setReminder);

// Get all reminders for a user
router.get('/get', authenticate, reminderController.getReminders);

module.exports = router;
