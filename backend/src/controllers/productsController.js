import pool from '../config/database.js'

// ✅ Получить все товары
export const getAllProducts = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM products ORDER BY id ASC')
        res.json(result.rows)
    } catch (error) {
        console.error('Error fetching products:', error)
        res.status(500).json({ message: 'Failed to fetch products' })
    }
}

// ✅ Создать товар
export const createProduct = async (req, res) => {
    try {
        const { name, description, price, image_url } = req.body

        // Проверка роли
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Only admin can create products' })
        }

        // Проверка валидации
        if (!name || typeof name !== 'string' || name.trim() === '') {
            return res.status(400).json({ message: 'Product name is required' })
        }
        if (isNaN(price) || price <= 0) {
            return res.status(400).json({ message: 'Invalid price' })
        }

        const result = await pool.query(
            `INSERT INTO products (name, description, price, image_url, created_at)
             VALUES ($1, $2, $3, $4, NOW())
             RETURNING *`,
            [name, description || '', price, image_url || null]
        )

        res.status(201).json({ message: 'Product created', product: result.rows[0] })
    } catch (error) {
        console.error('Error creating product:', error)
        res.status(500).json({ message: 'Failed to create product' })
    }
}

// ✅ Удалить товар
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params

        // Проверка роли
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Only admin can delete products' })
        }

        // Проверка существования товара
        const product = await pool.query('SELECT * FROM products WHERE id = $1', [id])
        if (product.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' })
        }

        await pool.query('DELETE FROM products WHERE id = $1', [id])
        res.json({ message: 'Product deleted successfully' })
    } catch (error) {
        console.error('Error deleting product:', error)
        res.status(500).json({ message: 'Failed to delete product' })
    }
}