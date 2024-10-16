import { Schema, model } from 'mongoose';

const machineSchema = new Schema({
  machineId: String,
  status: String, // e.g., "active", "inactive", "maintenance"
  uptime: Number, // Uptime in hours
  downtime: Number, // Downtime in hours
}, { timestamps: true });

export const Machine = model('Machine', machineSchema);
