import pool from '../config/database.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'


dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET

// ✅ Регистрация
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password)
            return res.status(400).json({ message: 'All fields are required' })

        const userExists = await pool.query('SELECT * FROM users_auth WHERE email = $1', [email])
        if (userExists.rows.length > 0)
            return res.status(400).json({ message: 'User already exists' })

        const hashedPassword = await bcrypt.hash(password, 10)

        const result = await pool.query(
            `INSERT INTO users_auth (name, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, role, created_at`,
            [name, email, hashedPassword]
        )

        res.status(201).json(result.rows[0])
    } catch (error) {
        console.error('Error registering user:', error)
        res.status(500).json({ message: 'Failed to register user' })
    }
}

// ✅ Логин
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await pool.query('SELECT * FROM users_auth WHERE email = $1', [email])
        if (user.rows.length === 0)
            return res.status(400).json({ message: 'Invalid email or password' })

        const validPassword = await bcrypt.compare(password, user.rows[0].password)
        if (!validPassword)
            return res.status(400).json({ message: 'Invalid email or password' })

        const token = jwt.sign(
            {
                id: user.rows[0].id,
                email: user.rows[0].email,
                role: user.rows[0].role,
            },
            JWT_SECRET,
            { expiresIn: '2h' }
        )

        res.json({ token })
    } catch (error) {
        console.error('Error logging in:', error)
        res.status(500).json({ message: 'Login failed' })
    }
}