import pool from '../config/database.js';

// Валидация email
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Получить всех пользователей
export const getAllUsers = async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM users ORDER BY created_at DESC'
        );
        res.json(rows);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Failed to fetch users' });
    }
};

// Создать пользователя
export const createUser = async (req, res) => {
    try {
        const { name, email } = req.body;

        // Валидация
        if (!name || !name.trim()) {
            return res.status(400).json({ message: 'Name is required' });
        }

        if (!email || !email.trim()) {
            return res.status(400).json({ message: 'Email is required' });
        }

        if (!isValidEmail(email)) {
            return res.status(400).json({ message: 'Email must be valid' });
        }

        if (name.length > 100) {
            return res.status(400).json({ message: 'Name is too long (max 100 characters)' });
        }

        if (email.length > 150) {
            return res.status(400).json({ message: 'Email is too long (max 150 characters)' });
        }

        // Создание пользователя
        const [result] = await pool.query(
            'INSERT INTO users (name, email) VALUES (?, ?)',
            [name.trim(), email.trim()]
        );

        // Получение созданного пользователя
        const [rows] = await pool.query(
            'SELECT * FROM users WHERE id = ?',
            [result.insertId]
        );

        res.status(201).json(rows[0]);
    } catch (error) {
        console.error('Error creating user:', error);

        // Проверка на дубликат email (если есть unique constraint)
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Email already exists' });
        }

        res.status(500).json({ message: 'Failed to create user' });
    }
};

// Удалить пользователя
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Валидация ID
        if (!id || isNaN(id)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: `User with ID ${id} not found` });
        }

        res.status(204).send();
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Failed to delete user' });
    }
};