import mongoose from 'mongoose';

// Define the ticket schema
const ticketSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true, unique: true },
  status: { type: String, enum: ['pending', 'confirmed', 'used'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Ticket', ticketSchema);