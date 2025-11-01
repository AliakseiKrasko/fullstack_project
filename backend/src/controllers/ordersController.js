import pool from '../config/database.js'

// ✅ Получить заказы пользователя
export const getUserOrders = async (req, res) => {
    try {
        const { id } = req.params

        // Проверяем, что пользователь запрашивает свои заказы
        if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
            return res.status(403).json({ message: 'Access denied' })
        }

        const orders = await pool.query('SELECT * FROM orders WHERE user_id = $1', [id])
        res.json(orders.rows)
    } catch (error) {
        console.error('Error fetching orders:', error)
        res.status(500).json({ message: 'Failed to fetch orders' })
    }
}

// ✅ Добавить заказ
export const addOrder = async (req, res) => {
    try {
        const { user_id, product_name, amount, image_url } = req.body

        // Проверяем, что токен принадлежит этому пользователю
        if (req.user.role !== 'admin' && req.user.id !== user_id) {
            return res.status(403).json({ message: 'Access denied' })
        }

        // Проверяем, существует ли пользователь
        const user = await pool.query('SELECT id FROM users_auth WHERE id = $1', [user_id])
        if (user.rows.length === 0) {
            return res.status(400).json({ message: 'User not found' })
        }

        // Проверяем данные заказа
        if (!product_name || typeof product_name !== 'string' || product_name.trim() === '') {
            return res.status(400).json({ message: 'Invalid product name' })
        }
        if (isNaN(amount) || amount <= 0) {
            return res.status(400).json({ message: 'Invalid amount' })
        }

        const result = await pool.query(
            `INSERT INTO orders (user_id, product_name, amount, image_url, order_date)
             VALUES ($1, $2, $3, $4, NOW())
             RETURNING *`,
            [user_id, product_name, amount, image_url || null]
        )

        res.status(201).json({ message: 'Order created', order: result.rows[0] })
    } catch (error) {
        console.error('Error creating order:', error)
        res.status(500).json({ message: 'Failed to create order' })
    }
}

// ✅ Удалить заказ
export const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params

        // Проверяем, существует ли заказ
        const order = await pool.query('SELECT * FROM orders WHERE id = $1', [id])
        if (order.rows.length === 0) {
            return res.status(404).json({ message: 'Order not found' })
        }

        // Проверка прав: только админ или владелец заказа
        if (req.user.role !== 'admin' && req.user.id !== order.rows[0].user_id) {
            return res.status(403).json({ message: 'Access denied' })
        }

        await pool.query('DELETE FROM orders WHERE id = $1', [id])
        res.json({ message: 'Order deleted successfully' })
    } catch (error) {
        console.error('Error deleting order:', error)
        res.status(500).json({ message: 'Failed to delete order' })
    }
}
// 🔹 Все заказы для админа
export const getAllOrders = async (req, res) => {
    try {
        const result = await pool.query(`
    SELECT 
        o.id, 
        o.product_name, 
        o.amount, 
        o.image_url, 
        o.order_date,         
        u.name AS user_name
    FROM orders o
    JOIN users_auth u ON o.user_id = u.id
    ORDER BY o.order_date DESC
`)

        res.json(result.rows)
    } catch (err) {
        console.error('Error fetching all orders:', err)
        res.status(500).json({ message: 'Error fetching all orders' })
    }
}