import express from 'express';
import cors from 'cors';
import usersRouter from './routes/users.js';
import ordersRouter from './routes/orders.js';
import productsRouter from './routes/products.js';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv'
dotenv.config({ path: './.env' })


const app = express();
const PORT = 3000;

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'DELETE'],
    credentials: true,
}));

app.use(express.json());

// Получаем абсолютный путь
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import authRouter from './routes/auth.js'

// Routes
app.use('/users', usersRouter);
app.use('/orders', ordersRouter);
app.use('/products', productsRouter);
app.use('/auth', authRouter)


// ✅ Отдаём папку с картинками
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check
app.get('/', (req, res) => {
    res.json({ message: 'Backend API is running' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`🚀 Backend running on http://localhost:${PORT}`);
});