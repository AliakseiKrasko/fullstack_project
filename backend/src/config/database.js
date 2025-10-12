import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '992301',
    database: 'practice_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

export default pool;