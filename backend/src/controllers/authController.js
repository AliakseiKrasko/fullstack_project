import pool from '../config/database.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

// ✅ Безопасный fallback, если .env не загружен
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key'

// Вспомогательная функция для email
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

// ✅ Генерация access и refresh токенов
const generateTokens = (user) => {
    try {
        const accessToken = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '15m' } // короткий срок для безопасности
        )

        const refreshToken = jwt.sign(
            { id: user.id },
            JWT_SECRET,
            { expiresIn: '7d' } // refresh на неделю
        )

        return { accessToken, refreshToken }
    } catch (error) {
        console.error('Error generating token:', error)
        throw new Error('Token generation failed')
    }
}

// ✅ Регистрация
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' })
        }

        if (!isValidEmail(email)) {
            return res.status(400).json({ message: 'Invalid email format' })
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password too short (min 6 chars)' })
        }

        const userExists = await pool.query('SELECT * FROM users_auth WHERE email = $1', [email])
        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: 'User already exists' })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const result = await pool.query(
            `INSERT INTO users_auth (name, email, password)
             VALUES ($1, $2, $3)
             RETURNING id, name, email, role, created_at`,
            [name, email, hashedPassword]
        )

        const newUser = result.rows[0]
        const tokens = generateTokens(newUser)

        res.status(201).json({
            message: 'User registered successfully',
            user: newUser,
            ...tokens,
        })
    } catch (error) {
        console.error('Error registering user:', error)
        res.status(500).json({ message: 'Failed to register user' })
    }
}

// ✅ Логин
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' })
        }

        const user = await pool.query('SELECT * FROM users_auth WHERE email = $1', [email])
        if (user.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid email or password' })
        }

        const validPassword = await bcrypt.compare(password, user.rows[0].password)
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid email or password' })
        }

        const tokens = generateTokens(user.rows[0])

        res.json({
            message: 'Login successful',
            ...tokens,
        })
    } catch (error) {
        console.error('Error logging in:', error)
        res.status(500).json({ message: 'Login failed' })
    }
}

// ✅ Refresh токена
export const refreshToken = async (req, res) => {
    try {
        const { token } = req.body

        if (!token) {
            return res.status(400).json({ message: 'Refresh token required' })
        }

        const decoded = jwt.verify(token, JWT_SECRET)

        // ⚠️ Можно добавить проверку пользователя в базе, если нужно
        const result = await pool.query('SELECT * FROM users_auth WHERE id = $1', [decoded.id])
        const user = result.rows[0]
        if (!user) return res.status(404).json({ message: 'User not found' })

        // Генерируем новый access токен
        const newAccessToken = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '15m' }
        )

        res.json({
            accessToken: newAccessToken,
            message: 'Access token refreshed successfully',
        })
    } catch (error) {
        console.error('Error refreshing token:', error)
        res.status(403).json({ message: 'Invalid or expired refresh token' })
    }
}