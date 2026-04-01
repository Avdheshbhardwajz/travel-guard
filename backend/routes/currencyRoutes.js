import express from 'express';
import { getExchangeRates, convertCurrency } from '../controllers/currencyController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/rates', protect, getExchangeRates);
router.get('/convert', protect, convertCurrency);

export default router;
