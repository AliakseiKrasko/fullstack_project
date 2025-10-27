import express from 'express'
import {
    getAllUsers,
    createUser,
    deleteUser,
    getUserOrders
} from '../controllers/usersController.js'

import { verifyToken, isAdmin } from '../middleware/authMiddleware.js' // 👈 добавляем middleware

const router = express.Router()

// 👑 Только админ может видеть всех пользователей
router.get('/', verifyToken, isAdmin, getAllUsers)

// 👑 Только админ может создавать пользователей
router.post('/', verifyToken, isAdmin, createUser)

// 👑 Только админ может удалять пользователей
router.delete('/:id', verifyToken, isAdmin, deleteUser)

// 👤 Любой авторизованный пользователь может получить свои заказы
router.get('/:id/orders', verifyToken, getUserOrders)

export default router