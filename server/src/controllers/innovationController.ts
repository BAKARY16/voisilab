import { Request, Response } from 'express';
import Innovation from '../models/Innovation';

// Get all innovations
export const getInnovations = async (req: Request, res: Response) => {
    try {
        const innovations = await Innovation.findAll();
        res.status(200).json(innovations);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving innovations', error });
    }
};

// Get a single innovation by ID
export const getInnovationById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const innovation = await Innovation.findByPk(id);
        if (innovation) {
            res.status(200).json(innovation);
        } else {
            res.status(404).json({ message: 'Innovation not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving innovation', error });
    }
};

// Create a new innovation
export const createInnovation = async (req: Request, res: Response) => {
    const newInnovation = req.body;
    try {
        const innovation = await Innovation.create(newInnovation);
        res.status(201).json(innovation);
    } catch (error) {
        res.status(500).json({ message: 'Error creating innovation', error });
    }
};

// Update an existing innovation
export const updateInnovation = async (req: Request, res: Response) => {
    const { id } = req.params;
    const updatedData = req.body;
    try {
        const [updated] = await Innovation.update(updatedData, {
            where: { id }
        });
        if (updated) {
            const updatedInnovation = await Innovation.findByPk(id);
            res.status(200).json(updatedInnovation);
        } else {
            res.status(404).json({ message: 'Innovation not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating innovation', error });
    }
};

// Delete an innovation
export const deleteInnovation = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const deleted = await Innovation.destroy({
            where: { id }
        });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Innovation not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting innovation', error });
    }
};