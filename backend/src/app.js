const router = require('./routes');
const express = require('express');
const pool = require('./db');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

// Test DB call
app.get('/api/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM "TEST"');
        res.json({ success: true, rows: result.rows });
    } catch (error) {
        console.error('Error connecting to the database:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.use('/api', router);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`API server is running at http://localhost:${PORT}`);
});
