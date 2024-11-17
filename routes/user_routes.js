const express = require('express');
const router = express.Router();
const userController = require('../controllers/user_controller');
const authMiddleware = require('../middlewares/auth_middleware');  // Middleware to authenticate user

// User profile and preferences routes
router.get('/profile', authMiddleware, userController.getProfile);  // Get user's profile
router.put('/profile', authMiddleware, userController.updateProfile);  // Update user's profile

// Wishlist routes
router.get('/wishlist', authMiddleware, userController.getWishlist);  // Get user's wishlist
router.post('/wishlist', authMiddleware, userController.addToWishlist);  // Add movie to wishlist
router.delete('/wishlist/:movieId', authMiddleware, userController.removeFromWishlist);  // Remove movie from wishlist
module.exports = router;
