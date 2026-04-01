import express from 'express';
import { generateShareLink, revokeShareLink, getSharedTrip } from '../controllers/shareController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Authenticated routes
router.post('/trips/:id/share', protect, generateShareLink);
router.delete('/trips/:id/share', protect, revokeShareLink);

// Public route (no auth)
router.get('/shared/:token', getSharedTrip);

export default router;
