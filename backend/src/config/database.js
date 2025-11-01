import pkg from 'pg';
import dotenv from 'dotenv'

dotenv.config()
const { Pool } = pkg;

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 5432,
})

// 🛠️ Обработка ошибок соединения
pool.on('error', (err) => {
    console.error('❌ Unexpected error on idle PostgreSQL client:', err)
    process.exit(-1)
})

// ✅ Проверка подключения
pool.connect()
    .then(() => console.log('✅ Connected to PostgreSQL database'))
    .catch((err) => console.error('❌ Database connection failed:', err.message))



export default pool;