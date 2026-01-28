import { Router } from 'express';
import { getAllServices, getServiceById, createService, updateService, deleteService } from '../controllers/serviceController';

const router = Router();

// Route pour récupérer tous les services
router.get('/', getAllServices);

// Route pour récupérer un service par ID
router.get('/:id', getServiceById);

// Route pour créer un nouveau service
router.post('/', createService);

// Route pour mettre à jour un service existant
router.put('/:id', updateService);

// Route pour supprimer un service
router.delete('/:id', deleteService);

export default router;