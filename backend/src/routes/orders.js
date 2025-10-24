import express from 'express';
import {addOrder, deleteOrder, getUserOrders} from '../controllers/ordersController.js';

const router = express.Router();

// GET /orders/:id — заказы пользователя
router.get('/:id', getUserOrders);
// Добавить заказ пользователю
router.post('/', addOrder)

router.delete('/:id', deleteOrder);

export default router;