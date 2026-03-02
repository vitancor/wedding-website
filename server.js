const express = require('express');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

// Search guest by name - NOW INCLUDES table_name
app.get('/api/guests/search/:name', (req, res) => {
    const searchName = req.params.name;
    
    const sql = 'SELECT full_name, table_number, table_name FROM guests WHERE full_name LIKE ?';
    
    db.query(sql, [`%${searchName}%`], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Server error' });
        }
        res.json(results);
    });
});

// Get all guests
app.get('/api/guests', (req, res) => {
    db.query('SELECT * FROM guests ORDER BY full_name', (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Server error' });
        }
        res.json(results);
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});