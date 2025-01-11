const express = require('express');
const multer = require('multer');
const csvParser = require('csv-parser');
const xlsx = require('xlsx');
const fs = require('fs');
const Product = require('../models/Product');
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

// Upload CSV or Excel file and process it
router.post('/upload', upload.single('file'), (req, res) => {
  const filePath = req.file.path;

  const fileExtension = req.file.originalname.split('.').pop().toLowerCase();

  let products = [];

  // Parsing logic for CSV files
  if (fileExtension === 'csv') {
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (data) => {
        products.push({
          name: data.name,
          barcode: data.barcode,
          price: parseFloat(data.price),
          stock: parseInt(data.stock),
          description: data.description,
        });
      })
      .on('end', async () => {
        await Product.insertMany(products);
        fs.unlinkSync(filePath); // Clean up the uploaded file
        res.status(200).json({ message: 'Products uploaded successfully' });
      });
  } 
  // Parsing logic for Excel files
  else if (fileExtension === 'xlsx') {
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    products = data.map((row) => ({
      name: row.name,
      barcode: row.barcode,
      price: parseFloat(row.price),
      stock: parseInt(row.stock),
      description: row.description,
    }));

    Product.insertMany(products)
      .then(() => {
        fs.unlinkSync(filePath); // Clean up the uploaded file
        res.status(200).json({ message: 'Products uploaded successfully' });
      })
      .catch((err) => {
        fs.unlinkSync(filePath); // Clean up the uploaded file
        res.status(500).json({ error: err.message });
      });
  } else {
    fs.unlinkSync(filePath); // Clean up the uploaded file
    return res.status(400).json({ error: 'Invalid file type' });
  }
});

module.exports = router;
