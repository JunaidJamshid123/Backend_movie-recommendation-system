module.exports = {
  // Secret key for JWT
  jwtSecret: 'JunaidJamshid',  // Replace this with a secure secret key, you can use environment variables
  
  // Token expiration time (1 hour)
  jwtExpiration: '1h',  // You can adjust this as per your needs (e.g., '24h' for 1 day)
  
  // MongoDB URI (You should replace this with your actual MongoDB connection string)
  mongoURI: 'mongodb://localhost:27017/MovieApplication',  // Replace with your MongoDB URI
  

  port: process.env.PORT || 5000,  // Default to 5000 if not provided by environment
};
