const Movie = require('../models/movie_model');

// Search and filter movies
exports.searchMovies = async (req, res) => {
  try {
    const {
      title,
      genre,
      director,
      cast,
      minRating,
      maxRating,
      minYear,
      maxYear,
      releaseDecade,
      country,
      language,
      keywords,
      sortBy, // e.g., "popularity", "releaseDate", or "averageRating"
    } = req.query;

    // Build the query object
    const query = {};

    if (title) query.title = { $regex: title, $options: 'i' }; // Case-insensitive search
    if (genre) query.genre = { $in: genre.split(',') }; // Match any genre in the list
    if (director) query.director = { $regex: director, $options: 'i' };
    if (cast) query.cast = { $in: cast.split(',') }; // Match any cast member in the list
    if (minRating || maxRating) {
      query.averageRating = {};
      if (minRating) query.averageRating.$gte = parseFloat(minRating);
      if (maxRating) query.averageRating.$lte = parseFloat(maxRating);
    }
    if (minYear || maxYear) {
      query.releaseDate = {};
      if (minYear) query.releaseDate.$gte = new Date(`${minYear}-01-01`);
      if (maxYear) query.releaseDate.$lte = new Date(`${maxYear}-12-31`);
    }
    if (releaseDecade) {
      const startYear = Math.floor(parseInt(releaseDecade, 10) / 10) * 10;
      query.releaseDate = {
        $gte: new Date(`${startYear}-01-01`),
        $lt: new Date(`${startYear + 10}-01-01`),
      };
    }
    if (country) query['boxOffice.country'] = { $regex: country, $options: 'i' }; // Assuming `boxOffice` has country info
    if (language) query.language = { $regex: language, $options: 'i' }; // Assuming `language` exists in the schema
    if (keywords) query.synopsis = { $regex: keywords, $options: 'i' }; // Search in synopsis for keywords

    // Sorting options
    const sortOptions = {};
    if (sortBy) {
      if (sortBy === 'popularity') sortOptions.boxOffice = -1; // Assuming `boxOffice` reflects popularity
      else if (sortBy === 'releaseDate') sortOptions.releaseDate = -1; // Most recent first
      else if (sortBy === 'averageRating') sortOptions.averageRating = -1; // Highest rating first
    }

    // Execute the query
    const movies = await Movie.find(query).sort(sortOptions);

    res.status(200).json({ movies });
  } catch (error) {
    res.status(500).json({ message: 'Failed to search movies', error: error.message });
  }
};

// Get top movies by month
exports.getTopMoviesOfMonth = async (req, res) => {
  try {
    const { year, month } = req.query;

    const startDate = new Date(`${year || new Date().getFullYear()}-${month || new Date().getMonth() + 1}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 1);

    const movies = await Movie.find({
      releaseDate: { $gte: startDate, $lt: endDate },
    })
      .sort({ averageRating: -1 })
      .limit(10);

    res.status(200).json({ movies });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch top movies of the month', error: error.message });
  }
};

// Get top movies by genre
exports.getTopMoviesByGenre = async (req, res) => {
  try {
    const { genre } = req.query;

    if (!genre) {
      return res.status(400).json({ message: 'Genre is required' });
    }

    const movies = await Movie.find({ genre: { $in: [genre] } })
      .sort({ averageRating: -1 })
      .limit(10);

    res.status(200).json({ movies });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch top movies by genre', error: error.message });
  }
};
