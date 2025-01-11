const inventorySchema = new Schema({
    supermarket_id: { type: Schema.Types.ObjectId, ref: 'Supermarket' },
    barcode: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String },
    price: { type: Number, required: true },
    stock_quantity: { type: Number, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
  });
  
  const Inventory = mongoose.model('Inventory', inventorySchema);
  module.exports = Inventory;
  