import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  profilePicture: { type: String, default: '' },
  preferences: {
    darkMode: { type: Boolean, default: true },
    dailyReminderTime: { type: String, default: '20:00' },
    emailNotifications: { type: Boolean, default: true },
    aiAdviceTone: { type: String, default: 'Empathetic & Supportive' }
  },
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model('User', userSchema);
