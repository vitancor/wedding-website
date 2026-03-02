const mysql = require('mysql2');

const db = mysql.createPool({
    host: 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
    user: '3SvyUg4GrPUUCbb.root',  // ← FIXED: lowercase v and y
    password: 'zzCnS8DEoEloQlSh',    // Keep your password
    database: 'test',
    port: 4000,
    ssl: {
        rejectUnauthorized: true
    },
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0
});

db.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Database connection failed:', err.message);
        return;
    }
    console.log('✅ Connected to TiDB Cloud successfully!');
    connection.release();
});

module.exports = db;