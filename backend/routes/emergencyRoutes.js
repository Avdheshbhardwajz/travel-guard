import express from 'express';
import {
  getEmergencyContacts,
  addEmergencyContact,
  updateEmergencyContact,
  deleteEmergencyContact,
} from '../controllers/emergencyController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getEmergencyContacts);
router.post('/', protect, addEmergencyContact);
router.put('/:id', protect, updateEmergencyContact);
router.delete('/:id', protect, deleteEmergencyContact);

export default router;
