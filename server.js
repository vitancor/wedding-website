const express = require('express');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

// Search guest by name - CASE INSENSITIVE and NO DUPLICATES
app.get('/api/guests/search/:name', (req, res) => {
    const searchName = req.params.name;
    
    // Use LOWER for case-insensitive search and DISTINCT to avoid duplicates
    const sql = 'SELECT DISTINCT full_name, table_number, table_name FROM guests WHERE LOWER(full_name) LIKE LOWER(?)';
    
    db.query(sql, [`%${searchName}%`], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Server error' });
        }
        res.json(results);
    });
});

// Get all guests - with DISTINCT to avoid duplicates
app.get('/api/guests', (req, res) => {
    const sql = 'SELECT DISTINCT full_name, table_number, table_name FROM guests ORDER BY full_name';
    
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Server error' });
        }
        res.json(results);
    });
});

// Optional: Add a health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});