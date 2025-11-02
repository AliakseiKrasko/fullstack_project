import express from 'express'
import {createProduct, deleteProduct, getAllProducts, updateProduct} from '../controllers/productsController.js'
import {verifyToken} from "../middleware/authMiddleware.js";
import db from '../config/database.js'


const router = express.Router()

router.get('/', getAllProducts)
router.post('/', verifyToken, createProduct)
router.delete('/:id', verifyToken, deleteProduct)
router.put('/:id', verifyToken, updateProduct);

// ⭐ Обновление рейтинга товара
router.patch('/:id/rating', async (req, res) => {
    try {
        const { rating } = req.body
        const { id } = req.params

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Invalid rating value' })
        }

        await db.query('UPDATE products SET rating = $1 WHERE id = $2', [rating, id])

        res.json({ message: 'Rating updated successfully!' })
    } catch (error) {
        console.error('Error updating rating:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
})

export default router