const jwt = require('jsonwebtoken');
const redis = require('redis');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Redis client
const redisClient = redis.createClient({
  url: process.env.REDIS_URL, // Redis URL from the .env file
  password: process.env.REDIS_PASSWORD, // Optional if Redis is password-protected
});

redisClient.on('error', (err) => console.error('Redis error:', err));

// Middleware to verify JWT and check against Redis
const authenticateToken = async (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Expecting "Bearer <token>"
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check token in Redis
    redisClient.get(token, (err, reply) => {
      if (err) {
        console.error('Redis error:', err);
        return res.status(500).json({ message: 'Internal server error.' });
      }

      if (!reply) {
        return res.status(403).json({ message: 'Invalid or expired token.' });
      }

      // Attach decoded token to request
      req.user = decoded;
      next();
    });
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

// Function to save JWT to Redis
const saveToken = (token, expiresIn) => {
  redisClient.set(token, true, 'EX', expiresIn, (err) => {
    if (err) {
      console.error('Error saving token to Redis:', err);
    }
  });
};

// Function to delete JWT from Redis
const deleteToken = (token) => {
  redisClient.del(token, (err) => {
    if (err) {
      console.error('Error deleting token from Redis:', err);
    }
  });
};

module.exports = { authenticateToken, saveToken, deleteToken };
