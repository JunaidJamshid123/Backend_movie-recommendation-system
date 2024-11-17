/*
const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movie_controller');
const authMiddleware = require('../middlewares/auth_middleware');
const adminMiddleware = require('../middlewares/admin_middleware');
const { body, validationResult } = require('express-validator');

const validateMovieData = [
  body('title').isString().withMessage('Title must be a string').notEmpty().withMessage('Title is required'),
  body('genre').isArray().withMessage('Genre must be an array').notEmpty().withMessage('Genre is required'),
  body('director').isString().withMessage('Director must be a string').notEmpty().withMessage('Director is required'),
  body('cast').isArray().withMessage('Cast must be an array').notEmpty().withMessage('Cast is required'),
  body('releaseDate').isISO8601().toDate().withMessage('Release date must be valid').notEmpty(),
  body('runtime').isNumeric().withMessage('Runtime must be a number').notEmpty(),
  body('synopsis').isString().withMessage('Synopsis must be a string').notEmpty(),
  body('averageRating').optional().isFloat({ min: 0, max: 10 }).withMessage('Average rating must be between 0 and 10'),
  body('ageRating').isString().optional().withMessage('Age rating must be a string'),
];

const checkValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.post('/', authMiddleware, adminMiddleware, validateMovieData, checkValidationErrors, movieController.addMovie);
router.put('/:id', authMiddleware, adminMiddleware, validateMovieData, checkValidationErrors, movieController.updateMovie);
router.delete('/:id', authMiddleware, adminMiddleware, movieController.deleteMovie);

router.get('/', movieController.getMovies);
router.get('/:id', movieController.getMovieById);

module.exports = router;
*/

const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movie_controller');
const { authenticate, authorize } = require('../middlewares/auth_middleware');

// Movie routes
router.post('/', authenticate, authorize('admin'), movieController.addMovie);
router.put('/:id', authenticate, authorize('admin'), movieController.updateMovie);
router.delete('/:id', authenticate, authorize('admin'), movieController.deleteMovie);
router.get('/', movieController.getMovies);
router.get('/:id', movieController.getMovieById);

module.exports = router;
