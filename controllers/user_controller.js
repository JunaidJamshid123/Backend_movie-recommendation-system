const User = require('../models/user');  // Assuming the User model is in '../models/user'
const Movie = require('../models/movie');  // Assuming the Movie model is in '../models/movie'
const jwt = require('jsonwebtoken');  // Import JWT package
const config = require('../config/config');  // Assuming you have a config file for your secret key

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];  // Bearer token format

  if (!token) {
    return res.status(403).json({ message: 'Access denied, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);  // Decode token using the secret key
    req.user = decoded;  // Attach the user data to the request object
    next();  // Call the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Get user profile (with preferences) using JWT
exports.getProfile = async (req, res) => {
  try {
    // Verify the JWT and extract user info (done in middleware)
    const user = await User.findById(req.user.id).select('-password');  // Exclude password
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);  // Return user profile data
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user profile and preferences
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, preferences } = req.body;  // Get data from request body
    const updateData = { name, email, preferences };

    // Update user in the database
    const updatedUser = await User.findByIdAndUpdate(req.user.id, updateData, { new: true, runValidators: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);  // Send back the updated user profile
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user's wishlist
exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('wishlist');  // Populate wishlist with movie details
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.wishlist);  // Return the user's wishlist
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add movie to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const { movieId } = req.body;  // Get movie ID from request body
    const movie = await Movie.findById(movieId);  // Find the movie by ID
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    const user = await User.findById(req.user.id);  // Get logged-in user
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the movie is already in the wishlist
    if (!user.wishlist.includes(movieId)) {
      user.wishlist.push(movieId);  // Add movie to wishlist
      await user.save();  // Save the updated user data
      res.json({ message: 'Movie added to wishlist', wishlist: user.wishlist });
    } else {
      res.status(400).json({ message: 'Movie already in wishlist' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove movie from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const { movieId } = req.params;  // Get movie ID from request params
    const user = await User.findById(req.user.id);  // Get logged-in user

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the index of the movie in the wishlist
    const index = user.wishlist.indexOf(movieId);
    if (index > -1) {
      user.wishlist.splice(index, 1);  // Remove movie from wishlist
      await user.save();  // Save the updated user data
      res.json({ message: 'Movie removed from wishlist', wishlist: user.wishlist });
    } else {
      res.status(400).json({ message: 'Movie not found in wishlist' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { 
  getProfile,
  updateProfile,
  getWishlist,
  addToWishlist,
  removeFromWishlist
};
