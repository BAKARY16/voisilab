import { Request, Response } from 'express';
import Event from '../models/Event';

// Get all events
export const getAllEvents = async (req: Request, res: Response) => {
    try {
        const events = await Event.findAll();
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving events', error });
    }
};

// Get a single event by ID
export const getEventById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const event = await Event.findByPk(id);
        if (event) {
            res.status(200).json(event);
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving event', error });
    }
};

// Create a new event
export const createEvent = async (req: Request, res: Response) => {
    const newEvent = req.body;
    try {
        const event = await Event.create(newEvent);
        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ message: 'Error creating event', error });
    }
};

// Update an existing event
export const updateEvent = async (req: Request, res: Response) => {
    const { id } = req.params;
    const updatedEvent = req.body;
    try {
        const [updated] = await Event.update(updatedEvent, {
            where: { id }
        });
        if (updated) {
            const event = await Event.findByPk(id);
            res.status(200).json(event);
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating event', error });
    }
};

// Delete an event
export const deleteEvent = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const deleted = await Event.destroy({
            where: { id }
        });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting event', error });
    }
};