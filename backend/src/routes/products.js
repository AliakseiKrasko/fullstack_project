import express from 'express'
import { createProduct, deleteProduct, getAllProducts } from '../controllers/productsController.js'
import {verifyToken} from "../middleware/authMiddleware.js";


const router = express.Router()

router.get('/', getAllProducts)
router.post('/', verifyToken, createProduct)
router.delete('/:id', verifyToken, deleteProduct)

export default router