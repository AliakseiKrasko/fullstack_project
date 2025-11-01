import express from 'express'
import { addOrder, deleteOrder, getUserOrders } from '../controllers/ordersController.js'
import {verifyToken} from "../middleware/authMiddleware.js";


const router = express.Router()

router.get('/user/:id', verifyToken, getUserOrders)
router.post('/', verifyToken, addOrder)
router.delete('/:id', verifyToken, deleteOrder)

export default router