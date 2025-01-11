const fs = require('fs');
const path = require('path');

// Define the directory structure
const directories = [
  'config',
  'models',
  'controllers',
  'routes',
  'services',
  'utils',
  'cache',
  'middleware',
  'public'
];

// Define subdirectories within models, controllers, services, and other folders
const subdirectories = {
  'config': ['db.js', 'redis.js'],
  'models': ['Chain.js', 'Supermarket.js', 'User.js', 'Inventory.js', 'Transaction.js', 'index.js'],
  'controllers': ['chainController.js', 'supermarketController.js', 'userController.js', 'inventoryController.js', 'transactionController.js'],
  'routes': ['chainRoutes.js', 'supermarketRoutes.js', 'userRoutes.js', 'inventoryRoutes.js', 'transactionRoutes.js'],
  'services': ['chainService.js', 'supermarketService.js', 'userService.js', 'inventoryService.js', 'transactionService.js'],
  'cache': ['chainCache.js', 'supermarketCache.js', 'userCache.js'],
  'middleware': ['authMiddleware.js', 'roleMiddleware.js'],
  'utils': ['validation.js', 'logger.js']
};

// Function to create directories and files
function createDirectoriesAndFiles(basePath) {
  directories.forEach((dir) => {
    const dirPath = path.join(basePath, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
      console.log(`Created directory: ${dirPath}`);
    }

    if (subdirectories[dir]) {
      subdirectories[dir].forEach((file) => {
        const filePath = path.join(dirPath, file);
        if (!fs.existsSync(filePath)) {
          fs.writeFileSync(filePath, '', 'utf8');
          console.log(`Created file: ${filePath}`);
        }
      });
    }
  });
}

// Call the function to create directories and files in the current directory
createDirectoriesAndFiles(__dirname);
