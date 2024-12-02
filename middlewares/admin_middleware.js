module.exports = (req, res, next) => {
  // Check if user is an admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: You do not have the necessary permissions' });
  }
  //fasfasdfsdafsd
  next();  
  //sfajdslfjlaksdjflk;asdjflk;asdjfasdlk;jfasdlkfj
};
