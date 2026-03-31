import express from 'express';
import { updateExpense, deleteExpense } from '../controllers/expenseController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.put('/:id', protect, updateExpense);
router.delete('/:id', protect, deleteExpense);

export default router;
