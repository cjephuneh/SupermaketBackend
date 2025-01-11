const mongoose = require('mongoose');
const { Schema } = mongoose;

const chainSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  supermarkets: [{ type: Schema.Types.ObjectId, ref: 'Supermarket' }],
  users: [
    {
      user_id: { type: Schema.Types.ObjectId, ref: 'User' },
      role: { type: String, enum: ['manager', 'editor', 'viewer'] }
    }
  ],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const Chain = mongoose.model('Chain', chainSchema);
module.exports = Chain;
