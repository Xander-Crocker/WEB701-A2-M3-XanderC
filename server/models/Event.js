import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ticketPrice: { type: Number, required: true },
  totalTickets: { type: Number, required: true },
  availableTickets: { type: Number, required: true },
  accessibilityFeatures: [{
    type: String,
    enum: ['closedCaptions', 'audioDescription', 'adaptiveControllers', 'colorblindMode', 'other']
  }],
  createdAt: { type: Date, default: Date.now }
});

// Add a method to check ticket availability
eventSchema.methods.hasAvailableTickets = function() {
  return this.availableTickets > 0;
};

// Add a method to decrease available tickets
eventSchema.methods.bookTicket = async function() {
  if (!this.hasAvailableTickets()) {
    throw new Error('No tickets available');
  }
  
  this.availableTickets -= 1;
  return this.save();
};

export default mongoose.model('Event', eventSchema);