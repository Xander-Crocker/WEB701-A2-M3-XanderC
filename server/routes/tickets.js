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
    const tickets = await Ticket.find({ user: req.user._id })
      .populate('event', 'title description date location ticketPrice');
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tickets' });
  }
});

// Book a ticket
router.post('/', auth, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const event = await Event.findById(req.body.eventId).session(session);
    
    if (!event) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Event not found' });
    }

    if (!event.hasAvailableTickets()) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'No tickets available' });
    }

    // Check if user already has a ticket for this event
    const existingTicket = await Ticket.findOne({
      event: event._id,
      user: req.user._id
    }).session(session);

    if (existingTicket) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'You already have a ticket for this event' });
    }

    // Generate unique token
    const token = crypto.randomBytes(16).toString('hex');

    const ticket = new Ticket({
      event: event._id,
      user: req.user._id,
      token,
      status: 'pending'
    });

    await ticket.save({ session });
    await event.bookTicket();

    await session.commitTransaction();
    
    const populatedTicket = await Ticket.findById(ticket._id)
      .populate('event', 'title description date location ticketPrice');
    
    res.status(201).json(populatedTicket);
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ message: error.message || 'Error booking ticket' });
  } finally {
    session.endSession();
  }
});

// Confirm ticket
router.patch('/:id/confirm', auth, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('event', 'title description date location ticketPrice');
    
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    if (ticket.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    ticket.status = 'confirmed';
    await ticket.save();

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Error confirming ticket' });
  }
});

export default router;