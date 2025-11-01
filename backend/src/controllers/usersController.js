import pool from '../config/database.js'

// ✅ Получить всех пользователей (только для админов)
export const getAllUsers = async (req, res) => {
    try {
        const result = await pool.query('SELECT id, name, email, role, created_at FROM users_auth ORDER BY id ASC')
        res.json(result.rows)
    } catch (error) {
        console.error('Error fetching users:', error)
        res.status(500).json({ success: false, message: 'Failed to fetch users' })
    }
}

// ✅ Создать пользователя (только для админов)
export const createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required' })
        }

        const existing = await pool.query('SELECT id FROM users_auth WHERE email = $1', [email])
        if (existing.rows.length > 0) {
            return res.status(400).json({ success: false, message: 'User already exists' })
        }

        await pool.query(
            `INSERT INTO users_auth (name, email, password, role)
             VALUES ($1, $2, $3, $4)`,
            [name, email, password, role || 'user']
        )

        res.status(201).json({ success: true, message: 'User created successfully' })
    } catch (error) {
        console.error('Error creating user:', error)
        res.status(500).json({ success: false, message: 'Failed to create user' })
    }
}

// ✅ Обновить пользователя (админ или сам пользователь)
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params
        const { name, email, role } = req.body

        // Проверяем, имеет ли право пользователь обновлять
        if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
            return res.status(403).json({ success: false, message: 'Access denied' })
        }

        // Проверяем, существует ли пользователь
        const existing = await pool.query('SELECT id FROM users_auth WHERE id = $1', [id])
        if (existing.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' })
        }

        const result = await pool.query(
            `UPDATE users_auth
             SET name = COALESCE($1, name),
                 email = COALESCE($2, email),
                 role = COALESCE($3, role)
             WHERE id = $4
             RETURNING id, name, email, role`,
            [name, email, role, id]
        )

        res.json({ success: true, message: 'User updated successfully', user: result.rows[0] })
    } catch (error) {
        console.error('Error updating user:', error)
        res.status(500).json({ success: false, message: 'Failed to update user' })
    }
}

// ✅ Удалить пользователя (только для админов)
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params
        await pool.query('DELETE FROM users_auth WHERE id = $1', [id])
        res.json({ success: true, message: 'User deleted successfully' })
    } catch (error) {
        console.error('Error deleting user:', error)
        res.status(500).json({ success: false, message: 'Failed to delete user' })
    }
}