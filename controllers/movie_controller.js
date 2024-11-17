const Movie = require('../models/movie_model'); // Import the Movie model

// Add a new movie
exports.addMovie = async (req, res) => {
  try {
    const movieData = req.body;  // Data will come from the request body

    const movie = new Movie(movieData);
    await movie.save();

    res.status(201).json({ message: 'Movie added successfully', movie });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update an existing movie
exports.updateMovie = async (req, res) => {
  try {
    const movieId = req.params.id;  // Get movie ID from URL parameter
    const updateData = req.body;  // Data to update

    const updatedMovie = await Movie.findByIdAndUpdate(movieId, updateData, { new: true, runValidators: true });

    if (!updatedMovie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.json({ message: 'Movie updated successfully', updatedMovie });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a movie
exports.deleteMovie = async (req, res) => {
  try {
    const movieId = req.params.id;

    const deletedMovie = await Movie.findByIdAndDelete(movieId);

    if (!deletedMovie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all movies
exports.getMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a movie by ID
exports.getMovieById = async (req, res) => {
  try {
    const movieId = req.params.id;

    const movie = await Movie.findById(movieId);

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.json(movie);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
