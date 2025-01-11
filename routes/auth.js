const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const redis = require('redis');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const dotenv = require('dotenv');
const { authenticateToken, saveToken, deleteToken } = require('../middleware/auth');

dotenv.config();

const router = express.Router();

// Initialize Redis client
const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
  password: process.env.REDIS_PASSWORD,
});

redisClient.on('error', (err) => console.error('Redis error:', err));

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user with email, password, and optional role.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               role:
 *                 type: string
 *                 example: viewer
 *     responses:
 *       201:
 *         description: User created successfully.
 *       400:
 *         description: User already exists or invalid input.
 */
router.post('/register', [
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      password: hashedPassword,
      role,
    });

    await user.save();

    // Generate JWT
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    saveToken(token, 3600);

    res.status(201).json({ message: 'User created successfully', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     description: User logs in with email and password and receives a JWT token.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: JWT token successfully generated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "jwt_token_here"
 *       400:
 *         description: Bad request, invalid credentials.
 */
router.post('/login', [
  body('email').isEmail(),
  body('password').notEmpty(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    saveToken(token, 3600);

    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Logout user
 *     description: Invalidates the JWT token.
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Logout successful.
 */
router.post('/logout', authenticateToken, (req, res) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (token) {
    deleteToken(token);
  }
  res.json({ message: 'Logout successful.' });
});

/**
 * @swagger
 * /protected:
 *   get:
 *     summary: Protected API endpoint
 *     description: Access this route only with a valid JWT token.
 *     tags: [Protected]
 *     responses:
 *       200:
 *         description: Access granted.
 *       401:
 *         description: Unauthorized, token missing or invalid.
 */
router.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Access granted. This is a protected route.', user: req.user });
});

module.exports = router;
