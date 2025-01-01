// routes/vnpay.js
import express from 'express';
import { vnpayReturn } from '../controllers/vnpay.controller.js';

const router = express.Router();

// Định nghĩa route callback VNPay
router.get('/vnpay-return', vnpayReturn);

export default router;
