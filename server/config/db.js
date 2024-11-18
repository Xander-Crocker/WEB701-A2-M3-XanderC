import mongoose from 'mongoose';

// Connect to MongoDB
const connectDB = async () => {
    try {
        // Get the MongoDB URI from environment variables
        const mongoURI = process.env.MONGO_URI;
        if (!mongoURI) {
            throw new Error('MONGO_URI is not defined in environment variables');
        }

        // Connect to MongoDB using Mongoose
        const conn = await mongoose.connect(mongoURI);
        console.log('MongoDB Connected Successfully');
        
        // Handle connection events
        mongoose.connection.on('error', err => {
            console.error('MongoDB connection error:', err);
        });

        // Handle disconnection events
        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });

        return conn;
    } catch (err) {
        // Log and exit if the connection fails
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};

export default connectDB;