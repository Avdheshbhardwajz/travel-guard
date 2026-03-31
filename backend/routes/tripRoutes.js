import express from 'express';
import { createTrip, getTrips, getTrip, updateTrip, deleteTrip, getDashboardStats } from '../controllers/tripController.js';
import { addItinerary, getItinerary } from '../controllers/itineraryController.js';
import { addExpense, getExpenses } from '../controllers/expenseController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Dashboard stats
router.get('/stats', protect, getDashboardStats);

// Trip CRUD
router.get('/', protect, getTrips);
router.post('/', protect, createTrip);
router.get('/:id', protect, getTrip);
router.put('/:id', protect, updateTrip);
router.delete('/:id', protect, deleteTrip);

// Nested itinerary routes
router.post('/:tripId/itinerary', protect, addItinerary);
router.get('/:tripId/itinerary', protect, getItinerary);

// Nested expense routes
router.post('/:tripId/expenses', protect, addExpense);
router.get('/:tripId/expenses', protect, getExpenses);

export default router;
