import mongoose from 'mongoose';

const analysisSchema = new mongoose.Schema({
  journalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Journal', required: true },
  emotion: { type: String, required: true }, // e.g. "Stressed", "Happy", "Anxious", "Calm"
  sentiment: { type: String, required: true }, // "Positive", "Neutral", "Negative"
  stressScore: { type: Number, required: true, min: 0, max: 100 },
  positivityScore: { type: Number, required: true, min: 0, max: 100 },
  topics: [{ type: String }], // e.g. ["Work", "Sleep"]
  keywords: [{ type: String }], // e.g. ["deadline", "manager", "insomnia"]
  summary: { type: String, required: true },
  advice: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const Analysis = mongoose.model('Analysis', analysisSchema);
