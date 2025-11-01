import express from 'express'
import {createProduct, deleteProduct, getAllProducts, updateProduct} from '../controllers/productsController.js'
import {verifyToken} from "../middleware/authMiddleware.js";


const router = express.Router()

router.get('/', getAllProducts)
router.post('/', verifyToken, createProduct)
router.delete('/:id', verifyToken, deleteProduct)
router.put('/:id', verifyToken, updateProduct);

export default router