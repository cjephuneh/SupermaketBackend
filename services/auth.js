const express = require('express');
const mongoose = require('mongoose');
const redis = require('redis');
const dotenv = require('dotenv');
const { swaggerUi, swaggerDocs } = require('../config/swagger');
const authRoutes = require('../routes/auth');
const { authenticateToken } = require('../middleware/auth');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Initialize Redis Client
const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
  password: process.env.REDIS_PASSWORD,
});

redisClient.on('error', (err) => console.error('Redis error:', err));
redisClient.connect().then(() => {
  console.log('Redis connected');
});

// Expose Redis client to middleware
app.use((req, res, next) => {
  req.redisClient = redisClient;
  next();
});

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes (protected and unprotected)
app.use('/api/auth', authRoutes);

// Example of protecting additional routes
app.use('/api/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Access granted. This is another protected route.', user: req.user });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
