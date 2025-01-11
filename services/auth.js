// app.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { swaggerUi, swaggerDocs } = require('../config/swagger');
const authRoutes = require('../routes/auth');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use('/api/auth', authRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
