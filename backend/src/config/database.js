import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',       // имя пользователя PostgreSQL
    password: '992301',     // твой пароль при установке
    database: 'fullstack_db', // <-- именно твоя база
    port: 5432,             // стандартный порт PostgreSQL
});


export default pool;