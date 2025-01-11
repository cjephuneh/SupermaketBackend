const supermarketSchema = new Schema({
    chain_id: { type: Schema.Types.ObjectId, ref: 'Chain' }, // Optional reference to Chain
    name: { type: String, required: true },
    location: {
      latitude: { type: Number },
      longitude: { type: Number }
    },
    address: { type: String },
    contact_info: {
      phone: { type: String },
      email: { type: String }
    },
    payment_gateways: [
      {
        type: { type: String },
        api_key: { type: String },
        details: {
          business_number: { type: String },
          callback_url: { type: String }
        }
      }
    ],
    users: [
      {
        user_id: { type: Schema.Types.ObjectId, ref: 'User' },
        role: { type: String, enum: ['manager', 'editor', 'viewer'] }
      }
    ],
    inventory_count: { type: Number },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
  });
  
  const Supermarket = mongoose.model('Supermarket', supermarketSchema);
  module.exports = Supermarket;
  