import express from 'express';
import cors from 'cors';
import usersRouter from './routes/users.js';

const app = express();
const PORT = 3000;

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'DELETE'],
    credentials: true,
}));

app.use(express.json());

// Routes
app.use('/users', usersRouter);

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