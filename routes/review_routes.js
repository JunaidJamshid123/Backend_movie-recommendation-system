const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review_controller');
const authMiddleware = require('../middlewares/auth_middleware');

// Review routes
router.post('/:movieId', authMiddleware, reviewController.addReview);
router.put('/:reviewId', authMiddleware, reviewController.updateReview);
router.delete('/:reviewId', authMiddleware, reviewController.deleteReview);
router.get('/:movieId', reviewController.getReviewsByMovie);

module.exports = router;
