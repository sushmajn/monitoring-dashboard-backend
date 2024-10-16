import { Schema, model } from 'mongoose';

const productionSchema = new Schema({
  productId: String,
  unitsProduced: Number,
  productionRate: Number, // Units per hour
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export const Production = model('Production', productionSchema);
