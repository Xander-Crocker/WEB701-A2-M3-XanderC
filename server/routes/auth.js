import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import mongoose from 'mongoose';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Test MongoDB Connection
router.get('/test-db', async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    
    if (dbState !== 1) {
      return res.status(500).json({ 
        status: 'error', 
        message: `Database not connected (State: ${mongoose.STATES[dbState]})`
      });
    }

    await User.findOne({}).exec();
    
    res.json({ 
      status: 'success', 
      message: 'Connected to MongoDB successfully!',
      state: mongoose.STATES[dbState]
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: `Database error: ${error.message}`,
      state: mongoose.STATES[mongoose.connection.readyState]
    });
  }
});

// Update profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { username, email, currentPassword, newPassword } = req.body;

    // Check if email or username is already taken by another user
    const existingUser = await User.findOne({
      $and: [
        { _id: { $ne: req.user._id } },
        { $or: [{ email }, { username }] }
      ]
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: 'Username or email already in use' 
      });
    }

    // Verify current password
    const isMatch = await req.user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Update user
    const updates = {
      username,
      email
    };

    if (newPassword) {
      updates.password = await bcrypt.hash(newPassword, 10);
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true }
    ).select('-password');

    res.json({ 
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error during profile update' });
  }
});

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({
      username,
      email,
      password,
      role
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

export default router;