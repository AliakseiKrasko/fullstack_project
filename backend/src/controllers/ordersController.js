import pool from '../config/database.js';

// Получить заказы конкретного пользователя
export const getUserOrders = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || isNaN(id)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const result = await pool.query(
            'SELECT * FROM orders WHERE user_id = $1 ORDER BY order_date DESC',
            [id]
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Failed to fetch orders' });
    }
};

// Добавить заказ пользователю
export const addOrder = async (req, res) => {
    try {
        const { user_id, product_name, amount } = req.body;

        // Проверка входных данных
        if (!user_id || !product_name || !amount) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Вставка в базу
        const result = await pool.query(
            'INSERT INTO orders (user_id, product_name, amount) VALUES ($1, $2, $3) RETURNING *',
            [user_id, product_name, amount]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding order:', error);
        res.status(500).json({ message: 'Failed to add order' });
    }
};