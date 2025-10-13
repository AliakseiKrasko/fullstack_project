import express from 'express';
import {
    getAllUsers,
    createUser,
    deleteUser,
    getUserOrders
} from '../controllers/usersController.js';

const router = express.Router();

// GET /users - получить всех пользователей
router.get('/', getAllUsers);

// POST /users - создать пользователя
router.post('/', createUser);

// DELETE /users/:id - удалить пользователя
router.delete('/:id', deleteUser);

// ✅ Новый маршрут — получить заказы конкретного пользователя
router.get('/:id/orders', getUserOrders);

export default router;