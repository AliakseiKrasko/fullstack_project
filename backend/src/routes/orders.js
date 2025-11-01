import express from 'express'
import {addOrder, deleteOrder, getAllOrders, getUserOrders} from '../controllers/ordersController.js'
import {isAdmin, verifyToken} from "../middleware/authMiddleware.js";


const router = express.Router()

// ✅ Админ получает все заказы
router.get('/all', verifyToken, isAdmin, getAllOrders)

// ✅ Пользователь получает свои заказы
router.get('/user/:id', verifyToken, getUserOrders)


// router.get('/user/:id', verifyToken, getUserOrders)
router.post('/', verifyToken, addOrder)
router.delete('/:id', verifyToken, deleteOrder)

export default router