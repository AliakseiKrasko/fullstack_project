import pool from '../config/database.js'

// 📧 Проверка email
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

// 👤 Получить всех пользователей (только админ)
export const getAllUsers = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, name, email, role, created_at FROM users_auth ORDER BY created_at DESC'
        )
        res.json(result.rows)
    } catch (error) {
        console.error('Error fetching users:', error)
        res.status(500).json({ message: 'Failed to fetch users' })
    }
}

// ➕ Создать пользователя (только админ)
export const createUser = async (req, res) => {
    try {
        const { name, email, role = 'user' } = req.body

        if (!name?.trim() || !email?.trim()) {
            return res.status(400).json({ message: 'Name and email are required' })
        }
        if (!isValidEmail(email)) {
            return res.status(400).json({ message: 'Email must be valid' })
        }

        const result = await pool.query(
            'INSERT INTO users_auth (name, email, role) VALUES ($1, $2, $3) RETURNING id, name, email, role, created_at',
            [name.trim(), email.trim(), role]
        )

        res.status(201).json(result.rows[0])
    } catch (error) {
        console.error('Error creating user:', error)
        if (error.code === '23505') {
            return res.status(400).json({ message: 'Email already exists' })
        }
        res.status(500).json({ message: 'Failed to create user' })
    }
}

// ❌ Удалить пользователя (только админ)
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params
        if (!id || isNaN(id)) {
            return res.status(400).json({ message: 'Invalid user ID' })
        }

        const result = await pool.query('DELETE FROM users_auth WHERE id = $1', [id])

        if (result.rowCount === 0) {
            return res.status(404).json({ message: `User with ID ${id} not found` })
        }

        res.status(204).send()
    } catch (error) {
        console.error('Error deleting user:', error)
        res.status(500).json({ message: 'Failed to delete user' })
    }
}

// 📦 Заказы конкретного пользователя (видит только себя или админ)
export const getUserOrders = async (req, res) => {
    try {
        const { id } = req.params

        if (!id || isNaN(id)) {
            return res.status(400).json({ message: 'Invalid user ID' })
        }

        if (req.user.role !== 'admin' && req.user.id !== parseInt(id, 10)) {
            return res.status(403).json({ message: 'Access denied: You can view only your orders' })
        }

        const result = await pool.query(
            'SELECT * FROM orders WHERE user_id = $1 ORDER BY order_date DESC',
            [id]
        )

        res.json(result.rows)
    } catch (error) {
        console.error('Error fetching user orders:', error)
        res.status(500).json({ message: 'Failed to fetch user orders' })
    }
}