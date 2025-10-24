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
        const { user_id, product_name, amount, image_url } = req.body; // ✅ добавили image_url

        if (!user_id || !product_name || !amount) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const result = await pool.query(
            'INSERT INTO orders (user_id, product_name, amount, image_url) VALUES ($1, $2, $3, $4) RETURNING *',
            [user_id, product_name, amount, image_url] // ✅ передаём image_url
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding order:', error);
        res.status(500).json({ message: 'Failed to add order' });
    }
};

// Удалить заказ по ID
export const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query('DELETE FROM orders WHERE id = $1', [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(204).send();
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ message: 'Failed to delete order' });
    }
};