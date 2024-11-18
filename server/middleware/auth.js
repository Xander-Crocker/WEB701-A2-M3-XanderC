import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware to authenticate users
export const auth = async (req, res, next) => {
  try {
    // Get the token from the Authorization header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    // If there is no token, respond with a 401 status code
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Find the user by ID
    const user = await User.findOne({ _id: decoded.userId });

    // If the user does not exist, respond with a 401 status code
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Attach the user and token to the request object
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    // Respond with a 401 status code if the token is invalid
    res.status(401).json({ message: 'Please authenticate' });
  }
};