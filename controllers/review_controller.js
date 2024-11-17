const Review = require('../models/review_model');
const Movie = require('../models/movie_model');

// Add a review
exports.addReview = async (req, res) => {
  try {
    const { movieId } = req.params;
    const { rating, reviewText } = req.body;

    // Check if the movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Check if the user has already reviewed the movie
    const existingReview = await Review.findOne({ user: req.user._id, movie: movieId });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this movie' });
    }

    // Create a new review
    const review = new Review({
      user: req.user._id,
      movie: movieId,
      rating,
      reviewText
    });

    await review.save();

    res.status(201).json({ message: 'Review added successfully', review });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a review
exports.updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, reviewText } = req.body;

    // Find the review
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Ensure the review belongs to the logged-in user
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to update this review' });
    }

    // Update review fields
    review.rating = rating || review.rating;
    review.reviewText = reviewText || review.reviewText;

    await review.save();

    res.json({ message: 'Review updated successfully', review });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    // Find the review
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Ensure the review belongs to the logged-in user
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to delete this review' });
    }

    await review.remove();

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get reviews for a movie
exports.getReviewsByMovie = async (req, res) => {
  try {
    const { movieId } = req.params;

    // Check if the movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Fetch reviews for the movie
    const reviews = await Review.find({ movie: movieId })
      .populate('user', 'name') // Include user name
      .sort({ createdAt: -1 }); // Sort by latest reviews

    // Calculate review highlights
    const topRatedReviews = reviews
      .filter(review => review.rating >= 4)
      .slice(0, 3); // Top 3 highly-rated reviews
    const mostDiscussedReviews = reviews.slice(0, 3); // Most recent reviews

    res.json({
      reviews,
      reviewHighlights: {
        topRated: topRatedReviews,
        mostDiscussed: mostDiscussedReviews
      }
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
