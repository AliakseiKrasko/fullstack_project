import express from 'express'
import {
    getAllUsers,
    createUser,
    deleteUser,
    updateUser
} from '../controllers/usersController.js'
import {isAdmin, verifyToken} from "../middleware/authMiddleware.js";


const router = express.Router()

router.get('/', verifyToken, isAdmin, getAllUsers)
router.post('/', verifyToken, isAdmin, createUser)
router.patch('/:id', verifyToken, updateUser) // 👈 PATCH для обновления пользователя
router.delete('/:id', verifyToken, isAdmin, deleteUser)

export default router