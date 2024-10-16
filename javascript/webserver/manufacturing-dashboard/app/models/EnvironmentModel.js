import mongoose from 'mongoose';

const environmentSchema = new mongoose.Schema({
  temperature: {
    type: Number,
    required: true,
    min: -50,  // Set appropriate range based on your real data
    max: 100,
  },
  humidity: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export const Environment = mongoose.model('Environment', environmentSchema);


