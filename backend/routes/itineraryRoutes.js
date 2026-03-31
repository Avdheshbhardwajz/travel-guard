import express from 'express';
import { updateItinerary, deleteItinerary } from '../controllers/itineraryController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.put('/:id', protect, updateItinerary);
router.delete('/:id', protect, deleteItinerary);

export default router;
