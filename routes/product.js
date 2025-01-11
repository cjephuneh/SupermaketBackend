const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// Create Product
router.post('/create', async (req, res) => {
  const { name, barcode, price, stock, description } = req.body;
  
  const product = new Product({ name, barcode, price, stock, description });

  try {
    await product.save();
    res.status(201).json({ message: 'Product created', product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Product
router.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  const { name, price, stock, description } = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, { name, price, stock, description }, { new: true });
    res.status(200).json({ message: 'Product updated', updatedProduct });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Product
router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
