import express from 'express';
import { auth } from '../middleware/auth.js';
import Event from '../models/Event.js';

const router = express.Router();

// Get all events
router.get('/', async (req, res) => {
  try {
    // Fetch all events and sort them by date in ascending order
    const events = await Event.find()
      .sort({ date: 1 })
      .select('title description date location ticketPrice totalTickets availableTickets accessibilityFeatures');
    res.json({ events });
  } catch (error) {
    // Respond with an error message if there was an error fetching the events
    res.status(500).json({ message: 'Error fetching events' });
  }
});

// Get organizer's events
router.get('/organizer', auth, async (req, res) => {
  try {
    // Check if the authenticated user is an organizer
    if (req.user.role !== 'member') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    // Find events created by the authenticated user
    const events = await Event.find({ organizer: req.user._id });
    res.json(events);
  } catch (error) {
    // Respond with an error message if there was an error fetching the organizer's events
    res.status(500).json({ message: 'Error fetching organizer events' });
  }
});

// Create event
router.post('/', auth, async (req, res) => {
  try {
    // Check if the authenticated user is a member
    if (req.user.role !== 'member') {
      return res.status(403).json({ message: 'Only members can create events' });
    }
    // Extract event details from the request body
    const { title, description, date, location, ticketPrice, totalTickets, accessibilityFeatures } = req.body;
    // Validate the total tickets
    if (totalTickets <= 0) {
      return res.status(400).json({ message: 'Total tickets must be greater than 0' });
    }
    // Create a new event
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
    // Save the event to the database
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    // Respond with an error message if there was an error creating the event
    res.status(500).json({ message: 'Error creating event' });
  }
});

// Get event details
router.get('/:id', async (req, res) => {
  try {
    // Find the event by ID and select the title, description, date, 
    // location, ticketPrice, totalTickets, availableTickets, and accessibilityFeatures
    const event = await Event.findById(req.params.id)
      .select('title description date location ticketPrice totalTickets availableTickets accessibilityFeatures');
    
      // Respond with a 404 status code if the event does not exist
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    // Respond with the event details
    res.json(event);
  } catch (error) {
    // Respond with an error message if there was an error fetching the event details
    res.status(500).json({ message: 'Error fetching event details' });
  }
});

export default router;