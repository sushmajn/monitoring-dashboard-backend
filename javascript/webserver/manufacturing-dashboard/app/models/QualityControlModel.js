import { Schema, model } from 'mongoose';

const qualityControlSchema = new Schema({
  productId: { type: String, required: true },
  inspectorId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  defectsFound: Number,
  correctiveAction: String, 
  status: String, // e.g., "pass", "fail"
  inspectionDate: { type: Date, default: Date.now },
}, { timestamps: true });

export const QualityControl = model('QualityControl', qualityControlSchema);
