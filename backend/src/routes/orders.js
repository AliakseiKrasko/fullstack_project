import express from 'express';
import {deleteOrder, getUserOrders} from '../controllers/ordersController.js';

const router = express.Router();

// GET /orders/:id — заказы пользователя
router.get('/:id', getUserOrders);

router.delete('/:id', deleteOrder);

export default router;