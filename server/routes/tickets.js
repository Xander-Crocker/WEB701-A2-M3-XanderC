import express from 'express';
import { auth } from '../middleware/auth.js';
import Ticket from '../models/Ticket.js';
import Event from '../models/Event.js';
import crypto from 'crypto';
import mongoose from 'mongoose';

const router = express.Router();

// Get user's tickets
router.get('/user', auth, async (req, res) => {
  try {
    // Find tickets for the authenticated user
    const tickets = await Ticket.find({ user: req.user._id })
      // Populate the event field with the title, description, date, location, and ticketPrice
      .populate('event', 'title description date location ticketPrice');
    // Respond with the populated tickets
    res.json(tickets);
  } catch (error) {
    // Respond with an error message if there was an error fetching the tickets
    res.status(500).json({ message: 'Error fetching tickets' });
  }
});

// Book a ticket
router.post('/', auth, async (req, res) => {
  // Start a session to enable transactions
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find the event by ID
    const event = await Event.findById(req.body.eventId).session(session);
    
    // If the event does not exist, respond with a 404 status code
    if (!event) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Event not found' });
    }

    // If there are no available tickets, respond with a 400 status code
    if (!event.hasAvailableTickets()) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'No tickets available' });
    }

    // Check if user already has a ticket for this event
    const existingTicket = await Ticket.findOne({
      event: event._id,
      user: req.user._id
    }).session(session); // Use the session to ensure atomicity

    // If the user already has a ticket for this event, respond with a 400 status code
    if (existingTicket) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'You already have a ticket for this event' });
    }

    // Generate unique token
    const token = crypto.randomBytes(16).toString('hex');

    // Create a new ticket
    const ticket = new Ticket({
      event: event._id,
      user: req.user._id,
      token,
      status: 'pending'
    });

    // Save the ticket
    await ticket.save({ session });
    // Book the ticket
    await event.bookTicket();
    // Commit the transaction
    await session.commitTransaction();
    // Populate the ticket with the event details
    const populatedTicket = await Ticket.findById(ticket._id)
      // Populate the event field with the title, description, date, location, and ticketPrice
      .populate('event', 'title description date location ticketPrice');
    // Respond with the populated ticket
    res.status(201).json(populatedTicket);
  } catch (error) {
    // Rollback the transaction and respond with an error message if there was an error booking the ticket
    await session.abortTransaction();
    res.status(500).json({ message: error.message || 'Error booking ticket' });
  } finally {
    // End the session
    session.endSession();
  }
});

// Confirm ticket
router.patch('/:id/confirm', auth, async (req, res) => {
  try {
    // Find the ticket by ID and populate the event field with the title, 
    // description, date, location, and ticketPrice
    const ticket = await Ticket.findById(req.params.id)
      .populate('event', 'title description date location ticketPrice');
    
    // Respond with a 404 status code if the ticket does not exist
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Respond with a 403 status code if the ticket does not belong to the authenticated user
    if (ticket.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Respond with a 400 status code if the ticket is already confirmed
    ticket.status = 'confirmed';
    // Save the ticket
    await ticket.save();

    res.json(ticket);
  } catch (error) {
    // Respond with a 500 status code if there was an error confirming the ticket
    res.status(500).json({ message: 'Error confirming ticket' });
  }
});

export default router;