import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOCAL_DB_PATH = path.join(__dirname, '../data/local_db.json');

export let isMongoConnected = false;

// Persistent Local Memory Store if Mongo is unavailable
export const localStore = {
  users: [],
  journals: [],
  analyses: [],
  notifications: []
};

// Load local database from file if it exists
function loadLocalStore() {
  try {
    const dataDir = path.join(__dirname, '../data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    if (fs.existsSync(LOCAL_DB_PATH)) {
      const data = fs.readFileSync(LOCAL_DB_PATH, 'utf8');
      const parsed = JSON.parse(data);
      localStore.users = parsed.users || [];
      localStore.journals = parsed.journals || [];
      localStore.analyses = parsed.analyses || [];
      localStore.notifications = parsed.notifications || [];
    }
  } catch (err) {
    console.warn('Could not read local DB file, starting with empty store:', err.message);
  }
}

export function saveLocalStore() {
  try {
    const dataDir = path.join(__dirname, '../data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(localStore, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to save local store:', err.message);
  }
}

export async function connectDB() {
  loadLocalStore();
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.trim() === '') {
    console.log('ℹ️ MONGODB_URI not provided. Operating in high-performance local database mode.');
    isMongoConnected = false;
    return false;
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000
    });
    console.log('✅ Connected to MongoDB Atlas successfully.');
    isMongoConnected = true;
    return true;
  } catch (error) {
    console.warn('⚠️ MongoDB connection failed. Falling back to persistent local store mode:', error.message);
    isMongoConnected = false;
    return false;
  }
}
