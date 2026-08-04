import mongoose from 'mongoose';

const journalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  encryptedText: { type: String, required: true },
  iv: { type: String, required: true },
  date: { type: Date, default: Date.now },
  audioURL: { type: String, default: '' },
  analysisId: { type: mongoose.Schema.Types.ObjectId, ref: 'Analysis' },
  tags: [{ type: String }]
});

export const Journal = mongoose.model('Journal', journalSchema);
