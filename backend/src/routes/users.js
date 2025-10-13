import express from 'express';
import { getAllUsers, createUser, deleteUser } from '../controllers/usersController.js';

const router = express.Router();

// GET /users - получить всех пользователей
router.get('/', getAllUsers);

// POST /users - создать пользователя
router.post('/', createUser);

// DELETE /users/:id - удалить пользователя
router.delete('/:id', deleteUser);

export default router;