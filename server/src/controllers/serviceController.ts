import { Request, Response } from 'express';
import { Service } from '../models/Service';

// Get all services
export const getAllServices = async (req: Request, res: Response) => {
    try {
        const services = await Service.findAll();
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving services', error });
    }
};

// Get a service by ID
export const getServiceById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const service = await Service.findByPk(id);
        if (service) {
            res.status(200).json(service);
        } else {
            res.status(404).json({ message: 'Service not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving service', error });
    }
};

// Create a new service
export const createService = async (req: Request, res: Response) => {
    const newService = req.body;
    try {
        const service = await Service.create(newService);
        res.status(201).json(service);
    } catch (error) {
        res.status(500).json({ message: 'Error creating service', error });
    }
};

// Update a service
export const updateService = async (req: Request, res: Response) => {
    const { id } = req.params;
    const updatedService = req.body;
    try {
        const [updated] = await Service.update(updatedService, {
            where: { id }
        });
        if (updated) {
            const service = await Service.findByPk(id);
            res.status(200).json(service);
        } else {
            res.status(404).json({ message: 'Service not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating service', error });
    }
};

// Delete a service
export const deleteService = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const deleted = await Service.destroy({
            where: { id }
        });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Service not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting service', error });
    }
};