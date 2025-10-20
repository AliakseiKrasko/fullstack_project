import express from 'express';
import {deleteProduct, getAllProducts} from '../controllers/productsController.js';

const router = express.Router();

router.get('/', getAllProducts);
router.delete('/:id', deleteProduct);

export default router;