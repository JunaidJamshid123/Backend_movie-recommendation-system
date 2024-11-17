const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendation_controller');

// Route for personalized recommendations
router.get('/personalized', recommendationController.getPersonalizedRecommendations);

// Route for similar titles
router.get('/similar/:movieId', recommendationController.getSimilarTitles);

// Route for trending movies
router.get('/trending', recommendationController.getTrendingMovies);

// Route for top-rated movies
router.get('/top-rated', recommendationController.getTopRatedMovies);

module.exports = router;
