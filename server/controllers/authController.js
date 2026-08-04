import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { isMongoConnected, localStore, saveLocalStore } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'echojournal_jwt_secret_key_2026_antigravity';

export async function signup(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (isMongoConnected) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
      }

      const newUser = new User({
        name,
        email,
        password: hashedPassword
      });
      await newUser.save();

      const token = jwt.sign({ id: newUser._id, email: newUser.email, name: newUser.name }, JWT_SECRET, { expiresIn: '7d' });

      return res.status(201).json({
        success: true,
        message: 'Account created successfully!',
        token,
        user: { id: newUser._id, name: newUser.name, email: newUser.email, preferences: newUser.preferences }
      });
    } else {
      // Local persistent store fallback
      const existing = localStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
      }

      const id = 'usr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
      const newUser = {
        _id: id,
        name,
        email,
        password: hashedPassword,
        preferences: { darkMode: true, dailyReminderTime: '20:00', emailNotifications: true, aiAdviceTone: 'Empathetic & Supportive' },
        createdAt: new Date().toISOString()
      };

      localStore.users.push(newUser);
      saveLocalStore();

      const token = jwt.sign({ id: newUser._id, email: newUser.email, name: newUser.name }, JWT_SECRET, { expiresIn: '7d' });

      return res.status(201).json({
        success: true,
        message: 'Account created successfully!',
        token,
        user: { id: newUser._id, name: newUser.name, email: newUser.email, preferences: newUser.preferences }
      });
    }
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ success: false, message: 'Server error during signup.' });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    let user = null;

    if (isMongoConnected) {
      user = await User.findOne({ email });
    } else {
      user = localStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = jwt.sign({ id: user._id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });

    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture || '',
        preferences: user.preferences
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Server error during login.' });
  }
}

export async function forgotPassword(req, res) {
  const { email } = req.body;
  return res.json({
    success: true,
    message: `If an account exists for ${email}, a password reset link has been dispatched to your email.`
  });
}

export async function getProfile(req, res) {
  const userId = req.user.id;
  let user = null;

  if (isMongoConnected) {
    user = await User.findById(userId).select('-password');
  } else {
    user = localStore.users.find(u => u._id === userId);
  }

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  return res.json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture || '',
      preferences: user.preferences
    }
  });
}

export async function updatePreferences(req, res) {
  const userId = req.user.id;
  const { preferences } = req.body;

  if (isMongoConnected) {
    const user = await User.findByIdAndUpdate(userId, { preferences }, { new: true });
    return res.json({ success: true, user });
  } else {
    const user = localStore.users.find(u => u._id === userId);
    if (user) {
      user.preferences = { ...user.preferences, ...preferences };
      saveLocalStore();
    }
    return res.json({ success: true, preferences: user?.preferences });
  }
}
