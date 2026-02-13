import { Router } from 'express';
import {
  getAllPpns,
  getPpnById,
  createPpn,
  updatePpn,
  deletePpn
} from '../controllers/ppnController';
import { authenticate } from '../middlewares/auth';

const router = Router();

// Routes publiques (accessible sans authentification)
router.get('/', getAllPpns);
router.get('/:id', getPpnById);

// Routes protégées (nécessitent une authentification admin)
router.post('/', authenticate, createPpn);
router.put('/:id', authenticate, updatePpn);
router.delete('/:id', authenticate, deletePpn);

export default router;
