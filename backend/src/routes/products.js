import express from 'express';
import {createProduct, deleteProduct, getAllProducts} from '../controllers/productsController.js';

const router = express.Router();

router.get('/', getAllProducts);
router.delete('/:id', deleteProduct);
router.post('/', createProduct);

export default router;