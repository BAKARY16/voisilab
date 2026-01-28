import { Router } from 'express';
import { createEvent, getEvents, getEventById, updateEvent, deleteEvent } from '../controllers/eventController';

const router = Router();

// Route to create a new event
router.post('/', createEvent);

// Route to get all events
router.get('/', getEvents);

// Route to get a specific event by ID
router.get('/:id', getEventById);

// Route to update an event by ID
router.put('/:id', updateEvent);

// Route to delete an event by ID
router.delete('/:id', deleteEvent);

export default router;