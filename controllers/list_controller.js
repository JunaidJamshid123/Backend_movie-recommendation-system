const List = require('../models/list_model');
const Movie = require('../models/movie_model');
const User = require('../models/user_model');

// Create a new custom list
exports.createList = async (req, res) => {
  try {
    const { name, movies, isPublic } = req.body;
    const userId = req.user.id;

    const newList = await List.create({
      name,
      user: userId,
      movies: movies || [],
      isPublic: isPublic || false,
    });

    res.status(201).json({ message: 'List created successfully', list: newList });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create list', error: error.message });
  }
};

// Get all custom lists for a user
exports.getUserLists = async (req, res) => {
  try {
    const userId = req.user.id;

    const lists = await List.find({ user: userId }).populate('movies');
    res.status(200).json({ lists });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve user lists', error: error.message });
  }
};

// Follow or save a public list
exports.followPublicList = async (req, res) => {
  try {
    const { id: listId } = req.params;
    const userId = req.user.id;

    const list = await List.findById(listId);
    if (!list || !list.isPublic) {
      return res.status(404).json({ message: 'Public list not found' });
    }

    const user = await User.findById(userId);
    if (!user.savedLists.includes(listId)) {
      user.savedLists.push(listId);
      await user.save();
    }

    res.status(200).json({ message: 'List followed successfully', list });
  } catch (error) {
    res.status(500).json({ message: 'Failed to follow list', error: error.message });
  }
};

// Get public lists
exports.getPublicLists = async (req, res) => {
  try {
    const publicLists = await List.find({ isPublic: true }).populate('user movies');
    res.status(200).json({ publicLists });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve public lists', error: error.message });
  }
};

// Update a custom list
exports.updateList = async (req, res) => {
  try {
    const listId = req.params.id;
    const { name, movies, isPublic } = req.body;
    const userId = req.user.id;

    const list = await List.findOne({ _id: listId, user: userId });
    if (!list) {
      return res.status(404).json({ message: 'List not found or not authorized to update' });
    }

    if (name) list.name = name;
    if (movies) list.movies = movies;
    if (isPublic !== undefined) list.isPublic = isPublic;

    await list.save();
    res.status(200).json({ message: 'List updated successfully', list });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update list', error: error.message });
  }
};

// Delete a custom list
exports.deleteList = async (req, res) => {
  try {
    const listId = req.params.id;
    const userId = req.user.id;

    const list = await List.findOneAndDelete({ _id: listId, user: userId });
    if (!list) {
      return res.status(404).json({ message: 'List not found or not authorized to delete' });
    }

    res.status(200).json({ message: 'List deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete list', error: error.message });
  }
};
