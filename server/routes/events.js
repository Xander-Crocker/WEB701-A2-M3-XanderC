import express from 'express';
import { auth } from '../middleware/auth.js';
import Event from '../models/Event.js';

const router = express.Router();

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find()
      .sort({ date: 1 })
      .select('title description date location ticketPrice totalTickets availableTickets accessibilityFeatures');
    res.json({ events });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events' });
  }
});

// Get organizer's events
router.get('/organizer', auth, async (req, res) => {
  try {
    if (req.user.role !== 'member') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const events = await Event.find({ organizer: req.user._id });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching organizer events' });
  }
});

// Create event
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'member') {
      return res.status(403).json({ message: 'Only members can create events' });
    }

    const { title, description, date, location, ticketPrice, totalTickets, accessibilityFeatures } = req.body;

    if (totalTickets <= 0) {
      return res.status(400).json({ message: 'Total tickets must be greater than 0' });
    }

    const event = new Event({
      title,
      description,
      date,
      location,
      organizer: req.user._id,
      ticketPrice,
      totalTickets,
      availableTickets: totalTickets,
      accessibilityFeatures
    });

    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Error creating event' });
  }
});

// Get event details
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .select('title description date location ticketPrice totalTickets availableTickets accessibilityFeatures');
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching event details' });
  }
});

export default router;