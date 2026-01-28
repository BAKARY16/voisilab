import { Router } from 'express';
import { 
    createInnovation, 
    getInnovations, 
    getInnovationById, 
    updateInnovation, 
    deleteInnovation 
} from '../controllers/innovationController';

const router = Router();

// Route to create a new innovation
router.post('/', createInnovation);

// Route to get all innovations
router.get('/', getInnovations);

// Route to get a specific innovation by ID
router.get('/:id', getInnovationById);

// Route to update an innovation by ID
router.put('/:id', updateInnovation);

// Route to delete an innovation by ID
router.delete('/:id', deleteInnovation);

export default router;