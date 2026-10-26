const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Medicine name is required'], trim: true, maxlength: 100 },
  brand: { type: String, trim: true, default: '' },
  category: { type: String, required: true, enum: ['Tablet', 'Capsule', 'Syrup', 'Injection', 'Ointment', 'Drops', 'Other'], default: 'Tablet' },
  batchNumber: { type: String, trim: true, default: '' },
  quantity: { type: Number, required: true, min: [0, 'Quantity cannot be negative'], validate: Number.isInteger },
  minimumStock: { type: Number, default: 10, min: 0, validate: Number.isInteger },
  expiryDate: { type: Date, required: [true, 'Expiry date is required'] },
  purchaseDate: { type: Date, default: Date.now },
  supplier: { type: String, trim: true, default: '' },
  notes: { type: String, trim: true, default: '' }
}, { timestamps: true });

medicineSchema.index({ name: 'text', brand: 'text', batchNumber: 'text' });
module.exports = mongoose.model('Medicine', medicineSchema);
