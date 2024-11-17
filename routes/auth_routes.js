const express = require('express');
const { check, validationResult } = require('express-validator');
const authController = require('../controllers/auth_controller');

const router = express.Router();

// User registration (signup) route with validation
router.post(
  '/register',
  [
    check('name', 'Name is required').notEmpty(),
    check('email', 'Valid email is required').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    check('role', 'Role must be either user or admin').optional().isIn(['user', 'admin'])
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  authController.register
);

// User login route with validation
router.post(
  '/login',
  [
    check('email', 'Valid email is required').isEmail(),
    check('password', 'Password is required').notEmpty()
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  authController.login
);

module.exports = router;
