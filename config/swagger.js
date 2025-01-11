// config/swagger.js
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SuperFast API',
      version: '1.0.0',
      description: 'API documentation for SuperFast POS system',
    },
    servers: [
      {
        url: 'http://localhost:5000/api', // Adjust to your API URL
      },
    ],
  },
  apis: [path.join(__dirname, '../routes/**/*.js')], // Path to your route files
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

module.exports = { swaggerUi, swaggerDocs };
