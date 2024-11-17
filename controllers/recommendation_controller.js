const Movie = require('../models/movie_model');
const User = require('../models/user_model');

// Personalized recommendations based on user preferences
exports.getPersonalizedRecommendations = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user is authenticated
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch movies based on user's favorite genres
    const recommendedMovies = await Movie.find({
      genre: { $in: user.preferences.genres },
    })
      .sort({ averageRating: -1 })
      .limit(10);

    res.status(200).json(recommendedMovies);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch recommendations', error });
  }
};

// Similar Titles section
exports.getSimilarTitles = async (req, res) => {
  try {
    const { movieId } = req.params;
    const movie = await Movie.findById(movieId);

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Fetch similar movies based on genre and director
    const similarMovies = await Movie.find({
      _id: { $ne: movieId }, // Exclude the current movie
      $or: [
        { genre: { $in: movie.genre } },
        { director: movie.director },
      ],
    })
      .sort({ popularity: -1 })
      .limit(10);

    res.status(200).json(similarMovies);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch similar titles', error });
  }
};

// Trending Movies
exports.getTrendingMovies = async (req, res) => {
  try {
    // Fetch trending movies based on recent activity
    const trendingMovies = await Movie.find()
      .sort({ popularity: -1 }) // Assuming `popularity` reflects activity
      .limit(10);

    res.status(200).json(trendingMovies);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch trending movies', error });
  }
};

// Top Rated Movies
exports.getTopRatedMovies = async (req, res) => {
  try {
    // Fetch top-rated movies
    const topRatedMovies = await Movie.find()
      .sort({ averageRating: -1 })
      .limit(10);

    res.status(200).json(topRatedMovies);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch top-rated movies', error });
  }
};
