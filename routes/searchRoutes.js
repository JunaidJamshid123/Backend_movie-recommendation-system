const express = require('express');
const router = express.Router();
const searchController = require('../controllers/search_controller');

// Route for general search and filtering
router.get('/', searchController.searchMovies);

// Route for top movies of the month
router.get('/top/month', searchController.getTopMoviesOfMonth);

// Route for top movies by genre
router.get('/top/genre', searchController.getTopMoviesByGenre);

module.exports = router;
