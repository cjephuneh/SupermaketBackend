const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    barcode: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    description: { type: String },
    image: { type: String }, // Store image URL
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
