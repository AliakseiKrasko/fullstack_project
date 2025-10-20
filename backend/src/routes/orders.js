import express from 'express';
import { getUserOrders, addOrder } from '../controllers/ordersController.js';

const router = express.Router();

// GET /orders/:id — заказы пользователя
router.get('/:id', getUserOrders);

// POST /orders — добавить заказ
router.post('/', addOrder);

export default router;