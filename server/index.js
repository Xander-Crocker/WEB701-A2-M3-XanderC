import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import eventRoutes from './routes/events.js';
import ticketRoutes from './routes/tickets.js';

// Get directory name of current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env') });

// Initialize Express app
const app = express();

// Middleware
const corsOptions = {
  origin: ['http://localhost:5173'],
  credentials: true,
  optionsSuccessStatus: 200,
};

// Enable CORS
app.use(cors(corsOptions));
// Parse incoming JSON payloads
app.use(express.json());

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/events', eventRoutes);
    app.use('/api/tickets', ticketRoutes);

    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error('Error:', err);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined,
      });
    });

    // Start server
    const PORT = process.env.PORT || 8081;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    // Log and exit if server fails to start
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Call start server
startServer();