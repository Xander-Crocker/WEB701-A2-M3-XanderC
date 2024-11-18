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
    // Check if the database is connected
    const dbState = mongoose.connection.readyState;
    
    // If the database is not connected, respond with an error message
    if (dbState !== 1) {
      return res.status(500).json({ 
        status: 'error', 
        message: `Database not connected (State: ${mongoose.STATES[dbState]})`
      });
    }

    // Find any user in the database
    await User.findOne({}).exec();
    
    // Respond with a success message if the database is connected
    res.json({ 
      status: 'success', 
      message: 'Connected to MongoDB successfully!',
      state: mongoose.STATES[dbState]
    });
  } catch (error) {
    // Respond with an error message if there was an error connecting to the database
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
    // Extract user details from the request body
    const { username, email, currentPassword, newPassword } = req.body;

    // Check if email or username is already taken by another user
    const existingUser = await User.findOne({
      $and: [
        { _id: { $ne: req.user._id } },
        { $or: [{ email }, { username }] }
      ]
    });

    // If the email or username is already taken, respond with a 400 status code
    if (existingUser) {
      return res.status(400).json({ 
        message: 'Username or email already in use' 
      });
    }

    // Check if the current password is correct
    const isMatch = await req.user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Update the user's profile
    const updates = {
      username,
      email
    };

    // If a new password is provided, hash and update the password
    if (newPassword) {
      updates.password = await bcrypt.hash(newPassword, 10);
    }

    // Find the user by ID and update the profile
    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true }
    ).select('-password');

    // Respond with a success message and the updated user details
    res.json({ 
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    // Respond with an error message if there was an error updating the profile
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error during profile update' });
  }
});

// Register
router.post('/register', async (req, res) => {
  try {
    // Extract user details from the request body
    const { username, email, password, role } = req.body;

    // Check if the email or username is already taken by another user
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user
    const user = new User({
      username,
      email,
      password,
      role
    });

    // Hash the password
    await user.save();

    // Respond with a success message and the new user details
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Respond with a success message and the new user details
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
    // Respond with an error message if there was an error registering 
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    // Extract email and password from the request body
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if the password is correct
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Respond with the token and user details
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
    // Respond with an error message if there was an error logging in
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

export default router;